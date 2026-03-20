import { rootRouteId, useMatch, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import type { ErrorComponentProps } from "@tanstack/react-router";

/**
 * Default error boundary for caught route errors.
 */
const DefaultCatchBoundary = ({ error }: ErrorComponentProps) => {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="mb-6 text-6xl">✨</div>
        <h1 className="font-bold text-2xl text-destructive">
          Something went wrong
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          An unexpected error occurred. Please try again
          {isRoot ? " or return to the home page" : ""}.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.invalidate()}
            className="rounded-lg border border-border bg-card px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-accent"
          >
            Try again
          </button>
          {isRoot ? (
            <a
              href="/"
              className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
            >
              Go Home
            </a>
          ) : (
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
            >
              Go back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaultCatchBoundary;
