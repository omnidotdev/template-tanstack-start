import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import type { PropsWithChildren } from "react";

/**
 * 404 not found.
 */
const NotFound = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-2">
    <div className="text-6xl">404</div>

    <div className="text-muted-foreground">
      {children || <p>Page Not Found</p>}
    </div>

    <p className="flex flex-wrap items-center gap-2">
      <Button onClick={() => window.history.back()}>Go back</Button>

      <Link to="/">Go Home</Link>
    </p>
  </div>
);

export default NotFound;
