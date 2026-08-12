// Scroll-reveal wrapper — a SERVER component.
//
// The old client version mounted a `useEffect` + its own IntersectionObserver
// per instance. On a page with ~40 reveals that is 40 client components and 40
// observers, all to add one class. This emits plain markup with `data-anim`,
// and the single observer in <ScrollEffects> picks every one of them up.
//
// Renders visible by default; see the .js-anim gate in globals.css.

type RevealProps = {
  children: React.ReactNode;
  /** Stagger offset in ms, for sibling reveals (60–90ms steps read best). */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "figure" | "p";
  /**
   * Render visible immediately, with no fade-in and no observer.
   *
   * REQUIRED for anything above the fold. A gated reveal starts at opacity 0
   * and only becomes visible once hydration has run and the observer has
   * fired — which makes it ineligible as a Largest Contentful Paint until
   * then. Measured on the hero <h1>: 1,211 ms of pure "element render delay",
   * i.e. an LCP that was waiting on JavaScript to reveal text the server had
   * already sent. Above-the-fold content must paint from the HTML alone.
   */
  immediate?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  immediate = false,
}: RevealProps) {
  if (immediate) {
    return <Tag className={className || undefined}>{children}</Tag>;
  }

  return (
    <Tag
      data-anim=""
      className={`reveal ${className}`}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
