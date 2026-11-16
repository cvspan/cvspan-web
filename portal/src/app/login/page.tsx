import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { withBasePath } from "@/lib/base-path";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { websiteUrl } from "@/lib/website";

const loginUrl = websiteUrl("/portal/login");
const description =
  "Sign in to the CVSpan Portal, where CVSpan team members manage projects, tasks, reviews, programmes and the website's blog and careers.";

/**
 * The one public page of the portal. It is indexable so that people searching for the CVSpan portal
 * find the way in; everything behind it stays out of search (see the root layout and next.config.ts).
 */
export const metadata: Metadata = {
  title: { absolute: "CVSpan Portal — Staff sign in" },
  description,
  alternates: { canonical: loginUrl },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: loginUrl,
    siteName: "CVSpan",
    title: "CVSpan Portal — Staff sign in",
    description,
    images: [{ url: websiteUrl("/opengraph-image"), width: 1200, height: 630, alt: "CVSpan" }],
  },
  twitter: { card: "summary_large_image", title: "CVSpan Portal — Staff sign in", description },
};

async function signInAction(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: withBasePath("/"),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect((error as { code?: string }).code === "too_many_attempts" ? "/login?error=locked" : "/login?error=1");
    }
    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; expired?: string; changed?: string }>;
}) {
  const { error, expired, changed } = await searchParams;

  return (
    <main className="bg-app flex min-h-dvh items-center justify-center p-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${loginUrl}#page`,
            url: loginUrl,
            name: "CVSpan Portal — Staff sign in",
            description,
            isPartOf: { "@type": "WebSite", name: "CVSpan", url: websiteUrl("/") },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div className="w-full max-w-100">
        {/* The logo leads back to the main site, so the portal and website are linked both ways. */}
        <a href={websiteUrl()} aria-label="CVSpan website" className="mb-6 block w-fit">
          <Logo height={32} className="block" />
        </a>

        <div className="border-line bg-card rounded-lg border p-6">
          <h1 className="text-primary text-h5 font-semibold">Sign in</h1>
          <p className="text-muted mt-1 text-body">
            Use your CVSpan work email to continue.
          </p>

          {expired ? (
            <p
              role="status"
              className="bg-warning-surface text-warning-text border-warning-border mt-4 rounded-lg border px-3 py-2 text-caption"
            >
              Your session ended because your account changed or was removed. Please sign in again.
            </p>
          ) : null}

          {changed ? (
            <p
              role="status"
              className="bg-success-surface text-success-text border-success-border mt-4 rounded-lg border px-3 py-2 text-caption"
            >
              Your password was changed. Sign in with the new one.
            </p>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="bg-error-surface text-error-text border-error-border mt-4 rounded-lg border px-3 py-2 text-caption"
            >
              {error === "locked"
                ? "Too many wrong passwords. Wait about 15 minutes and try again, or ask HR or an admin for a new password."
                : "That email and password combination was not recognised."}
            </p>
          ) : null}

          <form action={signInAction} className="mt-5 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-primary text-body font-semibold">Work email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@cvspan.com"
                className="border-line-input text-primary placeholder:text-muted h-11 rounded-lg border bg-transparent px-3.5 text-para outline-none"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-primary text-body font-semibold">Password</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="border-line-input text-primary h-11 rounded-lg border bg-transparent px-3.5 text-para outline-none"
              />
            </label>

            <Button type="submit" className="mt-1 h-11 w-full">
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-muted mt-4 text-center text-caption">
          Forgot your password? Ask HR or an admin for a new temporary one.
        </p>

        <nav aria-label="CVSpan website" className="text-muted mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 text-caption">
          <a href={websiteUrl()} className="hover:text-primary">
            cvspan.com
          </a>
          <a href={websiteUrl("/careers")} className="hover:text-primary">
            Careers
          </a>
          <a href={websiteUrl("/blog")} className="hover:text-primary">
            Blog
          </a>
          <a href={websiteUrl("/legal/privacy-policy")} className="hover:text-primary">
            Privacy
          </a>
        </nav>
      </div>
    </main>
  );
}
