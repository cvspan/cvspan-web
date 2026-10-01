import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The project's type scale lives in globals.css (--text-body, --text-caption…). Without telling
 * tailwind-merge about those names it takes `text-body` for a text *colour* and, when it follows
 * `text-on-accent` or `text-primary`, silently drops the colour. That left primary buttons with
 * dark text on blue in light mode.
 */
const customTextSizes = ["h1", "h2", "h3", "h4", "h5", "title", "para", "body", "caption", "tiny"];

const twMerge = extendTailwindMerge({
  extend: { theme: { text: customTextSizes } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
