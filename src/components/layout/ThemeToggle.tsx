import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <Button variant="ghost" onClick={toggleTheme}>
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};
