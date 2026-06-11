"use client";

// Tiny module-level store so any CTA can open the single ApplyModal mounted
// in the root layout — no context provider needed.

import { useSyncExternalStore } from "react";

let isOpen = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function openApplyModal() {
  if (isOpen) return;
  isOpen = true;
  emit();
}

export function closeApplyModal() {
  if (!isOpen) return;
  isOpen = false;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useApplyModalOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isOpen,
    () => false
  );
}
