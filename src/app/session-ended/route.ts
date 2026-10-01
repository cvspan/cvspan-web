import { signOut } from "@/auth";

/**
 * Where `requireUser` sends a session whose account no longer exists or has lost access.
 * Redirecting straight to /login would bounce back to the dashboard, because the proxy still
 * sees a valid token; clearing the session first breaks that loop.
 */
export async function GET() {
  await signOut({ redirectTo: "/login?expired=1" });
}
