import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { auth } = Route.useRouteContext();

  return (
    <div className="flex h-full flex-col gap-2 text-pretty px-4 py-8 text-center sm:text-start">
      <h1 className="font-bold text-xl">Welcome, {auth?.user.name}!</h1>
      <h2 className="text-muted-foreground text-sm">
        Review and manage details about your account below.
      </h2>
    </div>
  );
}
