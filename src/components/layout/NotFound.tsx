import type { PropsWithChildren } from "react";

/**
 * 404 not found.
 */
const NotFound = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-2">
    <div className="text-6xl">✨</div>

    <div className="text-muted-foreground">
      {children || <p>Page Not Found</p>}
    </div>

    <p className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="rounded-lg border border-border bg-card px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-accent"
      >
        Go back
      </button>

      <a
        href="/"
        className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
      >
        Go Home
      </a>
    </p>
  </div>
);

export default NotFound;
