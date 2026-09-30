"use client";

import { RiContrast2Line } from "@remixicon/react";

/**
 * Flips between light and dark, storing the choice in a cookie so the server
 * can render the right class on the first paint. The class is also applied
 * immediately here, so the change is instant rather than waiting on a request.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const currentlyDark = root.classList.contains("dark")
      ? true
      : root.classList.contains("light")
        ? false
        : window.matchMedia("(prefers-color-scheme: dark)").matches;

    const next = currentlyDark ? "light" : "dark";
    root.classList.remove("light", "dark");
    root.classList.add(next);
    document.cookie = `cvspan-theme=${next}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="text-secondary hover:bg-raised hover:text-primary flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors"
    >
      <RiContrast2Line size={20} aria-hidden />
    </button>
  );
}
