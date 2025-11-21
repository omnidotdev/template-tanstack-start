import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-2">
      <div className="flex gap-2 rounded-lg bg-blue-500 p-2 text-white">
        <CheckIcon />
        Hello World
      </div>
      <ThemeToggle />
    </div>
  );
}
