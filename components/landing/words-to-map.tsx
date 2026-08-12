// Section 05 · "From your words to your map".
//
// The claim this section has to make is a TRANSFORMATION: a messy sentence
// goes in, a structured reading comes out. The previous layout put a quote in
// one column and an unrelated numbered list in the other, which showed the two
// ENDS but not the mechanism between them — the reader had to take on faith
// that the list came from the sentence.
//
// So the sentence is now marked up phrase by phrase, each phrase tinted with
// the colour of the stage it feeds, and every stage carries the fragment it
// was derived from. The colour IS the join: "even when I know exactly what to
// do" is teal in the quote and teal on the Direction Clarity stage, so the
// derivation is visible rather than asserted.
//
// Colour comes from the four pillar hues (see globals.css) — categorical, not
// ranked. This is an illustration, which is the one place the brief allows
// colour beyond the marine palette.
//
// A SERVER component: nothing here is interactive.

type Stage = {
  n: string;
  /** Which pillar hue carries this stage, 1–4. */
  pillar: 1 | 2 | 3 | 4;
  kicker: string;
  body: string;
  /** The exact words from the typed sentence this stage was read from. */
  from: string;
};

const STAGES: Stage[] = [
  {
    n: "01",
    pillar: 1,
    kicker: "The repeated moment",
    body: "Important work stays untouched until the pressure becomes intense.",
    from: "“I keep putting off important work”",
  },
  {
    n: "02",
    pillar: 2,
    kicker: "A possible belief underneath",
    body: "“I cannot rely on myself without an emergency.”",
    from: "“even when I know exactly what to do”",
  },
  {
    n: "03",
    pillar: 3,
    kicker: "The moment to watch",
    body: "The first time attention leaves the task while there still appears to be plenty of time.",
    from: "“once the deadline is close”",
  },
  {
    n: "04",
    pillar: 4,
    kicker: "The next evidence",
    body: "One meaningful step completed before urgency takes over. Small enough to actually happen.",
    from: "“I suddenly become productive”",
  },
];

/** A phrase inside the quote, underlined in its stage's colour. */
function Phrase({ pillar, children }: { pillar: 1 | 2 | 3 | 4; children: React.ReactNode }) {
  return (
    <span
      className="relative whitespace-normal"
      style={{
        // A tinted rule under the phrase rather than a highlight behind it:
        // a filled background at this type size fights the serif's shapes.
        boxShadow: `inset 0 -0.32em 0 0 color-mix(in srgb, var(--pillar-${pillar}) 22%, transparent)`,
      }}
    >
      {children}
    </span>
  );
}

export function WordsToMap() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
      {/* What was typed. Sticky on desktop so the sentence stays in view while
          the reader walks the stages it produced — the join only lands if both
          halves are on screen together. */}
      <div className="min-w-0 lg:col-span-5">
        <figure className="rounded-xl border border-line bg-surface p-6 shadow-[var(--elev-2)] sm:p-7 lg:sticky lg:top-24">
          <figcaption className="eyebrow mb-5">What someone typed</figcaption>

          <blockquote className="text-title leading-[1.5]">
            <Phrase pillar={1}>“I keep putting off important work</Phrase>{" "}
            <Phrase pillar={2}>even when I know exactly what to do.</Phrase>{" "}
            <Phrase pillar={3}>Once the deadline is close,</Phrase>{" "}
            <Phrase pillar={4}>I suddenly become productive.”</Phrase>
          </blockquote>

          <p className="mt-5 text-sm italic text-faint">
            Question 1 of 5 · answered in about 40 seconds
          </p>

          {/* The legend that makes the colour mean something. */}
          <p className="mt-5 border-t border-line pt-5 text-sm text-faint">
            Each underlined phrase is read into the matching stage on the right.
          </p>

          <p className="mt-4 font-mono text-xs text-faint">
            5 questions · ~10 min · answers stay private
          </p>
        </figure>
      </div>

      {/* What comes back. */}
      <ol className="min-w-0 list-none lg:col-span-7">
        {STAGES.map((s) => (
          <li
            key={s.n}
            data-anim=""
            className="reveal row-interactive grid grid-cols-[3rem_1fr] gap-x-4 border-t border-line py-6 last:border-b"
          >
            <span
              className="row-num font-serif text-2xl"
              style={{ color: `var(--pillar-${s.pillar}-ink)` }}
              aria-hidden
            >
              {s.n}
            </span>

            <div className="min-w-0">
              <div className="flex items-baseline gap-3">
                <span className="row-mark" aria-hidden />
                <h3
                  className="text-[12px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: `var(--pillar-${s.pillar}-ink)` }}
                >
                  {s.kicker}
                </h3>
              </div>

              <p className="text-body-lg mt-2 text-fg">{s.body}</p>

              {/* The receipt: the words this reading came from. */}
              <p
                className="mt-3 border-l-2 pl-3 text-sm text-faint"
                style={{
                  borderColor: `color-mix(in srgb, var(--pillar-${s.pillar}) 55%, transparent)`,
                }}
              >
                read from {s.from}
              </p>
            </div>
          </li>
        ))}

        {/* The loop that closes it — the one stage that is not a reading of a
            phrase but the shape all four together describe. */}
        <li data-anim="" className="reveal mt-8">
          <p className="eyebrow mb-3">How it keeps proving itself</p>
          <ol className="flex list-none flex-wrap items-center gap-x-2 gap-y-2 font-mono text-sm text-muted">
            {["waiting", "pressure", "intense action", "completion", "pressure gets the credit"].map(
              (step, i, arr) => (
                <li key={step} className="flex items-center gap-2">
                  <span
                    className={
                      i === arr.length - 1
                        ? "rounded border border-signal/50 bg-accent-soft px-2 py-0.5 text-ink"
                        : ""
                    }
                  >
                    {step}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-signal" aria-hidden>
                      →
                    </span>
                  )}
                </li>
              )
            )}
          </ol>
          <p className="mt-3 text-sm text-faint">
            The last step is the one that keeps the first step true.
          </p>
        </li>
      </ol>
    </div>
  );
}
