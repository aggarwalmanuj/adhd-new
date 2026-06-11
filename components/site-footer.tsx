import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <div>
          <Image
            src="/icon/logo.png"
            alt="AIMERGE"
            width={1274}
            height={179}
            className="brand-logo h-4 w-auto"
          />
          <p className="mt-2.5 text-sm text-faint">
            © {new Date().getFullYear()} AIMERGE. Built for brains that move fast.
          </p>
        </div>
        <nav aria-label="Legal" className="flex items-center gap-5 text-sm">
          <Link href="/privacy" className="text-muted transition-colors hover:text-fg">
            Privacy
          </Link>
          <Link href="/terms" className="text-muted transition-colors hover:text-fg">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
