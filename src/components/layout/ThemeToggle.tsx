import { MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "@/providers/ThemeProvider";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <button type="button" onClick={toggleTheme} className="dark:text-white">
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};
