import { CommandPalette as CommandPaletteShell } from "@omnidotdev/thornberry/command-palette";
import {
  GLOBAL_HOTKEYS,
  hotkeyLabel,
  useHotkeys,
} from "@omnidotdev/thornberry/use-hotkeys";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import {
  Building2,
  CreditCard,
  HomeIcon,
  LayoutDashboard,
  MoonStar,
  UserRound,
} from "lucide-react";

import { useTheme } from "@/providers/ThemeProvider";

import type { CommandAction } from "@omnidotdev/thornberry/command-palette";
import type { Theme } from "@/server/functions/theme";

/** Inputs to {@link buildCommands}, kept free of React so it unit-tests cleanly. */
export interface BuildCommandsParams {
  /** Router navigate function from `useNavigate`. */
  navigate: ReturnType<typeof useNavigate>;
  /** Whether a user session is present. Gates the authenticated routes. */
  isAuthenticated: boolean;
  /** Current theme, used to label the toggle action. */
  theme: Theme;
  /** Flip between light and dark. */
  toggleTheme: () => void;
}

/**
 * Pure factory for the palette's action list. Kept separate from the component
 * so it can be unit-tested without rendering, and so every product's adapter
 * reads the same way. Authenticated routes live behind the `_auth` layout, so
 * only surface them to signed-in users or the guard would bounce them home.
 */
export const buildCommands = ({
  navigate,
  isAuthenticated,
  theme,
  toggleTheme,
}: BuildCommandsParams): CommandAction[] => [
  {
    id: "home",
    label: "Home",
    group: "Navigation",
    icon: HomeIcon,
    onSelect: () => navigate({ to: "/" }),
  },
  {
    id: "pricing",
    label: "Pricing",
    group: "Navigation",
    icon: CreditCard,
    onSelect: () => navigate({ to: "/pricing" }),
  },
  ...(isAuthenticated
    ? ([
        {
          id: "dashboard",
          label: "Dashboard",
          group: "Navigation",
          icon: LayoutDashboard,
          onSelect: () => navigate({ to: "/dashboard" }),
        },
        {
          id: "organizations",
          label: "Workspaces",
          group: "Navigation",
          icon: Building2,
          keywords: ["orgs", "teams"],
          onSelect: () => navigate({ to: "/organizations" }),
        },
        {
          id: "profile",
          label: "Profile",
          group: "Navigation",
          icon: UserRound,
          keywords: ["account"],
          onSelect: () => navigate({ to: "/profile" }),
        },
      ] satisfies CommandAction[])
    : []),
  {
    id: "toggle-theme",
    label: theme === "light" ? "Switch to dark theme" : "Switch to light theme",
    group: "Preferences",
    icon: MoonStar,
    keywords: ["theme", "dark", "light", "appearance"],
    shortcut: hotkeyLabel(GLOBAL_HOTKEYS.toggleTheme),
    onSelect: toggleTheme,
  },
];

/**
 * Global command palette (⌘/Ctrl+K). Mounted once at the app root so it works on
 * every route. Exposes top-level navigation and the theme toggle. Built on the
 * shared Thornberry palette so every Omni app shares the same behavior; this
 * wrapper only supplies this product's own actions. The shell owns the open
 * state and the mod+k hotkey, so no local open state is needed here.
 */
const CommandPalette = () => {
  const navigate = useNavigate();
  const { auth } = useRouteContext({ strict: false });
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // App-wide theme shortcut. react-hotkeys-hook ignores form fields by default,
  // so this never fires while typing in the palette input or any other field
  useHotkeys(GLOBAL_HOTKEYS.toggleTheme, toggleTheme);

  const commands = buildCommands({
    navigate,
    isAuthenticated: Boolean(auth),
    theme,
    toggleTheme,
  });

  return (
    <CommandPaletteShell commands={commands} placeholder="Search actions..." />
  );
};

export default CommandPalette;
