"use client";

// Single-operator admin panel. Auth = password replayed as X-Admin-Password
// from sessionStorage; any 401 auto-logs-out. No cookies, no JWT.

import { useCallback, useEffect, useRef, useState } from "react";
import { entriesToCsv } from "@/lib/waitlist-csv";
import type { WaitlistEntry } from "@/lib/waitlist-shared";

const PASSWORD_KEY = "hf-admin-password";
const PAGE_SIZE = 25;

type Status = "checking" | "login" | "ready" | "notConfigured";

type ListResponse = {
  ok: boolean;
  entries: WaitlistEntry[];
  hasMore: boolean;
  total: number;
  last7Days: number;
};

export default function AdminPage() {
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [last7Days, setLast7Days] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const isFiltering = Boolean(query.trim() || from || to);
  const debounceRef = useRef<number | null>(null);

  const authedFetch = useCallback(async (path: string, init?: RequestInit) => {
    const pw = sessionStorage.getItem(PASSWORD_KEY) ?? "";
    const res = await fetch(path, {
      ...init,
      headers: { ...(init?.headers ?? {}), "X-Admin-Password": pw },
    });
    if (res.status === 401) {
      sessionStorage.removeItem(PASSWORD_KEY);
      setStatus("login");
      throw new Error("unauthorized");
    }
    return res;
  }, []);

  const loadPage = useCallback(
    async (offset: number, append: boolean) => {
      setLoading(true);
      try {
        const res = await authedFetch(
          `/api/admin/waitlist?offset=${offset}&limit=${PAGE_SIZE}`
        );
        if (res.status === 503) {
          setStatus("notConfigured");
          return;
        }
        const body = (await res.json()) as ListResponse;
        if (!body.ok) throw new Error("list failed");
        setEntries((prev) => (append ? [...prev, ...body.entries] : body.entries));
        setHasMore(body.hasMore);
        setTotal(body.total);
        setLast7Days(body.last7Days);
        setStatus("ready");
      } catch (err) {
        if ((err as Error).message !== "unauthorized") {
          setNotice("Could not load entries. Try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [authedFetch]
  );

  const runSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (from) params.set("from", new Date(from).toISOString());
      if (to) params.set("to", new Date(`${to}T23:59:59`).toISOString());
      const res = await authedFetch(`/api/admin/waitlist/search?${params}`);
      if (res.status === 503) {
        setStatus("notConfigured");
        return;
      }
      const body = (await res.json()) as { ok: boolean; entries: WaitlistEntry[] };
      if (body.ok) {
        setEntries(body.entries);
        setHasMore(false);
      }
    } catch {
      // 401 handled in authedFetch
    } finally {
      setLoading(false);
    }
  }, [authedFetch, query, from, to]);

  // First load: replay stored password if present
  const init = useCallback(async () => {
    if (!sessionStorage.getItem(PASSWORD_KEY)) {
      setStatus("login");
      return;
    }
    await loadPage(0, false);
  }, [loadPage]);

  useEffect(() => {
    // Initial data load on mount; the sync setState is the login redirect
    // when no password is stored — intentional, not a cascading render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void init();
  }, [init]);

  // Debounced search on filter change
  useEffect(() => {
    if (status !== "ready") return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      if (isFiltering) void runSearch();
      else void loadPage(0, false);
    }, 350);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, from, to]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError("");
      sessionStorage.setItem(PASSWORD_KEY, password);
      setStatus("checking");
      await loadPage(0, false);
      // A 401 inside loadPage clears the stored password and flips to login.
      if (!sessionStorage.getItem(PASSWORD_KEY)) {
        setLoginError("That password didn't work.");
      }
    },
    [password, loadPage]
  );

  const handleExport = useCallback(async () => {
    try {
      const res = await authedFetch("/api/admin/waitlist/export");
      if (!res.ok) {
        setNotice("Export failed.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "waitlist-export.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // handled
    }
  }, [authedFetch]);

  // Per-entry download: the full entry is already on the client, so the CSV
  // is built locally — same columns as the bulk export.
  const handleDownloadEntry = useCallback((entry: WaitlistEntry) => {
    const blob = new Blob([entriesToCsv([entry])], {
      type: "text/csv;charset=utf-8",
    });
    const slug =
      (entry.firstName || entry.email).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "entry";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lead-${slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleDedupe = useCallback(async () => {
    if (!window.confirm("Merge duplicate rows sharing an email? This cannot be undone.")) {
      return;
    }
    try {
      const res = await authedFetch("/api/admin/waitlist/dedupe", { method: "POST" });
      const body = (await res.json()) as { ok: boolean; merged?: number; removed?: number };
      if (body.ok) {
        setNotice(`Merged ${body.merged ?? 0} email(s), removed ${body.removed ?? 0} duplicate row(s).`);
        void loadPage(0, false);
      } else {
        setNotice("Dedupe failed.");
      }
    } catch {
      // handled
    }
  }, [authedFetch, loadPage]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(PASSWORD_KEY);
    setEntries([]);
    setStatus("login");
  }, []);

  if (status === "checking") {
    return (
      <main className="mx-auto w-full max-w-5xl px-5 py-16">
        <div className="skeleton h-8 w-48" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="skeleton h-24" />
          <div className="skeleton h-24" />
        </div>
        <div className="skeleton mt-6 h-64" />
      </main>
    );
  }

  if (status === "login") {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-5 py-16">
        <h1 className="text-title">Admin</h1>
        <form onSubmit={handleLogin} className="mt-6 grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field min-h-11 rounded-lg px-3.5"
              required
            />
          </label>
          <p aria-live="polite" className={loginError ? "text-sm font-medium" : "sr-only"}>
            {loginError}
          </p>
          <button
            type="submit"
            className="pressable min-h-11 rounded-lg bg-accent font-semibold text-accent-contrast hover:opacity-90"
          >
            Sign in
          </button>
        </form>
      </main>
    );
  }

  if (status === "notConfigured") {
    return (
      <main className="mx-auto w-full max-w-xl px-5 py-16">
        <h1 className="text-title">Database not configured</h1>
        <p className="mt-3 text-muted">
          The password checked out, but lead storage is not set up. Add
          <code className="mx-1 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm">COSMOS_ENDPOINT</code>,
          <code className="mx-1 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm">COSMOS_KEY</code> and
          <code className="mx-1 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm">COSMOS_DATABASE</code>
          to the environment, then redeploy.
        </p>
        <button
          type="button"
          onClick={logout}
          className="pressable mt-6 min-h-11 rounded-lg border border-line px-5 font-medium hover:bg-surface-2"
        >
          Sign out
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:py-14">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-title">Waitlist</h1>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            className="pressable min-h-10 rounded-lg border border-line px-4 text-sm font-medium hover:bg-surface-2"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={handleDedupe}
            className="pressable min-h-10 rounded-lg border border-line px-4 text-sm font-medium hover:bg-surface-2"
          >
            Merge duplicates
          </button>
          <button
            type="button"
            onClick={logout}
            className="pressable min-h-10 rounded-lg px-4 text-sm font-medium text-muted hover:bg-surface-2 hover:text-fg"
          >
            Sign out
          </button>
        </div>
      </header>

      <p aria-live="polite" className={notice ? "mt-4 rounded-lg bg-accent-soft px-3 py-2 text-sm" : "sr-only"}>
        {notice}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="text-eyebrow text-faint">Total leads</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{total}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="text-eyebrow text-faint">Last 7 days</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{last7Days}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <label className="grid flex-1 basis-56 gap-1.5">
          <span className="text-sm font-medium">Search</span>
          <input
            type="search"
            placeholder="Name, email, or business"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="field min-h-10 rounded-lg px-3.5"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">From</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="field min-h-10 rounded-lg px-3"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">To</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="field min-h-10 rounded-lg px-3"
          />
        </label>
      </div>

      <ul className="mt-6 divide-y divide-line rounded-xl border border-line">
        {entries.length === 0 && !loading ? (
          <li className="px-5 py-10 text-center text-muted">
            {isFiltering ? "No leads match those filters." : "No leads yet. Share the site!"}
          </li>
        ) : null}
        {entries.map((entry) => {
          const isOpen = expanded === entry.id;
          return (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : entry.id)}
                aria-expanded={isOpen}
                className="flex min-h-14 w-full flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-left transition-colors hover:bg-surface"
              >
                <span className="font-medium">
                  {entry.firstName || "(no name)"}
                  {entry.businessName ? (
                    <span className="text-faint"> · {entry.businessName}</span>
                  ) : null}
                </span>
                <span className="text-sm text-muted">{entry.email}</span>
                <span className="ml-auto flex items-center gap-2">
                  {entry.paidCallBooked ? (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-contrast">
                      Paid call
                    </span>
                  ) : null}
                  {entry.stage === "partial" ? (
                    <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-muted">
                      Incomplete · after step {entry.lastStep}
                    </span>
                  ) : null}
                  <span className="text-xs text-faint">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </span>
              </button>
              {isOpen ? (
                <div className="anim-step-in border-t border-line bg-surface px-5 py-4">
                  <button
                    type="button"
                    onClick={() => handleDownloadEntry(entry)}
                    className="pressable min-h-10 rounded-lg border border-line px-4 text-sm font-medium hover:bg-surface-2"
                  >
                    Download answers (CSV)
                  </button>
                  <dl className="mt-4 grid gap-x-8 gap-y-2.5 text-sm sm:grid-cols-2">
                  <Detail label="Phone" value={entry.phone} />
                  <Detail label="Budget" value={entry.budget} />
                  <Detail label="Urgency" value={entry.urgency} />
                  <Detail label="Revenue (legacy)" value={entry.revenueRange} />
                  <Detail label="Biggest problem" value={entry.biggestProblem} wide />
                  <Detail label="Tried so far" value={entry.triedSoFar?.join(", ")} wide />
                  <Detail label="Source" value={entry.source} wide />
                  <Detail label="UTM source" value={entry.attribution?.utmSource} />
                  <Detail label="UTM medium" value={entry.attribution?.utmMedium} />
                  <Detail label="UTM campaign" value={entry.attribution?.utmCampaign} />
                  <Detail label="Referrer" value={entry.attribution?.referrer} />
                  <Detail label="Landing page" value={entry.attribution?.landingPage} wide />
                  <Detail label="PostHog session" value={entry.attribution?.posthogSessionId} />
                  <Detail label="PostHog distinct id" value={entry.attribution?.posthogDistinctId} />
                  <Detail label="Calendly event" value={entry.calendlyEventUri} wide />
                  <Detail label="Created" value={new Date(entry.createdAt).toLocaleString()} />
                  <Detail label="Updated" value={new Date(entry.updatedAt).toLocaleString()} />
                  </dl>
                </div>
              ) : null}
            </li>
          );
        })}
        {loading ? (
          <li className="grid gap-2 px-5 py-4">
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-5 w-1/2" />
          </li>
        ) : null}
      </ul>

      {!isFiltering && hasMore ? (
        <div className="mt-6 text-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => void loadPage(entries.length, true)}
            className="pressable min-h-11 rounded-lg border border-line px-6 font-medium hover:bg-surface-2 disabled:opacity-60"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      ) : null}
    </main>
  );
}

function Detail({
  label,
  value,
  wide,
}: {
  label: string;
  value?: string;
  wide?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-eyebrow text-faint">{label}</dt>
      <dd className="mt-0.5 wrap-break-word">{value}</dd>
    </div>
  );
}
