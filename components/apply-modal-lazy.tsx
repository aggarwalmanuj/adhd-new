"use client";

// Lazily loads the ApplyModal.
//
// WHY: <ApplyModal> is a 5-step form (~600 lines plus its validation schema)
// mounted in the ROOT LAYOUT, so it shipped on every route — including the
// landing page, where nothing can even open it (the only trigger is
// <WaitlistCta>, which the landing page does not render). It was pure
// critical-path weight on a page bought with paid mobile traffic.
//
// The store is a tiny module-level subscription with no dependency on the
// modal itself, so the open flag can be observed without the modal's code
// being present. The chunk is fetched the moment the flag first flips true.

import dynamic from "next/dynamic";
import { useApplyModalOpen } from "@/lib/apply-modal-store";

const ApplyModal = dynamic(
  () => import("@/components/apply-modal").then((m) => m.ApplyModal),
  // No loading state: the modal renders its own overlay, and a placeholder
  // would flash a bare backdrop for one frame before the real dialog mounts.
  { ssr: false }
);

export function ApplyModalLazy() {
  const open = useApplyModalOpen();

  // Mounted only while open. next/dynamic caches the resolved module, so a
  // close/reopen re-mounts instantly without re-downloading the chunk.
  //
  // TRADEOFF: <ApplyModal> holds its form state in component state and does
  // NOT reset on open, so unmounting on close discards a partly-filled form —
  // previously it survived because the modal was permanently mounted. That is
  // accepted here because this component exists to keep the modal off the
  // landing page's critical path, and the landing page cannot open it at all.
  // If a route ever needs close/reopen to preserve a draft, lift that state
  // into lib/apply-modal-store rather than making this mount unconditionally.
  return open ? <ApplyModal /> : null;
}
