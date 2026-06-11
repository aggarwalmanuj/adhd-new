"use client";

// 12-way palette switcher. Motion intent: the popover scales in from its
// trigger to anchor the change spatially; swatch hover lift confirms
// interactivity before commit.

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { PALETTES, PALETTE_STORAGE_KEY } from "@/lib/palettes";

// The active palette lives on <html data-palette> (set pre-paint by the
// layout's init script); observe it instead of mirroring it into state.
function subscribeToPalette(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-palette"],
  });
  return () => observer.disconnect();
}

function getPaletteSnapshot() {
  return document.documentElement.getAttribute("data-palette") ?? "";
}

export function PaletteSwitcher() {
  const [open, setOpen] = useState(false);
  const active = useSyncExternalStore(
    subscribeToPalette,
    getPaletteSnapshot,
    () => ""
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();

  const apply = useCallback((id: string) => {
    document.documentElement.setAttribute("data-palette", id);
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, id);
    } catch {
      // private mode — palette just won't persist
    }
  }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={popoverId}
        aria-label="Change color palette"
        title="Change color palette"
        onClick={() => setOpen((o) => !o)}
        className="pressable flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface hover:bg-surface-2"
      >
        <span
          aria-hidden
          className="block h-4.5 w-4.5 rounded-full border border-line-strong"
          style={{
            background:
              "conic-gradient(var(--accent) 0 50%, var(--bg) 50% 100%)",
          }}
        />
      </button>

      {open ? (
        <div
          id={popoverId}
          role="menu"
          aria-label="Color palettes"
          className="anim-dialog-in absolute right-0 top-[calc(100%+0.5rem)] z-40 w-64 rounded-xl border border-line bg-surface p-3 shadow-lg"
        >
          <p className="text-eyebrow mb-2.5 px-1 text-faint">Palette</p>
          <div className="grid grid-cols-6 gap-2">
            {PALETTES.map((palette) => (
              <button
                key={palette.id}
                type="button"
                role="menuitemradio"
                aria-checked={active === palette.id}
                aria-label={palette.label}
                title={palette.label}
                onClick={() => apply(palette.id)}
                className={`pressable relative flex h-9 w-9 items-center justify-center rounded-full border transition-transform hover:-translate-y-0.5 ${
                  active === palette.id
                    ? "border-fg ring-2 ring-fg/30"
                    : "border-line-strong"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${palette.bg} 0 50%, ${palette.accent} 50% 100%)`,
                }}
              >
                {active === palette.id ? (
                  <span
                    aria-hidden
                    className="anim-pop-in block h-1.5 w-1.5 rounded-full bg-fg mix-blend-difference"
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
