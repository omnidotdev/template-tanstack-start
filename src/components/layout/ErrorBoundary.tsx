import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import type { ErrorComponentProps } from "@tanstack/react-router";

/**
 * Error boundary.
 */
const ErrorBoundary = ({ error }: ErrorComponentProps) => {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 p-4">
      <ErrorComponent error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => {
            router.invalidate();
          }}
        >
          Try Again
        </Button>

        {isRoot ? (
          <Link to="/">Home</Link>
        ) : (
          <Link
            to="/"
            onClick={(evt) => {
              evt.preventDefault();
              window.history.back();
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;
