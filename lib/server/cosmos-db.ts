import "server-only";
import { createHash } from "node:crypto";
import { Container, CosmosClient } from "@azure/cosmos";
import type { Attribution, WaitlistEntry, WaitlistSubmission } from "@/lib/waitlist-shared";

const DATABASE_ID = process.env.COSMOS_DATABASE || "waitlist";
const CONTAINER_ID = "leads";

export function isCosmosConfigured(): boolean {
  return Boolean(process.env.COSMOS_ENDPOINT && process.env.COSMOS_KEY);
}

let client: CosmosClient | null = null;
let containerPromise: Promise<Container> | null = null;

function getClient(): CosmosClient {
  if (!client) {
    client = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT!,
      key: process.env.COSMOS_KEY!,
    });
  }
  return client;
}

/** Cached init promise; reset on failure so transient errors retry. */
function getContainer(): Promise<Container> {
  if (!containerPromise) {
    containerPromise = (async () => {
      const { database } = await getClient().databases.createIfNotExists({
        id: DATABASE_ID,
      });
      const { container } = await database.containers.createIfNotExists({
        id: CONTAINER_ID,
        partitionKey: { paths: ["/email"] },
      });
      return container;
    })().catch((err) => {
      containerPromise = null;
      throw err;
    });
  }
  return containerPromise;
}

/**
 * Deterministic doc id. Concurrent first-time saves both pass the existence
 * check; with the same id Cosmos rejects the second create (409) and the
 * caller merges into the winner. Hash, not raw email — Cosmos ids forbid
 * some characters emails allow.
 */
export function emailToId(email: string): string {
  return createHash("sha256").update(email.toLowerCase().trim()).digest("hex");
}

const clip = (s: string | undefined, max: number) =>
  s === undefined ? undefined : s.slice(0, max);

function clipAttribution(a: Attribution | undefined): Attribution | undefined {
  if (!a) return undefined;
  const out: Attribution = {};
  for (const [k, v] of Object.entries(a)) {
    if (typeof v === "string") (out as Record<string, string>)[k] = v.slice(0, 500);
  }
  return out;
}

async function readById(container: Container, id: string, email: string) {
  try {
    const { resource } = await container
      .item(id, email)
      .read<WaitlistEntry>();
    return resource ?? null;
  } catch (err) {
    if ((err as { code?: number }).code === 404) return null;
    throw err;
  }
}

export type SaveResult = "created" | "updated" | "duplicate";

export async function saveWaitlistEntry(
  submission: WaitlistSubmission,
  now = new Date().toISOString()
): Promise<SaveResult> {
  const container = await getContainer();
  const email = submission.email;
  const id = emailToId(email);

  const incoming: WaitlistEntry = {
    id,
    email,
    firstName: clip(submission.firstName, 200),
    businessName: clip(submission.businessName, 200),
    phone: clip(submission.phone, 50),
    revenueRange: submission.revenueRange,
    biggestProblem: clip(submission.biggestProblem, 5000),
    triedSoFar: submission.triedSoFar,
    stage: submission.stage,
    lastStep: submission.step,
    source: clip(submission.source, 500),
    attribution: clipAttribution(submission.attribution),
    createdAt: now,
    updatedAt: now,
  };

  const existing = await readById(container, id, email);

  if (!existing) {
    try {
      await container.items.create(incoming);
      return "created";
    } catch (err) {
      if ((err as { code?: number }).code !== 409) throw err;
      // Lost a concurrent race — fall through and merge into the winner.
    }
  }

  const current = existing ?? (await readById(container, id, email));
  if (!current) throw new Error("Waitlist entry vanished during save");

  // Never clobber a completed submission with new answers.
  if (current.stage === "complete") {
    return "duplicate";
  }

  const merged: WaitlistEntry = {
    ...current,
    firstName: incoming.firstName ?? current.firstName,
    businessName: incoming.businessName ?? current.businessName,
    phone: incoming.phone ?? current.phone,
    revenueRange: incoming.revenueRange ?? current.revenueRange,
    biggestProblem: incoming.biggestProblem ?? current.biggestProblem,
    triedSoFar: incoming.triedSoFar ?? current.triedSoFar,
    stage: incoming.stage === "complete" ? "complete" : current.stage,
    lastStep: Math.max(current.lastStep ?? 0, incoming.lastStep),
    source: current.source ?? incoming.source,
    // First save wins; later saves only fill gaps.
    attribution: current.attribution ?? incoming.attribution,
    updatedAt: now,
  };

  await container.item(id, email).replace(merged);
  return "updated";
}

/** First booking wins. A paying lead with no doc gets a minimal one — never dropped. */
export async function markPaidCallBooked(
  email: string,
  uris: { eventUri: string; inviteeUri: string },
  name?: string
): Promise<void> {
  const container = await getContainer();
  const normalized = email.toLowerCase().trim();
  const id = emailToId(normalized);
  const now = new Date().toISOString();

  const existing = await readById(container, id, normalized);
  if (!existing) {
    const minimal: WaitlistEntry = {
      id,
      email: normalized,
      firstName: clip(name, 200),
      stage: "partial",
      lastStep: 0,
      paidCallBooked: true,
      calendlyEventUri: uris.eventUri.slice(0, 500),
      calendlyInviteeUri: uris.inviteeUri.slice(0, 500),
      createdAt: now,
      updatedAt: now,
    };
    try {
      await container.items.create(minimal);
      return;
    } catch (err) {
      if ((err as { code?: number }).code !== 409) throw err;
    }
  }

  const current = existing ?? (await readById(container, id, normalized));
  if (!current) return;
  if (current.paidCallBooked) return; // first booking wins

  await container.item(id, normalized).replace({
    ...current,
    paidCallBooked: true,
    calendlyEventUri: uris.eventUri.slice(0, 500),
    calendlyInviteeUri: uris.inviteeUri.slice(0, 500),
    updatedAt: now,
  });
}

/** Fold `b` into `a` (a is the older/kept doc). Completion and booking are sticky. */
function mergeEntries(a: WaitlistEntry, b: WaitlistEntry): WaitlistEntry {
  return {
    ...a,
    firstName: a.firstName ?? b.firstName,
    businessName: a.businessName ?? b.businessName,
    phone: a.phone ?? b.phone,
    revenueRange: a.revenueRange ?? b.revenueRange,
    biggestProblem: a.biggestProblem ?? b.biggestProblem,
    triedSoFar: a.triedSoFar ?? b.triedSoFar,
    stage: a.stage === "complete" || b.stage === "complete" ? "complete" : a.stage,
    lastStep: Math.max(a.lastStep ?? 0, b.lastStep ?? 0),
    source: a.source ?? b.source,
    attribution: a.attribution ?? b.attribution,
    paidCallBooked: a.paidCallBooked || b.paidCallBooked || undefined,
    calendlyEventUri: a.calendlyEventUri ?? b.calendlyEventUri,
    calendlyInviteeUri: a.calendlyInviteeUri ?? b.calendlyInviteeUri,
    updatedAt: new Date().toISOString(),
  };
}

/** Merge rows sharing an email (keep oldest). Safe to re-run. */
export async function dedupeWaitlistEntries(): Promise<{
  merged: number;
  removed: number;
}> {
  const container = await getContainer();
  const all = await fetchAllWaitlistEntries();
  const byEmail = new Map<string, WaitlistEntry[]>();
  for (const entry of all) {
    const key = entry.email.toLowerCase().trim();
    const list = byEmail.get(key) ?? [];
    list.push(entry);
    byEmail.set(key, list);
  }

  let merged = 0;
  let removed = 0;
  for (const [, entries] of byEmail) {
    if (entries.length < 2) continue;
    entries.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
    let keeper = entries[0];
    for (const dupe of entries.slice(1)) {
      keeper = mergeEntries(keeper, dupe);
      await container.item(dupe.id, dupe.email).delete();
      removed++;
    }
    await container.item(keeper.id, keeper.email).replace(keeper);
    merged++;
  }
  return { merged, removed };
}

export async function listWaitlistEntries(
  offset: number,
  limit: number
): Promise<{ entries: WaitlistEntry[]; hasMore: boolean }> {
  const container = await getContainer();
  // Fetch limit+1 to learn hasMore in one round trip.
  const { resources } = await container.items
    .query<WaitlistEntry>({
      query:
        "SELECT * FROM c ORDER BY c.createdAt DESC OFFSET @offset LIMIT @limit",
      parameters: [
        { name: "@offset", value: offset },
        { name: "@limit", value: limit + 1 },
      ],
    })
    .fetchAll();
  return {
    entries: resources.slice(0, limit),
    hasMore: resources.length > limit,
  };
}

export async function searchWaitlistEntries(options: {
  text?: string;
  from?: string;
  to?: string;
  limit?: number;
}): Promise<WaitlistEntry[]> {
  const container = await getContainer();
  const clauses: string[] = [];
  const parameters: { name: string; value: string | number }[] = [];

  if (options.text) {
    clauses.push(
      "(CONTAINS(LOWER(c.email), @text) OR CONTAINS(LOWER(c.firstName), @text) OR CONTAINS(LOWER(c.businessName), @text))"
    );
    parameters.push({ name: "@text", value: options.text.toLowerCase().slice(0, 200) });
  }
  if (options.from) {
    clauses.push("c.createdAt >= @from");
    parameters.push({ name: "@from", value: options.from });
  }
  if (options.to) {
    clauses.push("c.createdAt <= @to");
    parameters.push({ name: "@to", value: options.to });
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const limit = Math.min(options.limit ?? 200, 500);
  const { resources } = await container.items
    .query<WaitlistEntry>({
      query: `SELECT * FROM c ${where} ORDER BY c.createdAt DESC OFFSET 0 LIMIT ${limit}`,
      parameters,
    })
    .fetchAll();
  return resources;
}

export async function countWaitlistEntries(since?: string): Promise<number> {
  const container = await getContainer();
  const where = since ? "WHERE c.createdAt >= @since" : "";
  const { resources } = await container.items
    .query<number>({
      query: `SELECT VALUE COUNT(1) FROM c ${where}`,
      parameters: since ? [{ name: "@since", value: since }] : [],
    })
    .fetchAll();
  return resources[0] ?? 0;
}

export async function fetchAllWaitlistEntries(): Promise<WaitlistEntry[]> {
  const container = await getContainer();
  const { resources } = await container.items
    .query<WaitlistEntry>("SELECT * FROM c ORDER BY c.createdAt ASC")
    .fetchAll();
  return resources;
}
