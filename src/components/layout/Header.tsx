import { Link, useRouteContext, useRouter } from "@tanstack/react-router";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
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
    <header className="fixed top-0 z-50 w-full border-gray-200 border-b bg-white shadow-sm blur-ms dark:border-gray-700 dark:bg-black">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/">
            <h1 className="font-bold text-xl">Start Template</h1>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {auth ? (
              <button
                type="button"
                className="rounded-lg bg-blue-700 px-3 py-2 text-white dark:bg-blue-500 dark:text-black"
                onClick={async () => {
                  await authClient.signOut();
                  router.invalidate();
                }}
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                className="rounded-lg bg-blue-700 px-3 py-2 text-white dark:bg-blue-500 dark:text-black"
                onClick={signIn}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
