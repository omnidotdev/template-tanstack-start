import { Button } from "@omnidotdev/thornberry/button";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import authClient from "@/lib/auth/authClient";
import app from "@/lib/config/app.config";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context: { auth } }) => {
    if (auth) throw redirect({ to: "/dashboard" });
  },
  component: HomePage,
});

/**
 * Signed-out landing page: product identity plus a single, clear call to action
 * to sign in. Authenticated visitors are redirected to the dashboard above.
 */
function HomePage() {
  const { mutate: signIn, isPending } = useMutation({
    mutationFn: () =>
      authClient.signIn.social({ provider: "omni", callbackURL: "/dashboard" }),
  });

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <span
          className="flex size-20 items-center justify-center rounded-2xl border border-border/60 bg-muted/40 text-5xl leading-none shadow-sm"
          aria-hidden="true"
        >
          {app.icon}
        </span>

        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl tracking-tight sm:text-5xl">
            {app.name}
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            {app.description}
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <Button
            size="lg"
            onClick={() => signIn()}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Redirecting to sign in" : "Sign in with Omni"}
          </Button>

          <a
            href={app.docsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground text-sm underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Explore the docs
          </a>
        </div>
      </div>
    </div>
  );
}
