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
   03 · The loop

   The spec drew three arcs and three dots. The argument of this section is
   that ONE step in the cycle is the one that repeats — so this version weights
   the ring: the "credit" arc is drawn heavier and in the accent, the other
   three recede, and the centre states the misattribution that closes the loop.
--------------------------------------------------------------------------- */
export function Flywheel() {
  // The viewBox is wider than the wheel because the east/west labels sit
  // OUTSIDE the ring; at a square box they were clipped against its edges.
  const C = 300; // ring centre x (the box is 600 wide)
  const CY = 230; // ring centre y
  const R = 150;

  /** Point on the ring at `deg`, clockwise from 12 o'clock. */
  const at = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: C + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
  };

  // Four stations. Side labels are pre-wrapped — SVG <text> does not wrap.
  const nodes = [
    { deg: 0, lines: ["The task matters"], anchor: "middle" as const, dy: -24 },
    { deg: 90, lines: ["Something", "smaller wins"], anchor: "start" as const, dy: -4 },
    { deg: 180, lines: ["Pressure arrives"], anchor: "middle" as const, dy: 30 },
    { deg: 270, lines: ["You deliver"], anchor: "end" as const, dy: 5 },
  ].map((n) => ({ ...n, ...at(n.deg) }));

  return (
    <svg
      viewBox="0 0 600 444"
      role="img"
      aria-labelledby="flywheel-title"
      className="h-auto w-full"
    >
      <title id="flywheel-title">
        A flywheel in four stations: the task matters, something smaller wins,
        pressure arrives, and you deliver — after which urgency takes the
        credit and the wheel turns again.
      </title>

      <defs>
        <radialGradient id="fly-core">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
        </radialGradient>
        {/* The lit head of the puck's trail. */}
        <linearGradient id="fly-trail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--signal)" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <circle cx={C} cy={CY} r="182" fill="url(#fly-core)" />
      <circle cx={C} cy={CY} r={R} fill="none" stroke="var(--border)" strokeWidth="1" />
      <circle
        cx={C}
        cy={CY}
        r={R}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="2.5"
        strokeDasharray="14 10"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* THE PUCK.
          The spec drove this with CSS `offset-path`, which is why it sat at
          the bottom of the card: `offset-path: path(...)` resolves against the
          ELEMENT's own coordinate space, not the SVG viewBox, so the arc's
          coordinates meant nothing to a <span> sitting outside the drawing.
          Support for it is also uneven.

          Rotating a group around the ring's centre has neither problem: same
          coordinate system as everything else here, one composited transform,
          and it cannot desynchronise from the ring. */}
      <g className="fly-rotor" style={{ transformOrigin: `${C}px ${CY}px` }}>
        {/* a short comet trail behind the head */}
        <path
          d={`M${C} ${CY - R} A${R} ${R} 0 0 0 ${at(-52).x.toFixed(1)} ${at(-52).y.toFixed(1)}`}
          fill="none"
          stroke="url(#fly-trail)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx={C} cy={CY - R} r="7" fill="var(--signal)" />
      </g>

      {/* stations */}
      {nodes.map((n) => (
        <g key={n.lines.join(" ")}>
          <circle cx={n.x} cy={n.y} r="6" fill="var(--signal)" />
          <text
            x={n.anchor === "start" ? n.x + 16 : n.anchor === "end" ? n.x - 16 : n.x}
            y={n.y + n.dy}
            textAnchor={n.anchor}
            fontSize="14"
            fill="var(--ink)"
            fontFamily="var(--font-sans)"
          >
            {n.lines.map((line, j) => (
              <tspan
                key={line}
                x={n.anchor === "start" ? n.x + 16 : n.anchor === "end" ? n.x - 16 : n.x}
                dy={j === 0 ? 0 : 18}
              >
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ))}

      <text
        x={C}
        y={CY - 6}
        textAnchor="middle"
        fontSize="26"
        fill="var(--ink)"
        fontFamily="var(--font-serif)"
      >
        You deliver
      </text>
      <text
        x={C}
        y={CY + 22}
        textAnchor="middle"
        fontSize="13"
        fill="var(--muted-foreground)"
        fontFamily="var(--font-sans)"
      >
        and urgency takes the credit
      </text>
      <text
        x={C}
        y="424"
        textAnchor="middle"
        fontSize="13"
        fontStyle="italic"
        fill="var(--muted-foreground)"
        fontFamily="var(--font-sans)"
      >
        the wheel is still turning
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   06a · The distribution curve

   Replaces the gauge. A gauge shows a value; this shows a POSITION — which is
   the only thing that makes a belief score mean anything ("44" is meaningless,
   "44, where most people start near 48" is not). The marker fades in on scroll
   and the number counts up beside it.
--------------------------------------------------------------------------- */
export function ScoreCurve() {
  return (
    <svg
      viewBox="0 0 620 250"
      role="img"
      aria-labelledby="curve-title"
      className="h-auto w-full"
    >
      <title id="curve-title">
        A distribution of scores. An illustrative score of 44 sits just below
        the middle of the range, where most people begin.
      </title>

      <defs>
        <linearGradient id="curve-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M20 210 C120 210 130 60 310 60 C490 60 500 210 600 210 Z"
        fill="url(#curve-fill)"
      />
      <path
        d="M20 210 C120 210 130 60 310 60 C490 60 500 210 600 210"
        fill="none"
        stroke="var(--border)"
        strokeWidth="2"
      />
      <line x1="20" y1="210" x2="600" y2="210" stroke="var(--border)" />

      {/* the peer benchmark */}
      <line
        x1="322"
        y1="90"
        x2="322"
        y2="210"
        stroke="var(--muted-foreground)"
        strokeDasharray="3 5"
      />
      <text
        x="332"
        y="106"
        fontSize="12.5"
        fill="var(--muted-foreground)"
        fontFamily="var(--font-sans)"
      >
        most people start near 48
      </text>

      {/* where you sit */}
      <g className="curve-marker">
        <line x1="272" y1="72" x2="272" y2="210" stroke="var(--signal)" strokeWidth="2" />
        <circle cx="272" cy="72" r="16" fill="none" stroke="var(--signal)" strokeOpacity="0.3" />
        <circle cx="272" cy="72" r="7" fill="var(--signal)" />
        <text
          x="272"
          y="46"
          textAnchor="middle"
          fontSize="17"
          fill="var(--ink)"
          fontFamily="var(--font-serif)"
        >
          you
        </text>
      </g>

      <g fontSize="12" fill="var(--muted-foreground)" fontFamily="var(--font-sans)">
        <text x="20" y="234">0 · the moment decides</text>
        <text x="600" y="234" textAnchor="end">100 · you decide</text>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   06b · The four dimensions, as a petal chart

   Four axes, one per scored dimension, each dot in that dimension's pillar
   hue. The polygon is server-rendered at its real shape and re-grown from the
   centre on scroll.
--------------------------------------------------------------------------- */
export function DimensionRadar() {
  const C = 170;
  const R = 120;
  // Order matters: it maps to the axes below (N, E, S, W).
  const DIMS = [
    { name: "Direction Clarity", short: "Direction", value: 58, pillar: 1 },
    { name: "Identity Alignment", short: "Identity", value: 29, pillar: 2 },
    { name: "Decision Readiness", short: "Decision", value: 46, pillar: 3 },
    { name: "Energy Alignment", short: "Energy", value: 43, pillar: 4 },
  ];

  // N, E, S, W at each dimension's scaled radius.
  const pts = [
    [C, C - (R * DIMS[0].value) / 100],
    [C + (R * DIMS[1].value) / 100, C],
    [C, C + (R * DIMS[2].value) / 100],
    [C - (R * DIMS[3].value) / 100, C],
  ];
  const polygon = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  return (
    <svg
      viewBox="0 0 340 340"
      role="img"
      aria-labelledby="radar-title"
      className="mx-auto h-auto w-full max-w-[340px]"
    >
      <title id="radar-title">
        The four scored dimensions: Direction Clarity 58, Identity Alignment
        29, Decision Readiness 46, and Energy Alignment 43, out of 100.
      </title>

      <g stroke="var(--border)" fill="none">
        <circle cx={C} cy={C} r={R} strokeDasharray="3 6" />
        <circle cx={C} cy={C} r={(R * 2) / 3} strokeDasharray="3 6" />
        <circle cx={C} cy={C} r={R / 3} strokeDasharray="3 6" />
        <line x1={C} y1={C - R} x2={C} y2={C + R} />
        <line x1={C - R} y1={C} x2={C + R} y2={C} />
      </g>

      <polygon
        className="radar-petal"
        points={polygon}
        fill="rgb(var(--glow) / 0.16)"
        stroke="var(--signal)"
        strokeWidth="2"
      />

      {/* one dot per axis, in that dimension's own hue */}
      {pts.map(([x, y], i) => (
        <circle key={DIMS[i].name} cx={x} cy={y} r="5.5" fill={`var(--pillar-${DIMS[i].pillar})`} />
      ))}

      <g fontSize="11.5" fill="var(--muted-foreground)" fontFamily="var(--font-sans)">
        <text x={C} y="26" textAnchor="middle">{DIMS[0].short}</text>
        <text x="336" y="174" textAnchor="end">{DIMS[1].short}</text>
        <text x={C} y="322" textAnchor="middle">{DIMS[2].short}</text>
        <text x="4" y="174">{DIMS[3].short}</text>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   08 · The strata cross-section

   Four things the visitor has already tried, drawn as sedimentary layers, and
   a probe that passes straight through all of them to reach a fifth. The probe
   is the whole argument: the upper layers are not wrong, they simply do not
   reach this depth.
--------------------------------------------------------------------------- */
export function Strata() {
  const LAYERS = [
    { title: "Apps, planners, reminders", note: "organise the task" },
    { title: "Medication", note: "may support symptoms" },
    { title: "Coaching and accountability", note: "support structure and follow-through" },
    { title: "Therapy", note: "supports emotional history and wellbeing" },
  ];

  return (
    <svg
      viewBox="0 0 900 392"
      role="img"
      aria-labelledby="strata-title"
      className="h-auto w-full"
    >
      <title id="strata-title">
        A cross-section: apps and planners, medication, coaching, and therapy
        sit as layers above the deepest layer — the belief attached to one
        repeated moment — which is the layer the Belief Score reads.
      </title>

      {LAYERS.map((l, i) => {
        const y = 14 + i * 68;
        return (
          <g key={l.title}>
            <rect
              x="20"
              y={y}
              width="860"
              height="58"
              rx="10"
              fill="var(--surface)"
              fillOpacity="0.55"
              stroke="var(--border)"
            />
            <text x="44" y={y + 28} fontSize="15.5" fill="var(--ink)" fontFamily="var(--font-sans)">
              {l.title}
            </text>
            <text
              x="44"
              y={y + 46}
              fontSize="12.5"
              fill="var(--muted-foreground)"
              fontFamily="var(--font-sans)"
            >
              {l.note}
            </text>
          </g>
        );
      })}

      {/* the layer none of the above reaches */}
      <rect
        x="20"
        y="290"
        width="860"
        height="72"
        rx="12"
        fill="rgb(var(--glow) / 0.11)"
        stroke="var(--signal)"
        strokeWidth="1.6"
      />
      <text x="44" y="322" fontSize="20" fill="var(--ink)" fontFamily="var(--font-serif)">
        What the repeated moment taught you to believe
      </text>
      <text x="44" y="344" fontSize="12.5" fill="var(--signal)" fontFamily="var(--font-sans)">
        the layer the Belief Score reads
      </text>

      {/* the probe: passes through every upper layer to land in the last */}
      <line
        x1="820"
        y1="14"
        x2="820"
        y2="326"
        stroke="var(--signal)"
        strokeWidth="2"
        strokeDasharray="5 6"
      />
      <circle cx="820" cy="326" r="16" fill="none" stroke="var(--signal)" strokeOpacity="0.3" />
      <circle cx="820" cy="326" r="7" fill="var(--signal)" />
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
