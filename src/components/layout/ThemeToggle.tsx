import { Button } from "@omnidotdev/thornberry/button";
import { MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "@/providers/ThemeProvider";

/**
 * Theme toggle.
 */
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};

export default ThemeToggle;
