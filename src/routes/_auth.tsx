import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

const AuthLayout = () => <Outlet />;

const AuthRoute = createFileRoute("/_auth")({
  beforeLoad: async ({ context: { auth } }) => {
    if (!auth) throw redirect({ to: "/" });
  },
  component: AuthLayout,
});

export default AuthRoute;
