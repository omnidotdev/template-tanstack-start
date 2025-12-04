import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Home page.
 */
const HomePage = () => (
  <div className="flex h-full flex-col items-center justify-center gap-2">
    <div className="flex items-center gap-2 p-2 text-xl">
      Welcome. Sign in to Continue.
    </div>
  </div>
);

export const Route = createFileRoute("/")({
  beforeLoad: ({ context: { auth } }) => {
    if (auth) throw redirect({ to: "/dashboard" });
  },
  component: HomePage,
});
