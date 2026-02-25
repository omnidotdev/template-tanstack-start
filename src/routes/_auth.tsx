import { createEventsProvider } from "@omnidotdev/providers";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { EventsProvider } from "@/providers/EventsProvider";

const eventsProvider = createEventsProvider({});

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context: { auth } }) => {
    if (!auth) throw redirect({ to: "/" });
  },
  component: AuthLayout,
});

/**
 * Auth layout.
 */
function AuthLayout() {
  return (
    <EventsProvider provider={eventsProvider}>
      <Outlet />
    </EventsProvider>
  );
}
