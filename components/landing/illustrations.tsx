// Every illustration on the page. All SERVER components, all inline SVG, no
// image files and no icon library.
//
// COLOUR POLICY: these are the ONE place the page is allowed colour beyond the
// marine palette, and even here it is not free invention — the four hues are
// --pillar-1..4, the categorical dimension palette taken from the Parents repo,
// where colour identifies WHICH dimension and never how good the value is. The
// teal --signal carries "you / the chosen path"; the pillar hues carry the four
// named dimensions; muted ink carries everything structural.
//
// Each SVG has role="img" + <title>, and the <title> is what a screen reader
// announces, so it states the POINT of the drawing rather than describing its
// geometry. Decorative internals are aria-hidden by virtue of being inside.

/* ---------------------------------------------------------------------------
   01 · The week chart

   Redrawn from the spec's flat polyline. What the original could not show is
   WHY the shape matters, so this version adds: a shaded "there is still time"
   band under the flat stretch, a real gridded baseline, the deadline as a
   vertical event rather than an unlabelled gap, and the spike rendered as an
   area so the eye reads volume-of-effort, not just a peak.
--------------------------------------------------------------------------- */
export function WeekChart() {
  return (
    <svg
      viewBox="0 0 700 260"
      role="img"
      aria-labelledby="week-chart-title"
      className="w-full h-auto"
    >
      <title id="week-chart-title">
        One week of effort on the thing that actually matters: almost no
        movement from Monday to Wednesday, then a single enormous spike late on
        Thursday night, just before the deadline.
      </title>

      <defs>
        {/* The spike's volume. Fades out downward so it reads as effort
            accumulating rather than as a solid filled shape. */}
        <linearGradient id="week-spike" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--pillar-4)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--pillar-4)" stopOpacity="0" />
        </linearGradient>
        {/* The flat stretch: the same dead calm, in the dimension colour for
            Decision Readiness, because that is precisely what is missing. */}
        <linearGradient id="week-flat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--pillar-3)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--pillar-3)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* gridlines */}
      <g stroke="var(--border)" strokeWidth="1">
        <line x1="40" y1="200" x2="670" y2="200" />
        <line x1="40" y1="140" x2="670" y2="140" strokeDasharray="3 7" opacity="0.5" />
        <line x1="40" y1="80" x2="670" y2="80" strokeDasharray="3 7" opacity="0.5" />
      </g>

      {/* the long flat stretch, shaded */}
      <path
        d="M40 194 L170 192 L300 195 L420 189 L490 187 L490 200 L40 200 Z"
        fill="url(#week-flat)"
      />
      {/* the spike's volume */}
      <path
        d="M490 187 L540 60 L580 38 L620 186 L620 200 L490 200 Z"
        fill="url(#week-spike)"
      />

      {/* the deadline, as an event */}
      <line
        x1="620"
        y1="30"
        x2="620"
        y2="200"
        stroke="var(--muted-foreground)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        opacity="0.75"
      />
      <text
        x="626"
        y="28"
        fontSize="12"
        fill="var(--muted-foreground)"
        fontFamily="var(--font-sans)"
      >
        due
      </text>

      {/* the line itself — this is the path that draws on scroll */}
      <path
        className="draw-path"
        data-anim="draw"
        style={{ "--draw-len": 1400 } as React.CSSProperties}
        d="M40 194 L170 192 L300 195 L420 189 L490 187 L540 60 L580 38 L620 186 L670 194"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* the 11pm peak */}
      <circle
        cx="580"
        cy="38"
        r="5.5"
        fill="var(--pillar-4)"
        stroke="var(--background)"
        strokeWidth="2.5"
      />
      <text
        x="580"
        y="24"
        textAnchor="middle"
        fontSize="13"
        fill="var(--ink)"
        fontFamily="var(--font-serif)"
      >
        11pm
      </text>

      {/* the sentence that lives in the flat stretch */}
      <text
        x="52"
        y="176"
        fontSize="12.5"
        fill="var(--muted-foreground)"
        fontFamily="var(--font-sans)"
        fontStyle="italic"
      >
        “There’s still time.”
      </text>

      {/* day axis */}
      <g
        fontSize="12"
        fill="var(--muted-foreground)"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
      >
        <text x="70" y="226">Mon</text>
        <text x="200" y="226">Tue</text>
        <text x="330" y="226">Wed</text>
        <text x="450" y="226">Thu</text>
        <text x="570" y="226">Thu night</text>
        <text x="662" y="226">Fri</text>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   03 · The loop

   The spec drew three arcs and three dots. The argument of this section is
   that ONE step in the cycle is the one that repeats — so this version weights
   the ring: the "credit" arc is drawn heavier and in the accent, the other
   three recede, and the centre states the misattribution that closes the loop.
--------------------------------------------------------------------------- */
export function LoopDiagram() {
  // Geometry derived rather than hand-placed, so the arcs, the arrowheads and
  // the labels can never drift out of agreement when the size changes.
  // The viewBox is deliberately wider than the ring: the side labels are set
  // OUTSIDE it, and at the previous 700-wide box the right-hand label ran off
  // the edge and was clipped. The ring is centred in the extra width.
  const CX = 400;
  const CY = 260;
  const R = 150;

  /** Point on the ring at `deg`, measured clockwise from 12 o'clock. */
  const at = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
  };

  // Labels are pre-wrapped: SVG <text> does not wrap, so a long single string
  // is what ran off the right edge before. Each line is its own <tspan>.
  const nodes = [
    { deg: 0, lines: ["The task matters"], sub: "nothing is wrong yet" },
    { deg: 90, lines: ["Something", "smaller wins"], sub: "it closes today" },
    { deg: 180, lines: ["Pressure arrives"], sub: "starting is not optional" },
    { deg: 270, lines: ["You deliver"], sub: "often your best work" },
  ].map((n) => ({ ...n, ...at(n.deg) }));

  /** Arc between two ring angles, trimmed at each end to clear the nodes. */
  const arc = (fromDeg: number, toDeg: number) => {
    const pad = 13; // degrees of clearance either side of a node
    const a = at(fromDeg + pad);
    const b = at(toDeg - pad);
    return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} A${R} ${R} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  };

  return (
    <svg
      viewBox="0 0 800 540"
      role="img"
      aria-labelledby="loop-title"
      className="w-full h-auto"
    >
      <title id="loop-title">
        A closed loop in four steps: the task matters, something smaller wins,
        pressure arrives, and you deliver — after which urgency takes the
        credit, which returns the cycle to the start.
      </title>

      <defs>
        <marker
          id="loop-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="var(--signal)" />
        </marker>
        <marker
          id="loop-arrow-hot"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="var(--pillar-4)" />
        </marker>
      </defs>

      {/* the ring's ghost */}
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="var(--border)"
        strokeWidth="1.5"
        strokeDasharray="4 9"
      />

      {/* three ordinary arcs */}
      {[
        [0, 90],
        [90, 180],
        [180, 270],
      ].map(([a, b]) => (
        <path
          key={a}
          d={arc(a, b)}
          fill="none"
          stroke="var(--signal)"
          strokeWidth="2.25"
          opacity="0.6"
          markerEnd="url(#loop-arrow)"
        />
      ))}
      {/* THE arc that repeats — heavier, warmer, unmissable. This is the
          "urgency takes the credit" return leg, and the whole point of the
          section is that it is the step that keeps the loop alive. */}
      <path
        d={arc(270, 360)}
        fill="none"
        stroke="var(--pillar-4)"
        strokeWidth="4"
        markerEnd="url(#loop-arrow-hot)"
      />

      {/* nodes */}
      {nodes.map((n, i) => {
        const isDeliver = i === 3;
        // Labels sit outside the ring, pushed along the radius so they never
        // collide with the arc regardless of which quadrant they're in.
        const outward = 26;
        const rad = ((n.deg - 90) * Math.PI) / 180;
        const lx = CX + (R + outward) * Math.cos(rad);
        const ly = CY + (R + outward) * Math.sin(rad);
        const anchor =
          n.deg === 90 ? "start" : n.deg === 270 ? "end" : "middle";
        // Top label sits above its node (and must clear its own sub-line);
        // bottom label sits below. Side labels centre on the node.
        const dy =
          n.deg === 0
            ? -26
            : n.deg === 180
              ? 24
              : -(n.lines.length - 1) * 9;

        return (
          <g key={n.lines.join(" ")}>
            <circle
              cx={n.x}
              cy={n.y}
              r="8"
              fill="var(--background)"
              stroke={isDeliver ? "var(--pillar-4)" : "var(--signal)"}
              strokeWidth="3"
            />
            <text
              x={lx}
              y={ly + dy}
              textAnchor={anchor}
              fontSize="16"
              fontWeight="600"
              fill="var(--ink)"
              fontFamily="var(--font-sans)"
            >
              {n.lines.map((line, j) => (
                <tspan key={line} x={lx} dy={j === 0 ? 0 : 19}>
                  {line}
                </tspan>
              ))}
            </text>
            <text
              x={lx}
              y={ly + dy + n.lines.length * 19}
              textAnchor={anchor}
              fontSize="13"
              fill="var(--muted-foreground)"
              fontFamily="var(--font-sans)"
            >
              {n.sub}
            </text>
          </g>
        );
      })}

      {/* the misattribution, at the centre */}
      <text
        x={CX}
        y={CY - 8}
        textAnchor="middle"
        fontSize="25"
        fill="var(--ink)"
        fontFamily="var(--font-serif)"
      >
        …and urgency
      </text>
      <text
        x={CX}
        y={CY + 24}
        textAnchor="middle"
        fontSize="25"
        fill="var(--pillar-4)"
        fontFamily="var(--font-serif)"
      >
        takes the credit
      </text>
      <text
        x={CX}
        y={CY + 52}
        textAnchor="middle"
        fontSize="13.5"
        fill="var(--muted-foreground)"
        fontFamily="var(--font-sans)"
      >
        not “I worked”
      </text>

      <text
        x={CX}
        y="524"
        textAnchor="middle"
        fontSize="14"
        fontStyle="italic"
        fill="var(--muted-foreground)"
        fontFamily="var(--font-sans)"
      >
        …so the next task waits for pressure again
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   06 · The gauge

   Redrawn with a real tick scale and the peer benchmark as a labelled marker
   rather than a bare line, so "44" is legible as a POSITION relative to where
   most people start, which is the only thing that makes the number mean
   anything. The arc animates; --gauge-len is the arc's path length.
--------------------------------------------------------------------------- */
export function ScoreGauge() {
  // Arc geometry, stated once and used for BOTH the path and the dash maths.
  // Hard-coding a guessed length is what made the first version overshoot: a
  // 260r semicircle is π·260 ≈ 816.8, but the round caps extend past the path
  // ends, so the visible sweep read high. Deriving it keeps them in agreement.
  const R = 230;
  const CX = 350;
  const CY = 258;
  const LEN = Math.PI * R;
  const SCORE = 44;
  const ARC = `M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}`;

  /** Point on the arc at `pct` along it (0 = left end, 100 = right end). */
  const pointAt = (pct: number) => {
    const angle = Math.PI * (1 - pct / 100); // π → 0
    return { x: CX + R * Math.cos(angle), y: CY - R * Math.sin(angle) };
  };
  const peer = pointAt(48);

  return (
    <div data-anim="gauge">
      <svg
        viewBox="0 0 700 300"
        role="img"
        aria-labelledby="gauge-title"
        className="w-full h-auto"
      >
        <title id="gauge-title">
          An illustrative Belief Score of 44 out of 100, shown on a semicircular
          gauge. Most people start near 48.
        </title>

        {/* track */}
        <path
          d={ARC}
          fill="none"
          stroke="var(--muted-surface)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* The score arc. Server-rendered at its FINAL offset so a no-JS
            visitor sees a filled gauge; .js-anim resets it to empty and the
            observer sweeps it. `butt` caps, not round: a round cap adds half
            the stroke width past each end, which is what made 44 look like 50+
            against the tick labels. */}
        <path
          className="gauge-arc"
          d={ARC}
          fill="none"
          stroke="var(--signal)"
          strokeWidth="16"
          strokeLinecap="butt"
          style={
            {
              "--gauge-len": LEN,
              strokeDasharray: LEN,
              strokeDashoffset: LEN - (LEN * SCORE) / 100,
            } as React.CSSProperties
          }
        />

        {/* Peer benchmark, placed ON the arc at 48 rather than at a guessed
            x. The tick sits just outside the stroke and the label above it. */}
        <g>
          <line
            x1={peer.x}
            y1={peer.y - 12}
            x2={peer.x}
            y2={peer.y - 26}
            stroke="var(--muted-foreground)"
            strokeWidth="2"
          />
          <text
            x={peer.x}
            y={peer.y - 34}
            textAnchor="middle"
            fontSize="13"
            fill="var(--muted-foreground)"
            fontFamily="var(--font-sans)"
          >
            most people start near 48
          </text>
        </g>

        {/* The number, sitting on the gauge's baseline well inside the arc. */}
        <text
          className="gauge-number"
          x={CX}
          y={CY - 26}
          textAnchor="middle"
          fontSize="96"
          fill="var(--signal)"
          fontFamily="var(--font-serif)"
        >
          {SCORE}
        </text>
        <text
          x={CX}
          y={CY + 4}
          textAnchor="middle"
          fontSize="15"
          fill="var(--muted-foreground)"
          fontFamily="var(--font-sans)"
        >
          out of 100 · illustrative
        </text>

        {/* scale ends, aligned to the arc's actual endpoints */}
        <text
          x={CX - R}
          y={CY + 26}
          textAnchor="middle"
          fontSize="13"
          fill="var(--muted-foreground)"
          fontFamily="var(--font-sans)"
        >
          0
        </text>
        <text
          x={CX + R}
          y={CY + 26}
          textAnchor="middle"
          fontSize="13"
          fill="var(--muted-foreground)"
          fontFamily="var(--font-sans)"
        >
          100
        </text>
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   08 · The layer stack

   The spec rendered this as five equal DOM rows. Drawn instead as a stack in
   perspective, it makes the actual argument visible: the four things you have
   already tried sit ON TOP of a fifth layer none of them reach.
--------------------------------------------------------------------------- */
export function LayerStack() {
  const upper = [
    "Apps, planners, reminders",
    "Medication",
    "Coaching and accountability",
    "Therapy",
  ];

  return (
    <svg
      viewBox="0 0 640 300"
      role="img"
      aria-labelledby="layers-title"
      className="w-full h-auto"
    >
      <title id="layers-title">
        A stack of five layers. The four upper layers — apps and planners,
        medication, coaching, and therapy — all sit above a fifth and deepest
        layer: what the repeated moment taught you to believe. That bottom layer
        is the one the score reads.
      </title>

      {upper.map((label, i) => {
        const y = 20 + i * 46;
        return (
          <g key={label}>
            <rect
              x={60 + i * 6}
              y={y}
              width={520 - i * 12}
              height="36"
              rx="8"
              fill="var(--surface)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text
              x={80 + i * 6}
              y={y + 23}
              fontSize="14"
              fill="var(--muted)"
              fontFamily="var(--font-sans)"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* the gap that nothing above reaches into */}
      <g stroke="var(--border)" strokeDasharray="3 6" strokeWidth="1">
        <line x1="80" y1="212" x2="560" y2="212" />
      </g>

      {/* the layer the score reads */}
      <rect
        x="48"
        y="230"
        width="544"
        height="52"
        rx="10"
        fill="var(--accent-soft)"
        stroke="var(--signal)"
        strokeWidth="1.5"
      />
      <text
        x="72"
        y="252"
        fontSize="15"
        fill="var(--ink)"
        fontFamily="var(--font-sans)"
        fontWeight="600"
      >
        What the repeated moment taught you to believe
      </text>
      <text
        x="72"
        y="271"
        fontSize="12.5"
        fill="var(--signal)"
        fontFamily="var(--font-sans)"
      >
        this is the layer the score reads
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Closing · the timeline

   One task, two points. The spec drew the deadline as the loud end; this keeps
   that but gives the early moment concentric emphasis and a lit run of track,
   so the drawing argues that the choice sits early rather than merely marking
   where it sits.
--------------------------------------------------------------------------- */
export function ClosingTimeline() {
  return (
    <svg
      viewBox="0 0 700 130"
      role="img"
      aria-labelledby="timeline-title"
      className="w-full h-auto"
    >
      <title id="timeline-title">
        The timeline of one task. The moment to watch sits early, far ahead of
        the deadline at the other end.
      </title>

      {/* full track */}
      <line
        x1="40"
        y1="72"
        x2="660"
        y2="72"
        stroke="var(--border)"
        strokeWidth="2"
      />
      {/* the stretch you actually have */}
      <line
        x1="40"
        y1="72"
        x2="150"
        y2="72"
        stroke="var(--signal)"
        strokeWidth="2"
      />

      {/* the moment to watch */}
      <circle cx="150" cy="72" r="15" fill="none" stroke="var(--signal)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="150" cy="72" r="8.5" fill="none" stroke="var(--signal)" strokeWidth="2" />
      <circle cx="150" cy="72" r="3.5" fill="var(--signal)" />
      <text
        x="150"
        y="42"
        textAnchor="middle"
        fontSize="15"
        fill="var(--ink)"
        fontFamily="var(--font-serif)"
      >
        the moment to watch
      </text>
      <text
        x="150"
        y="106"
        textAnchor="middle"
        fontSize="12.5"
        fill="var(--muted-foreground)"
        fontFamily="var(--font-sans)"
      >
        one real step, now
      </text>

      {/* the deadline */}
      <circle cx="620" cy="72" r="6" fill="var(--muted-foreground)" opacity="0.6" />
      <text
        x="620"
        y="106"
        textAnchor="middle"
        fontSize="12.5"
        fill="var(--muted-foreground)"
        fontFamily="var(--font-sans)"
      >
        the deadline
      </text>
    </svg>
  );
}
