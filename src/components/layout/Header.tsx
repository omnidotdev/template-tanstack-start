import { useMutation } from "@tanstack/react-query";
import { Link, useRouteContext, useRouter } from "@tanstack/react-router";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/authClient";

export const Header = () => {
  const { auth } = useRouteContext({ strict: false });
  const router = useRouter();

  const { mutateAsync: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: async () =>
      await authClient.signIn.oauth2({
        providerId: "omni",
        callbackURL: "/",
        disableRedirect: false,
      }),
  });

  const { mutateAsync: signOut, isPending: isSignOutPending } = useMutation({
    mutationFn: async () => await authClient.signOut(),
    onSuccess: () => router.invalidate(),
  });

  return (
    <header className="fixed top-0 z-50 w-full border border-b shadow-sm blur-ms">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/">
            <h1 className="font-bold text-xl">Start Template</h1>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {auth ? (
              <Button onClick={() => signOut()} disabled={isSignOutPending}>
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => signIn()} disabled={isSignInPending}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
