import Image from "next/image";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

/** Artwork is 500×102 (full logo) and 220×102 (icon); width follows from the height we ask for. */
const FULL = { width: 500, height: 102 };
const ICON = { width: 220, height: 102 };

/**
 * The CVSpan logo. `white` is for surfaces that are always dark or brand-blue, like the sidebar.
 * `auto` follows the theme: the coloured logo on light, the white one on dark.
 */
export function Logo({
  tone = "auto",
  mark = false,
  height = 28,
  className,
}: {
  tone?: "white" | "auto";
  /** The icon alone, without the wordmark. */
  mark?: boolean;
  height?: number;
  className?: string;
}) {
  const size = mark ? ICON : FULL;
  const width = Math.round((size.width / size.height) * height);
  const name = mark ? "icon" : "logo";

  const image = (file: string, extra?: string) => (
    <Image
      /** SVGs are served as-is, so next/image doesn't add the base path for us. */
      src={withBasePath(`/brand/${file}.svg`)}
      alt={extra ? "" : "CVSpan"}
      aria-hidden={extra ? true : undefined}
      width={width}
      height={height}
      style={{ height, width }}
      className={cn("max-w-none", extra)}
      priority
    />
  );

  if (tone === "white") return <span className={className}>{image(`${name}-white`)}</span>;

  return (
    <span className={className}>
      <span className="brand-on-light">{image(`${name}-color`)}</span>
      <span className="brand-on-dark">{image(`${name}-white`, "")}</span>
    </span>
  );
}
