import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Sign in · CVSpan Portal" };

async function signInAction(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=1");
    }
    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; expired?: string }>;
}) {
  const { error, expired } = await searchParams;

  return (
    <main className="bg-app flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-100">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="bg-brand text-on-accent flex size-10 items-center justify-center rounded-lg text-body font-bold">
            CV
          </span>
          <span className="text-primary text-title font-semibold">CVSpan Portal</span>
        </div>

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

          {error ? (
            <p
              role="alert"
              className="bg-error-surface text-error-text border-error-border mt-4 rounded-lg border px-3 py-2 text-caption"
            >
              That email and password combination was not recognised.
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
          Trouble signing in? Ask an admin to reset your access.
        </p>
      </div>
    </main>
  );
}
