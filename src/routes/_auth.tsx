import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

const AuthRoute = createFileRoute("/_auth")({
  beforeLoad: async ({ context: { auth } }) => {
    if (!auth) throw redirect({ to: "/" });
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}

export default AuthRoute;
