import { Format } from "@ark-ui/react";
import { Button } from "@omnidotdev/thornberry/button";
import { useMutation } from "@tanstack/react-query";
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import { BuildingIcon, CheckIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import CreateWorkspaceModal from "@/components/pricing/CreateWorkspaceModal";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItemText,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import authClient from "@/lib/auth/authClient";
import { BASE_URL } from "@/lib/config/env.config";
import { capitalizeFirstLetter } from "@/lib/util";
import cn from "@/lib/utils";
import { createCheckoutWithWorkspace } from "@/server/functions/subscriptions";

import type { Price, Subscription } from "@omnidotdev/providers";
import type { OrganizationClaim } from "@omnidotdev/providers/auth";

export type { Price };

interface Props {
  price: Price;
  organizations?: OrganizationClaim[];
  orgSubscriptions?: Record<string, Subscription | null>;
}

const TIER_ORDER = ["free", "pro", "team"] as const;

const getTierIndex = (t: string | null): number =>
  TIER_ORDER.indexOf((t ?? "free") as (typeof TIER_ORDER)[number]);

/**
 * Price card with workspace-aware checkout
 */
const PriceCard = ({
  price,
  organizations: orgsProp = [],
  orgSubscriptions = {},
}: Props) => {
  const { auth } = useRouteContext({ strict: false });
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { tier?: string };
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tier = (price.metadata?.tier as string) ?? "free";
  const isTeamTier = tier === "team";
  const isFreeTier = tier === "free";

  // Helper to get tier from subscription
  const getOrgTier = (orgId: string): string => {
    const subscription = orgSubscriptions[orgId];
    if (!subscription) return "free";
    const productName = subscription.product?.name?.toLowerCase() ?? "";
    if (productName.includes("team")) return "team";
    if (productName.includes("pro")) return "pro";
    return "free";
  };

  // Categorize organizations by upgrade eligibility for this tier
  const allOrgs = orgsProp;
  const upgradeableOrgs = allOrgs.filter(
    (org) => getTierIndex(getOrgTier(org.id)) < getTierIndex(tier),
  );
  const nonUpgradeableOrgs = allOrgs.filter(
    (org) => getTierIndex(getOrgTier(org.id)) >= getTierIndex(tier),
  );

  // Auto-open dropdown when URL has ?tier matching this card (post-sign-in)
  const shouldAutoOpen = search.tier === tier && !!auth;

  const { mutateAsync: initiateCheckout } = useMutation({
    mutationFn: async (params: {
      workspaceId?: string;
      createWorkspace?: { name: string; slug: string };
    }) => {
      setIsCheckoutLoading(true);
      return createCheckoutWithWorkspace({
        data: {
          priceId: price.id,
          successUrl: `${BASE_URL}/organizations/__SLUG__/billing`,
          cancelUrl: `${BASE_URL}/pricing`,
          ...params,
        },
      });
    },
    onSuccess: (result) => {
      window.location.href = result.checkoutUrl;
    },
    onError: () => {
      setIsCheckoutLoading(false);
    },
  });

  // Handle workspace selection from dropdown
  const handleWorkspaceSelect = (workspaceId: string) => {
    if (workspaceId === "create-new") {
      setIsModalOpen(true);
    } else {
      initiateCheckout({ workspaceId });
    }
  };

  // Handle new workspace creation from modal
  const handleCreateWorkspace = (name: string, slug: string) => {
    setIsModalOpen(false);
    initiateCheckout({ createWorkspace: { name, slug } });
  };

  const handleClick = () => {
    if (!auth) {
      authClient.signIn.oauth2({
        providerId: "omni",
        callbackURL: `/pricing?tier=${tier}`,
        disableRedirect: false,
      });
      return;
    }

    // Free tier: navigate to workspaces
    if (isFreeTier) {
      if (!allOrgs.length) {
        navigate({ to: "/organizations" });
      } else {
        navigate({
          to: "/organizations/$orgSlug",
          params: { orgSlug: allOrgs[0].slug },
        });
      }
      return;
    }

    // Paid tier without orgs: open create workspace modal
    if (!allOrgs.length) {
      setIsModalOpen(true);
      return;
    }

    // Has orgs: dropdown handles the rest
  };

  // Show dropdown if authenticated, has orgs, paid tier
  const showDropdown = !!auth && !isFreeTier && !!allOrgs.length;

  const buttonContent = isFreeTier
    ? "Get Started"
    : `Continue with ${capitalizeFirstLetter(tier)}`;

  return (
    <>
      <CardRoot
        key={price?.id}
        className={cn(
          "relative flex flex-1 flex-col border-2",
          isTeamTier &&
            "border-primary-700 bg-primary-50 shadow-primary/20 dark:border-primary dark:bg-primary-1000",
        )}
      >
        {isTeamTier && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="rounded-full bg-primary-700 px-3 py-1 font-medium text-primary-foreground text-sm dark:bg-primary">
              Recommended
            </span>
          </div>
        )}

        <CardHeader
          className={cn(
            "mb-4 rounded-xl rounded-b-none bg-muted pb-8 text-center",
            isTeamTier && "bg-primary-400/10 dark:bg-primary-950/80",
          )}
        >
          <CardTitle className="font-bold text-2xl">
            {capitalizeFirstLetter(tier)}
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            {price.product?.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8 text-center">
          <div className="mb-8">
            <div className="flex items-baseline justify-center font-bold text-4xl">
              <Format.Number
                value={price.unit_amount! / 100}
                style="currency"
                notation="compact"
                currency="USD"
              />
              <span className="ml-1 font-medium text-lg text-muted-foreground">
                {price.recurring &&
                  !isFreeTier &&
                  `/${price.recurring.interval}`}
              </span>
            </div>
          </div>

          <ul className="space-y-4 text-left">
            {price.product?.marketing_features.map((feature) => (
              <li key={feature.name} className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-1 dark:bg-green-900">
                  <CheckIcon
                    size={14}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>

                <span className="text-foreground leading-6">
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="mt-auto pt-8">
          {showDropdown ? (
            <MenuRoot
              defaultOpen={shouldAutoOpen}
              onSelect={({ value }) => handleWorkspaceSelect(value)}
            >
              <MenuTrigger asChild>
                <Button
                  variant={isTeamTier ? undefined : "outline"}
                  size="lg"
                  className="w-full font-semibold"
                  disabled={isCheckoutLoading}
                >
                  {isCheckoutLoading ? "Loading..." : buttonContent}
                </Button>
              </MenuTrigger>
              <MenuPositioner className="!w-[var(--reference-width)]">
                <MenuContent className="w-full">
                  {allOrgs.length > 0 && (
                    <>
                      <MenuItemGroup>
                        <MenuItemGroupLabel className="text-muted-foreground">
                          Your workspaces
                        </MenuItemGroupLabel>

                        {upgradeableOrgs.map((org: OrganizationClaim) => (
                          <MenuItem
                            key={org.id}
                            value={org.id}
                            className="cursor-pointer"
                          >
                            <MenuItemText className="flex w-full items-center gap-2">
                              <BuildingIcon
                                size={16}
                                className="text-muted-foreground"
                              />
                              <span className="flex-1 truncate font-medium text-sm">
                                {org.name}
                              </span>
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary text-xs">
                                Upgrade
                              </span>
                            </MenuItemText>
                          </MenuItem>
                        ))}

                        {nonUpgradeableOrgs.map((org: OrganizationClaim) => {
                          const orgTier = getOrgTier(org.id);
                          const isSameTier = orgTier === tier;

                          return (
                            <MenuItem
                              key={org.id}
                              value={org.id}
                              disabled
                              className="opacity-60"
                            >
                              <MenuItemText className="flex w-full items-center gap-2">
                                <BuildingIcon
                                  size={16}
                                  className="text-muted-foreground"
                                />
                                <span className="flex-1 truncate font-medium text-sm">
                                  {org.name}
                                </span>
                                <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground text-xs">
                                  {isSameTier
                                    ? "Current plan"
                                    : capitalizeFirstLetter(orgTier)}
                                </span>
                              </MenuItemText>
                            </MenuItem>
                          );
                        })}
                      </MenuItemGroup>

                      <MenuSeparator />
                    </>
                  )}

                  <MenuItemGroup>
                    <MenuItem value="create-new" className="cursor-pointer">
                      <MenuItemText className="flex w-full items-center gap-2">
                        <PlusIcon size={16} className="text-muted-foreground" />
                        <span className="font-medium text-sm">
                          New workspace
                        </span>
                      </MenuItemText>
                    </MenuItem>
                  </MenuItemGroup>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          ) : (
            <Button
              variant={isTeamTier ? undefined : "outline"}
              size="lg"
              className="w-full font-semibold"
              onClick={handleClick}
              disabled={isCheckoutLoading}
            >
              {isCheckoutLoading ? "Loading..." : buttonContent}
            </Button>
          )}
        </CardFooter>
      </CardRoot>

      <CreateWorkspaceModal
        tierName={capitalizeFirstLetter(tier)}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreateWorkspace}
        isLoading={isCheckoutLoading}
      />
    </>
  );
};

export default PriceCard;
