import {
  SiDiscord as DiscordIcon,
  SiX as XIcon,
} from "@icons-pack/react-simple-icons";

import { ExternalLink } from "@/components/core";
import app from "@/lib/config/app.config";

/**
 * Layout footer.
 */
const Footer = () => (
  <footer className="flex w-full flex-col items-center justify-center gap-2 p-4 text-muted-foreground sm:flex-row sm:gap-1">
    <p className="px-3">
      &copy; {new Date().getFullYear()} {app.organization.name}
    </p>

    <div className="hidden h-1/2 w-px bg-muted-foreground/30 sm:block" />

    <ExternalLink variant="ghost" href={app.docsUrl}>
      Docs
    </ExternalLink>

    <div className="hidden h-1/2 w-px bg-muted-foreground/30 sm:block" />

    <ExternalLink variant="ghost" href={app.legal.privacy}>
      Privacy
    </ExternalLink>

    <ExternalLink variant="ghost" href={app.legal.terms}>
      Terms
    </ExternalLink>

    <ExternalLink variant="ghost" href={app.legal.cookies}>
      Cookies
    </ExternalLink>

    <div className="hidden h-1/2 w-px bg-muted-foreground/30 sm:block" />

    <div className="flex items-center gap-1">
      <ExternalLink variant="ghost" href={app.socials.discord}>
        <DiscordIcon className="size-5" />
      </ExternalLink>

      <ExternalLink variant="ghost" href={app.socials.x}>
        <XIcon className="size-5" />
      </ExternalLink>
    </div>
  </footer>
);

export default Footer;
