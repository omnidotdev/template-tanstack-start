import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { EventsProvider } from "@/providers/EventsProvider";

// Noop provider for client-side (main @omnidotdev/providers entry requires Node.js)
const eventsProvider = {
  async emit() {
    return {
      eventId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
  },
};

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
