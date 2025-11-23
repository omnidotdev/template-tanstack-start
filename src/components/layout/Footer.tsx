import ExternalLink from "@/components/core/ExternalLink";
import { app } from "@/lib/config/app.config";

export const Footer = () => {
  return (
    <footer className="flex w-full items-center justify-center gap-1 p-4 text-muted-foreground">
      <p className="px-3">
        &copy; {new Date().getFullYear()} {app.organization.name}
      </p>

      <div className="h-1/2 w-px bg-muted-foreground/30" />

      <ExternalLink variant="ghost" href={app.docsUrl}>
        Docs
      </ExternalLink>

      <div className="h-1/2 w-px bg-muted-foreground/30" />

      <div className="flex items-center gap-1">
        <ExternalLink variant="ghost" href={app.socials.discord}>
          <img
            src="/socials/discord-logo-black.png"
            alt="discord"
            className="block h-auto w-5 dark:hidden"
          />
          <img
            src="/socials/discord-logo-white.png"
            alt="discord"
            className="hidden h-auto w-5 dark:block"
          />
        </ExternalLink>

        <ExternalLink variant="ghost" href={app.socials.x}>
          <img
            src="/socials/x-logo-black.png"
            alt="X"
            className="block h-auto w-4 dark:hidden"
          />
          <img
            src="/socials/x-logo-white.png"
            alt="X"
            className="hidden h-auto w-4 dark:block"
          />
        </ExternalLink>
      </div>
    </footer>
  );
};
