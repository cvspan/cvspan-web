import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { ChangePasswordForm } from "@/components/forms/password-forms";
import { requireUser } from "@/lib/session";
import { websiteUrl } from "@/lib/website";

export const metadata: Metadata = { title: "Choose a password", robots: { index: false, follow: false } };

/**
 * Where someone lands after signing in with a temporary password. It sits outside the portal layout on
 * purpose: until they have chosen their own password there is nothing else for them to open.
 */
export default async function ChangePasswordPage() {
  const user = await requireUser();
  /** Nothing to do here for someone who is not being asked: their own page for it is in Settings. */
  if (!user.mustChangePassword) redirect("/settings");

  return (
    <main className="bg-app flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-100">
        <a href={websiteUrl()} aria-label="CVSpan website" className="mb-6 block w-fit">
          <Logo height={32} className="block" />
        </a>
        <div className="border-line bg-card rounded-lg border p-6">
          <h1 className="text-primary text-h5 font-semibold">Choose your own password</h1>
          <p className="text-muted mt-1 mb-5 text-body">
            Hello {user.name.split(" ")[0]}. You signed in with a temporary password. Choose a new one that only you know,
            then sign in again.
          </p>
          <ChangePasswordForm forced />
        </div>
      </div>
    </main>
  );
}
