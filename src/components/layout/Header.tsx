import { MenuRootProvider, useMenu } from "@ark-ui/react";
import { Button } from "@omnidotdev/thornberry/button";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useRouteContext } from "@tanstack/react-router";
import { Menu as MenuIcon } from "lucide-react";

import { InternalLink } from "@/components/core";
import { ThemeToggle } from "@/components/layout";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItemText,
  MenuPositioner,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import authClient from "@/lib/auth/authClient";
import signOut from "@/lib/auth/signOut";
import app from "@/lib/config/app.config";

/**
 * Primary navigation destinations, rendered inline on larger viewports and
 * collapsed into the navigation menu on mobile.
 */
const NAV_LINKS = [{ to: "/pricing", label: "Pricing" }] as const;

/**
 * Layout header.
 */
const Header = () => {
  const { auth } = useRouteContext({ strict: false });
  const location = useLocation();

  const accountMenu = useMenu();
  const navMenu = useMenu();

  const { mutateAsync: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: async (action: "sign-in" | "sign-up" = "sign-in") =>
      await authClient.signIn.oauth2({
        providerId: "omni",
        callbackURL: location.pathname,
        disableRedirect: false,
        // Flag a sign-up so the server promotes it to OIDC `prompt=create` (see
        // `authorizationUrlParams` in auth.ts), opening the provider's sign-up
        // page instead of the sign-in form
        ...(action === "sign-up" && {
          additionalData: { screen_hint: "signup" },
        }),
      }),
  });

  const handleSignOut = async () => {
    accountMenu.api.setOpen(false);
    await signOut();
  };

  return (
    <header className="fixed top-0 z-50 w-full border border-b bg-background shadow-sm blur-ms">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex min-w-0 gap-2">
            <InternalLink to="/" variant="unstyled" className="-ml-4">
              <h1 className="font-bold text-xl">{app.name}</h1>
            </InternalLink>

            {NAV_LINKS.map(({ to, label }) => (
              <InternalLink
                key={to}
                to={to}
                variant="ghost"
                className="hidden sm:inline-flex"
              >
                {label}
              </InternalLink>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <MenuRootProvider value={navMenu}>
              <MenuTrigger
                aria-label="Open navigation menu"
                className="inline-flex size-9 items-center justify-center rounded-md sm:hidden"
              >
                <MenuIcon className="size-5" />
              </MenuTrigger>

              <MenuPositioner>
                <MenuContent className="min-w-40">
                  {NAV_LINKS.map(({ to, label }) => (
                    <MenuItem key={to} value={to} asChild>
                      <InternalLink
                        to={to}
                        variant="unstyled"
                        className="justify-start"
                      >
                        <MenuItemText>{label}</MenuItemText>
                      </InternalLink>
                    </MenuItem>
                  ))}
                </MenuContent>
              </MenuPositioner>
            </MenuRootProvider>

            <ThemeToggle />

            {auth ? (
              <MenuRootProvider value={accountMenu}>
                <MenuTrigger className="rounded-full">
                  <AvatarRoot>
                    <AvatarImage src={auth.user.image ?? undefined} />
                    <AvatarFallback>{auth.user.name.charAt(0)}</AvatarFallback>
                  </AvatarRoot>
                </MenuTrigger>

                <MenuPositioner>
                  <MenuContent className="min-w-48">
                    <MenuItemGroup>
                      <MenuItemGroupLabel>My Account</MenuItemGroupLabel>

                      <MenuItem value="profile" asChild>
                        <InternalLink
                          to="/profile"
                          variant="unstyled"
                          className="justify-start"
                        >
                          <MenuItemText>Profile</MenuItemText>
                        </InternalLink>
                      </MenuItem>
                    </MenuItemGroup>

                    <MenuSeparator />

                    <Button
                      variant="destructive"
                      onClick={handleSignOut}
                      tabIndex={-1}
                    >
                      Sign Out
                    </Button>
                  </MenuContent>
                </MenuPositioner>
              </MenuRootProvider>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => signIn("sign-in")}
                  disabled={isSignInPending}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => signIn("sign-up")}
                  disabled={isSignInPending}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
