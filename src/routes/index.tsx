import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { countryOptions } from "@/options/country.options";

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(countryOptions({ code: "US" }));
  },
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(countryOptions({ code: "US" }));

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-2">
      <div className="flex gap-2 rounded-lg bg-blue-500 p-2 text-white dark:text-black">
        <CheckIcon />
        Hello World
      </div>
      <p className="my-4">
        The capital of the {data.country?.name} {data.country?.emoji} is{" "}
        {data.country?.capital}
      </p>
      <ThemeToggle />
    </div>
  );
}
