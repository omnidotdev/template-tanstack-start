import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { app } from "@/lib/config/app.config";
import { useTheme } from "@/providers/ThemeProvider";

export const Footer = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <footer className="flex w-full items-center justify-center gap-1 p-4 text-muted-foreground">
      <p className="px-3">
        &copy; {new Date().getFullYear()} {app.organization.name}
      </p>

      <div className="h-1/2 w-px bg-muted-foreground/30" />

      <Button variant="ghost" onClick={() => navigate({ href: app.docsUrl })}>
        Docs
      </Button>

      <div className="h-1/2 w-px bg-muted-foreground/30" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          onClick={() => navigate({ href: app.socials.discord })}
        >
          <img
            src={
              theme === "light"
                ? "/socials/discord-logo-black.png"
                : "/socials/discord-logo-white.png"
            }
            alt="Discord"
            className="h-auto w-5"
          />
        </Button>

        <Button
          variant="ghost"
          onClick={() => navigate({ href: app.socials.x })}
        >
          <img
            src={
              theme === "light"
                ? "/socials/x-logo-black.png"
                : "/socials/x-logo-white.png"
            }
            alt="X"
            className="h-auto w-4"
          />
        </Button>
      </div>
    </footer>
  );
};
