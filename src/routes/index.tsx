import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";

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
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-2 p-2 text-xl">
        <CheckIcon />
        Hello World
      </div>

      <p className="my-4">
        The capital of the {data.country?.name} {data.country?.emoji} is{" "}
        {data.country?.capital}
      </p>
    </div>
  );
}
