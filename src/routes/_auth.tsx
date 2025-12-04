import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Auth layout.
 */
const AuthLayout = () => <Outlet />;

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context: { auth } }) => {
    if (!auth) throw redirect({ to: "/" });
  },
  component: AuthLayout,
});
