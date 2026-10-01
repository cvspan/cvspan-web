import "server-only";
import { BASE_PATH } from "./base-path";

/** The origins allowed to call the public API from a browser, from WEBSITE_ORIGINS. */
export function allowedOrigins() {
  return (process.env.WEBSITE_ORIGINS ?? "https://cvspan.com,https://www.cvspan.com")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

/**
 * The portal's public address including its prefix, used to turn stored image paths into URLs
 * another site can load. Falls back to the address the request arrived on.
 */
export function portalPublicUrl(request?: Request) {
  const configured = process.env.PORTAL_PUBLIC_URL?.replace(/\/+$/, "");
  if (configured) return configured;
  return request ? `${new URL(request.url).origin}${BASE_PATH}` : BASE_PATH;
}

/**
 * CORS headers for a browser call. Reading public content is open to any site; writing (applying
 * for a job) is limited to the website's own origins.
 */
export function corsHeaders(request: Request, { write }: { write: boolean }) {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = { Vary: "Origin" };

  if (!write) {
    headers["Access-Control-Allow-Origin"] = "*";
  } else if (origin && allowedOrigins().includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  headers["Access-Control-Allow-Methods"] = write ? "POST, OPTIONS" : "GET, OPTIONS";
  headers["Access-Control-Allow-Headers"] = "Content-Type";
  headers["Access-Control-Max-Age"] = "86400";
  return headers;
}

/** Public content can be cached by a CDN for a minute, then served stale while it refreshes. */
export const PUBLIC_CACHE = "public, s-maxage=60, stale-while-revalidate=300";

export function publicJson(request: Request, data: unknown, init?: { status?: number; cache?: boolean }) {
  return Response.json(data, {
    status: init?.status ?? 200,
    headers: {
      ...corsHeaders(request, { write: false }),
      "Cache-Control": init?.cache === false ? "no-store" : PUBLIC_CACHE,
    },
  });
}

export function publicError(request: Request, status: number, error: string) {
  return Response.json(
    { error },
    { status, headers: { ...corsHeaders(request, { write: false }), "Cache-Control": "no-store" } },
  );
}

/** The answer to a CORS preflight. */
export function preflight(request: Request, { write }: { write: boolean }) {
  return new Response(null, { status: 204, headers: corsHeaders(request, { write }) });
}
