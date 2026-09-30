"use client";

import { RiMoonLine, RiSunLine } from "@remixicon/react";

/**
 * Toggles the `dark` class on <html>. Which icon shows is decided by CSS, not state,
 * so the server and client render the same markup and there is no hydration flicker.
 */
export function ThemeToggle() {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("cvspan-theme", dark ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="text-secondary hover:bg-raised hover:text-primary flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors"
    >
      <RiMoonLine size={20} className="block dark:hidden" aria-hidden />
      <RiSunLine size={20} className="hidden dark:block" aria-hidden />
    </button>
  );
}
