import Image from "next/image";
import Link from "next/link";

// Block 14: footer and legal.
const LEGAL = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/ai-data-disclosure", label: "AI and Data Disclosure" },
  { href: "/medical-disclaimer", label: "Medical Disclaimer" },
  { href: "/accessibility", label: "Accessibility" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-5 py-14 text-center sm:px-8">
        <Image
          src="/icon/logo.png"
          alt="AI Merge"
          width={1274}
          height={179}
          className="brand-logo h-4 w-auto"
        />
        <p className="text-title">
          See the pattern. Decide what fits.{" "}
          <span className="text-emphasis">Build new evidence.</span>
        </p>

        <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {LEGAL.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center py-1 text-muted transition-colors hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="mailto:feedback@tetranoodle.com"
            className="inline-flex min-h-11 items-center py-1 text-muted transition-colors hover:text-fg"
          >
            Contact
          </a>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-5 py-6 text-center sm:px-8">
          <p className="text-sm text-faint">
            © {new Date().getFullYear()} TetraNoodle Technologies. All rights
            reserved.
          </p>
          <p className="max-w-2xl text-xs leading-relaxed text-faint">
            AI Merge is proprietary intellectual property created by Manuj
            Aggarwal and published in the{" "}
            <em>Mensa Research Journal</em>.
          </p>
        </div>
      </div>
    </footer>
  );
}
