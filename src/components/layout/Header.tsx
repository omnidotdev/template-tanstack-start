import { MenuRootProvider, useMenu } from "@ark-ui/react";
import { useMutation } from "@tanstack/react-query";
import {
  useLocation,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";

import { InternalLink } from "@/components/core";
import { ThemeToggle } from "@/components/layout";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import app from "@/lib/config/app.config";

/**
 * Layout header.
 */
const Header = () => {
  const { auth } = useRouteContext({ strict: false });
  const router = useRouter();
  const location = useLocation();

  const accountMenu = useMenu();

  const { mutateAsync: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: async () =>
      await authClient.signIn.oauth2({
        providerId: "omni",
        callbackURL: location.pathname,
        disableRedirect: false,
      }),
  });

  const { mutateAsync: signOut } = useMutation({
    mutationFn: async () => await authClient.signOut(),
    onMutate: () => accountMenu.api.setOpen(false),
    onSuccess: () => router.invalidate(),
  });

  return (
    <header className="fixed top-0 z-50 w-full border border-b bg-background shadow-sm blur-ms">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-2">
            <InternalLink to="/" variant="unstyled" className="-ml-4">
              <h1 className="font-bold text-xl">{app.name}</h1>
            </InternalLink>

            <InternalLink to="/pricing" variant="ghost">
              Pricing
            </InternalLink>
          </div>

          <div className="flex items-center gap-4">
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
                      onClick={() => signOut()}
                      tabIndex={-1}
                    >
                      Sign Out
                    </Button>
                  </MenuContent>
                </MenuPositioner>
              </MenuRootProvider>
            ) : (
              <Button onClick={() => signIn()} disabled={isSignInPending}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
