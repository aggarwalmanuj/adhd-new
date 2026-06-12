// Shared between client and server: zod schemas + lead types.
import { z } from "zod";

/** Legacy: the revenue question was replaced by the budget question.
 * Kept so stale client bundles and old documents stay valid. */
export const REVENUE_RANGES = [
  "Pre-revenue",
  "$1k – $10k / month",
  "$10k – $50k / month",
  "$50k+ / month",
] as const;

export const BUDGET_OPTIONS = [
  "Under $2,500",
  "$2,500 – $10,000",
  "$10,000+",
  "I need to understand it first",
] as const;

export const URGENCY_OPTIONS = [
  "It's urgent — this is costing me right now",
  "Within this quarter",
  "Soon, but I'm still exploring",
  "Just curious for now",
] as const;

export const TRIED_OPTIONS = [
  "Courses & programs",
  "Business coaches",
  "Productivity apps",
  "Accountability partners",
  "Medication / treatment",
  "White-knuckling it alone",
] as const;

const clipped = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((s) => s.slice(0, max));

export const attributionSchema = z
  .object({
    landingPage: clipped(500).optional(),
    referrer: clipped(500).optional(),
    utmSource: clipped(200).optional(),
    utmMedium: clipped(200).optional(),
    utmCampaign: clipped(200).optional(),
    utmTerm: clipped(200).optional(),
    utmContent: clipped(200).optional(),
    fbclid: clipped(500).optional(),
    gclid: clipped(500).optional(),
    posthogSessionId: clipped(200).optional(),
    posthogDistinctId: clipped(200).optional(),
  })
  .strip();

export type Attribution = z.infer<typeof attributionSchema>;

export const waitlistSubmissionSchema = z.object({
  stage: z.enum(["partial", "complete"]),
  step: z.number().int().min(1).max(5),
  firstName: z.string().trim().min(1).max(200),
  businessName: clipped(200).optional(),
  email: z.string().trim().toLowerCase().email().max(320),
  phone: clipped(50).optional(),
  revenueRange: z.enum(REVENUE_RANGES).optional(),
  budget: z.enum(BUDGET_OPTIONS).optional(),
  urgency: z.enum(URGENCY_OPTIONS).optional(),
  biggestProblem: clipped(5000).optional(),
  triedSoFar: z.array(z.enum(TRIED_OPTIONS)).max(TRIED_OPTIONS.length).optional(),
  source: clipped(500).optional(),
  attribution: attributionSchema.optional(),
});

export type WaitlistSubmission = z.infer<typeof waitlistSubmissionSchema>;

export const bookingSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  name: clipped(200).optional(),
  eventUri: z
    .string()
    .max(500)
    .refine((u) => u.startsWith("https://api.calendly.com/"), {
      message: "eventUri must be a Calendly API URI",
    }),
  inviteeUri: z
    .string()
    .max(500)
    .refine((u) => u.startsWith("https://api.calendly.com/"), {
      message: "inviteeUri must be a Calendly API URI",
    }),
});

export type BookingPayload = z.infer<typeof bookingSchema>;

/** Shape of the Cosmos document, also rendered by the admin panel. */
export type WaitlistEntry = {
  id: string;
  email: string;
  firstName?: string;
  businessName?: string;
  phone?: string;
  /** Legacy field from the old revenue question; new leads carry `budget`. */
  revenueRange?: string;
  budget?: string;
  urgency?: string;
  biggestProblem?: string;
  triedSoFar?: string[];
  stage: "partial" | "complete";
  lastStep: number;
  source?: string;
  attribution?: Attribution;
  paidCallBooked?: boolean;
  calendlyEventUri?: string;
  calendlyInviteeUri?: string;
  createdAt: string;
  updatedAt: string;
};
