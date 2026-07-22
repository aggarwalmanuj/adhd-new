// The score, rendered the way the live product renders it: a 0-100 dial, a band
// label, and the four scored dimensions. A product named "Score" has to look
// like a score wherever it is demonstrated (Block 07).
//
// Presentational only — values are passed in, never computed here.

export type ScoreDimension = {
  label: string;
  value: number;
};

export function ScoreVisual({
  score,
  band,
  dimensions,
}: {
  score: number;
  band: string;
  dimensions: ScoreDimension[];
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6">
        <div
          className="score-dial shrink-0"
          style={{ "--score": score } as React.CSSProperties}
          role="img"
          aria-label={`Overall score ${score} out of 100`}
        >
          <span className="score-dial-inner">{score}</span>
        </div>
        <div className="min-w-0">
          <p className="text-eyebrow text-signal">{band}</p>
          <p className="mt-2 text-sm text-faint">Overall score, 0&ndash;100</p>
        </div>
      </div>

      <dl className="mt-7 grid gap-4 sm:grid-cols-2">
        {dimensions.map((dim) => (
          <div key={dim.label}>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm font-medium text-fg">{dim.label}</dt>
              <dd className="text-sm tabular-nums text-faint">{dim.value}</dd>
            </div>
            <div className="score-bar mt-2" aria-hidden>
              <span style={{ width: `${dim.value}%` }} />
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
