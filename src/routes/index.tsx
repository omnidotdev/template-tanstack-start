import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";

import { usersOptions } from "@/options/users.options";

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(usersOptions());
  },
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(usersOptions());

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-2 p-2 text-xl">
        <CheckIcon />
        Hello World
      </div>

      <p className="my-4">There are {data.users?.totalCount} users</p>
    </div>
  );
}
