"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { closeApplyModal, useApplyModalOpen } from "@/lib/apply-modal-store";
import { getLeadAttribution, phCapture, phIdentify } from "@/lib/attribution";
import { trackCustom, trackWhenReady } from "@/lib/fbpixel";
import { BUDGET_OPTIONS, TRIED_OPTIONS, URGENCY_OPTIONS } from "@/lib/waitlist-shared";

const TOTAL_STEPS = 5;
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

type FormState = {
  firstName: string;
  businessName: string;
  email: string;
  phone: string;
  budget: string;
  biggestProblem: string;
  urgency: string;
  triedSoFar: string[];
};

const EMPTY_FORM: FormState = {
  firstName: "",
  businessName: "",
  email: "",
  phone: "",
  budget: "",
  biggestProblem: "",
  urgency: "",
  triedSoFar: [],
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function buildPayload(form: FormState, stage: "partial" | "complete", step: number) {
  return {
    stage,
    step,
    firstName: form.firstName.trim(),
    businessName: form.businessName.trim() || undefined,
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim() || undefined,
    budget: form.budget || undefined,
    biggestProblem: form.biggestProblem.trim() || undefined,
    urgency: form.urgency || undefined,
    triedSoFar: form.triedSoFar.length ? form.triedSoFar : undefined,
    attribution: getLeadAttribution(),
  };
}

export function ApplyModal() {
  const open = useApplyModalOpen();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booked, setBooked] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  // Saves are chained, never parallel: two in-flight first saves for the same
  // email race the server-side existence check and create duplicate rows.
  const saveChain = useRef<Promise<void>>(Promise.resolve());
  const headingId = useId();
  const errorId = useId();

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  }, []);

  // Open/close side effects: scroll lock + focus management
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    trackCustom("WaitlistOpened");
    phCapture("waitlist_opened");
    return () => {
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus?.();
    };
  }, [open]);

  // Move focus to the step heading on each step change
  useEffect(() => {
    if (open) headingRef.current?.focus();
  }, [open, step, done]);

  // ESC to close + focus trap
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeApplyModal();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, iframe, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Calendly postMessage listener (success screen)
  useEffect(() => {
    if (!bookingOpen) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      const data = e.data as { event?: string; payload?: { event?: { uri?: string }; invitee?: { uri?: string } } };
      if (data?.event !== "calendly.event_scheduled") return;
      setBooked(true);
      trackWhenReady("Schedule", { content_name: "clarity_call" });
      trackCustom("PaidCallBooked");
      phCapture("clarity_call_booked");
      const eventUri = data.payload?.event?.uri ?? "";
      const inviteeUri = data.payload?.invitee?.uri ?? "";
      if (eventUri && inviteeUri) {
        fetch("/api/waitlist/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email.trim().toLowerCase(),
            name: form.firstName.trim() || undefined,
            eventUri,
            inviteeUri,
          }),
          keepalive: true,
        }).catch(() => undefined);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [bookingOpen, form.email, form.firstName]);

  const queueSave = useCallback(
    (stage: "partial" | "complete", stepCompleted: number) => {
      const payload = buildPayload(form, stage, stepCompleted);
      saveChain.current = saveChain.current
        .then(() =>
          fetch("/api/waitlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
          }).then(() => undefined)
        )
        .catch(() => undefined);
      return saveChain.current;
    },
    [form]
  );

  const validateStep = useCallback((): string => {
    if (step === 1) {
      if (!form.firstName.trim()) return "Please tell us your first name.";
      if (!form.businessName.trim()) return "Please tell us your business name.";
      if (!isValidEmail(form.email)) return "Please enter a valid email address.";
      if (!form.phone.trim()) return "Please add a phone number so we can reach you.";
    }
    if (step === 2 && !form.budget) return "Please pick the option that fits best.";
    if (step === 3 && !form.biggestProblem.trim())
      return "A sentence or two is all we need.";
    if (step === 4 && !form.urgency) return "Please pick the one that's true right now.";
    if (step === 5 && form.triedSoFar.length === 0)
      return "Please select at least one — even if it's just white-knuckling it.";
    return "";
  }, [step, form]);

  const handleContinue = useCallback(() => {
    const problem = validateStep();
    if (problem) {
      setError(problem);
      return;
    }
    trackCustom("WaitlistStepCompleted", { step });
    phCapture("waitlist_step_completed", { step });
    // Partial save on every Continue: a half-finished form is still a lead.
    queueSave("partial", step);
    setDirection("forward");
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }, [validateStep, step, queueSave]);

  const handleBack = useCallback(() => {
    setError("");
    setDirection("back");
    setStep((s) => Math.max(1, s - 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      // Let in-flight partial saves land first so the final submit updates
      // the partial doc instead of racing it.
      await saveChain.current;
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form, "complete", TOTAL_STEPS)),
      });
      const body = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok || !body?.ok) {
        setError(body?.error ?? "Something went wrong. Please try again.");
        return;
      }
      trackWhenReady("Lead", { content_name: "waitlist" });
      trackCustom("WaitlistJoined");
      phCapture("waitlist_submitted");
      phIdentify(form.email.trim().toLowerCase(), {
        name: form.firstName.trim(),
        company: form.businessName.trim() || undefined,
      });
      setDone(true);
    } catch {
      setError("Network hiccup. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [form, submitting]);

  const handleOpenBooking = useCallback(() => {
    setBookingOpen(true);
    trackWhenReady("InitiateCheckout", { content_name: "clarity_call" });
    phCapture("clarity_call_booking_opened");
  }, []);

  if (!open) return null;

  const calendlySrc = CALENDLY_URL
    ? `${CALENDLY_URL}${CALENDLY_URL.includes("?") ? "&" : "?"}hide_gdpr_banner=1&name=${encodeURIComponent(form.firstName.trim())}&email=${encodeURIComponent(form.email.trim())}`
    : "";

  const stepAnimation = direction === "forward" ? "anim-step-in" : "anim-step-in-back";

  return (
    <div
      className="anim-overlay-in fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeApplyModal();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="anim-dialog-in flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-line bg-bg text-fg shadow-2xl sm:rounded-2xl"
      >
        <header className="flex items-center justify-between gap-4 px-6 pt-5">
          {!done ? (
            <div className="flex-1">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-eyebrow text-faint">
                  Step {step} of {TOTAL_STEPS}
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={TOTAL_STEPS}
                aria-valuenow={step}
                aria-label="Application progress"
                className="h-1 w-full overflow-hidden rounded-full bg-surface-2"
              >
                <div
                  className="progress-fill h-full rounded-full bg-accent"
                  style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <span aria-hidden className="flex-1" />
          )}
          <button
            type="button"
            onClick={closeApplyModal}
            className="pressable -mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-faint hover:bg-surface-2 hover:text-fg"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="overflow-y-auto px-6 pb-6 pt-4">
          {/* Errors announced to screen readers as they appear */}
          <p
            id={errorId}
            aria-live="polite"
            className={`text-sm font-medium text-fg ${error ? "anim-nudge mb-3 rounded-lg bg-accent-soft px-3 py-2" : "sr-only"}`}
          >
            {error}
          </p>

          {done ? (
            <div key="success" className="anim-step-in">
              <div className="anim-pop-in mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-contrast">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 ref={headingRef} tabIndex={-1} id={headingId} className="text-title outline-none">
                You&apos;re on the list, {form.firstName.trim() || "friend"}.
              </h2>
              <p className="mt-2 text-muted">
                We review every application by hand. Watch your inbox; we&apos;ll
                reach out as spots open.
              </p>

              {CALENDLY_URL ? (
                <div className="mt-6 rounded-xl border border-line bg-surface p-4">
                  <h3 className="font-semibold">Want to skip the line?</h3>
                  <p className="mt-1 text-sm text-muted">
                    Book a paid 1:1 clarity call and get a working plan for your
                    biggest bottleneck this week.
                  </p>
                  {booked ? (
                    <p className="anim-pop-in mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-contrast">
                      Call booked. See you there.
                    </p>
                  ) : bookingOpen ? (
                    <iframe
                      src={calendlySrc}
                      title="Book a clarity call"
                      className="mt-3 h-140 w-full rounded-lg border border-line bg-white"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenBooking}
                      className="pressable mt-3 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-5 font-semibold text-accent-contrast hover:opacity-90"
                    >
                      Book a clarity call
                    </button>
                  )}
                </div>
              ) : null}

              <button
                type="button"
                onClick={closeApplyModal}
                className="pressable mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-line bg-surface font-medium hover:bg-surface-2"
              >
                Back to the site
              </button>
            </div>
          ) : (
            <form
              key={step}
              className={stepAnimation}
              onSubmit={(e) => {
                e.preventDefault();
                if (step < TOTAL_STEPS) handleContinue();
                else void handleSubmit();
              }}
              noValidate
            >
              {step === 1 && (
                <fieldset>
                  <legend className="sr-only">Contact details</legend>
                  <h2 ref={headingRef} tabIndex={-1} id={headingId} className="text-title outline-none">
                    First, the basics
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    So we know who we&apos;re talking to.
                  </p>
                  <div className="mt-5 grid gap-4">
                    <label className="grid gap-1.5">
                      <span className="text-sm font-medium">First name</span>
                      <input
                        className="field min-h-11 rounded-lg px-3.5 text-fg placeholder:text-faint"
                        type="text"
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={(e) => set("firstName", e.target.value)}
                        required
                        aria-describedby={error ? errorId : undefined}
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-sm font-medium">Business name</span>
                      <input
                        className="field min-h-11 rounded-lg px-3.5 text-fg placeholder:text-faint"
                        type="text"
                        autoComplete="organization"
                        value={form.businessName}
                        onChange={(e) => set("businessName", e.target.value)}
                        required
                        aria-describedby={error ? errorId : undefined}
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-sm font-medium">Email</span>
                      <input
                        className="field min-h-11 rounded-lg px-3.5 text-fg placeholder:text-faint"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        required
                        aria-describedby={error ? errorId : undefined}
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-sm font-medium">Phone</span>
                      <input
                        className="field min-h-11 rounded-lg px-3.5 text-fg placeholder:text-faint"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        required
                        aria-describedby={error ? errorId : undefined}
                      />
                    </label>
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <fieldset>
                  <legend>
                    <h2 ref={headingRef} tabIndex={-1} id={headingId} className="text-title outline-none">
                      How much are you ready to invest in solving this?
                    </h2>
                  </legend>
                  <p className="mt-1 text-sm text-muted">
                    The work is a four-week protocol. This helps us place you in the right track.
                  </p>
                  <div className="mt-5 grid gap-2.5" role="radiogroup" aria-label="Investment budget">
                    {BUDGET_OPTIONS.map((option) => (
                      <label
                        key={option}
                        className={`field pressable flex min-h-12 cursor-pointer items-center gap-3 rounded-lg px-4 ${form.budget === option ? "border-accent bg-accent-soft" : ""}`}
                      >
                        <input
                          type="radio"
                          name="budget"
                          value={option}
                          checked={form.budget === option}
                          onChange={() => set("budget", option)}
                          className="h-4 w-4 accent-accent"
                        />
                        <span className="font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 3 && (
                <fieldset>
                  <legend>
                    <h2 ref={headingRef} tabIndex={-1} id={headingId} className="text-title outline-none">
                      What&apos;s the one biggest problem?
                    </h2>
                  </legend>
                  <p className="mt-1 text-sm text-muted">
                    The thing that, if it were solved, everything else would get easier.
                  </p>
                  <label className="mt-5 grid gap-1.5">
                    <span className="sr-only">Your biggest problem</span>
                    <textarea
                      className="field min-h-36 resize-y rounded-lg px-3.5 py-3 text-fg placeholder:text-faint"
                      value={form.biggestProblem}
                      onChange={(e) => set("biggestProblem", e.target.value)}
                      placeholder="I start everything and finish nothing…"
                      maxLength={5000}
                      aria-describedby={error ? errorId : undefined}
                    />
                  </label>
                </fieldset>
              )}

              {step === 4 && (
                <fieldset>
                  <legend>
                    <h2 ref={headingRef} tabIndex={-1} id={headingId} className="text-title outline-none">
                      How soon do you need this to change?
                    </h2>
                  </legend>
                  <p className="mt-1 text-sm text-muted">
                    Be honest — it helps us prioritise who we reach out to first.
                  </p>
                  <div className="mt-5 grid gap-2.5" role="radiogroup" aria-label="Urgency">
                    {URGENCY_OPTIONS.map((option) => (
                      <label
                        key={option}
                        className={`field pressable flex min-h-12 cursor-pointer items-center gap-3 rounded-lg px-4 ${form.urgency === option ? "border-accent bg-accent-soft" : ""}`}
                      >
                        <input
                          type="radio"
                          name="urgency"
                          value={option}
                          checked={form.urgency === option}
                          onChange={() => set("urgency", option)}
                          className="h-4 w-4 accent-accent"
                        />
                        <span className="font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 5 && (
                <fieldset>
                  <legend>
                    <h2 ref={headingRef} tabIndex={-1} id={headingId} className="text-title outline-none">
                      What have you already tried?
                    </h2>
                  </legend>
                  <p className="mt-1 text-sm text-muted">Select all that apply.</p>
                  <div className="mt-5 grid gap-2.5">
                    {TRIED_OPTIONS.map((option) => {
                      const checked = form.triedSoFar.includes(option);
                      return (
                        <label
                          key={option}
                          className={`field pressable flex min-h-12 cursor-pointer items-center gap-3 rounded-lg px-4 ${checked ? "border-accent bg-accent-soft" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              set(
                                "triedSoFar",
                                checked
                                  ? form.triedSoFar.filter((t) => t !== option)
                                  : [...form.triedSoFar, option]
                              )
                            }
                            className="h-4 w-4 accent-accent"
                          />
                          <span className="font-medium">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              <div className="mt-6 flex items-center gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="pressable inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-surface px-5 font-medium hover:bg-surface-2"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="pressable inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-accent px-5 font-semibold text-accent-contrast hover:opacity-90 disabled:opacity-60"
                >
                  {step < TOTAL_STEPS ? "Continue" : submitting ? "Submitting…" : "Join the waitlist"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
