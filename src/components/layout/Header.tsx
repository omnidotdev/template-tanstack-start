import { Link, useRouteContext, useRouter } from "@tanstack/react-router";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/authClient";

export const Header = () => {
  const { auth } = useRouteContext({ strict: false });
  const router = useRouter();

  const signIn = async () =>
    await authClient.signIn.oauth2({
      providerId: "omni",
      callbackURL: "/",
      disableRedirect: false,
    });

  return (
    <header className="fixed top-0 z-50 w-full border-border border-b shadow-sm blur-ms">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/">
            <h1 className="font-bold text-xl">Start Template</h1>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {auth ? (
              <Button
                onClick={async () => {
                  await authClient.signOut();
                  router.invalidate();
                }}
              >
                Sign Out
              </Button>
            ) : (
              <Button onClick={signIn}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
