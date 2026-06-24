import Image from "next/image";
import Link from "next/link";

// On-page section anchors — internal links that also give the footer a real
// navigation structure instead of just two legal links.
const EXPLORE = [
  { href: "/#why", label: "Why it works" },
  { href: "/#program", label: "The program" },
  { href: "/#founder", label: "Your guide" },
  { href: "/#faq", label: "FAQ" },
];

// Outbound links to the brand's own authoritative properties. These give the
// page real external links and reinforce the entity graph in structured-data.tsx.
const ELSEWHERE = [
  { href: "https://www.aimerge.live", label: "Free Belief Score" },
  { href: "https://tetranoodle.com", label: "TetraNoodle Technologies" },
  { href: "https://manujaggarwal.com", label: "About Manuj Aggarwal" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Image
            src="/icon/logo.png"
            alt="AIMERGE"
            width={1274}
            height={179}
            className="brand-logo h-4 w-auto"
          />
          <p className="mt-3 max-w-xs text-sm text-faint">
            ADHD coaching for founders and executives. Built for brains that
            move fast.
          </p>
        </div>

        <nav aria-label="Explore">
          <p className="text-eyebrow text-faint">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {EXPLORE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Elsewhere">
          <p className="text-eyebrow text-faint">More from AIMERGE</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {ELSEWHERE.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-5 py-6 sm:flex-row sm:items-center sm:px-8">
          <p className="text-sm text-faint">
            © {new Date().getFullYear()} AIMERGE. A methodology by TetraNoodle
            Technologies, Vancouver, Canada.
          </p>
          <nav aria-label="Legal" className="flex items-center gap-5 text-sm">
            <Link href="/privacy" className="text-muted transition-colors hover:text-fg">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted transition-colors hover:text-fg">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
