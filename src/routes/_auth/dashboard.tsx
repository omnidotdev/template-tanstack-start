import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/util/seo";
import { usersOptions } from "@/options/users.options";

export const Route = createFileRoute("/_auth/dashboard")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(usersOptions());
  },
  head: () => ({
    meta: seo({ title: "Dashboard" }),
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data } = useSuspenseQuery(usersOptions());

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-2 p-2 text-xl">
        Hello from an Authenticated Route
      </div>

      <p className="my-4">There are {data.users?.totalCount} total users.</p>
    </div>
  );
}
