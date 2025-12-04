import { Format } from "@ark-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import authClient from "@/lib/auth/authClient";
import { BASE_URL } from "@/lib/config/env.config";
import payments from "@/lib/payments";
import { capitalizeFirstLetter } from "@/lib/util";
import cn from "@/lib/utils";
import authMiddleware from "@/server/authMiddleware";

import type Stripe from "stripe";
import type { CardProps } from "@/components/ui/card";

const checkoutSchema = z.object({
  priceId: z.string().startsWith("price_"),
  email: z.email(),
});

const getCheckoutUrl = createServerFn({ method: "POST" })
  .inputValidator((data) => checkoutSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    let customerId: Stripe.Customer["id"];

    const customers = await payments.customers.search({
      query: `email:"${data.email}"`,
    });

    if (!customers.data.length) {
      const customer = await payments.customers.create({
        email: data.email,
        metadata: {
          externalId: context.idToken.sub!,
        },
      });

      customerId = customer.id;
    } else {
      customerId = customers.data[0].id;
    }

    const session = await payments.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: data.priceId, quantity: 1 }],
      customer: customerId,
      success_url: `${BASE_URL}/pricing`,
    });

    return session.url as string;
  });

export interface Price {
  id: Stripe.Price["id"];
  unit_amount: Stripe.Price["unit_amount"];
  product: {
    name: Stripe.Product["name"];
    description: Stripe.Product["description"];
    marketing_features: Stripe.Product["marketing_features"];
  };
  recurring?: Stripe.Price["recurring"];
}

interface Props extends CardProps {
  price: Price;
  disableAction?: boolean;
}

const PriceCard = ({ price, className, disableAction, ...rest }: Props) => {
  const { auth } = useRouteContext({ from: "/pricing" });
  const navigate = useNavigate();

  const { mutateAsync: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: async () =>
      await authClient.signIn.oauth2({
        providerId: "omni",
        callbackURL: "/pricing",
        disableRedirect: false,
      }),
  });

  const { mutateAsync: checkout } = useMutation({
    mutationFn: async ({ priceId, email }: z.input<typeof checkoutSchema>) =>
      await getCheckoutUrl({ data: { priceId, email } }),
    onSuccess: (url) => navigate({ href: url, reloadDocument: true }),
    onError: (error) => toast.error(error.message),
  });

  return (
    <CardRoot
      key={price.product.name}
      className={cn(
        "size-full max-w-lg overflow-hidden lg:min-w-80",
        className,
      )}
      {...rest}
    >
      <CardHeader className="bg-muted pb-3 lg:min-h-[202px]">
        <div className="flex flex-1 flex-col">
          <CardTitle className="text-lg">
            {capitalizeFirstLetter(price.product.name)}
          </CardTitle>

          <CardDescription className="mt-2 mb-4 flex-1">
            {price.product.description}
          </CardDescription>

          <p className="font-semibold text-lg">
            <Format.Number
              value={price.unit_amount! / 100}
              style="currency"
              currency="USD"
              notation="compact"
              compactDisplay="short"
            />
            <span className="pl-1 font-normal text-muted-foreground text-sm">
              /{price.recurring ? price.recurring.interval : "forever"}
            </span>
          </p>
        </div>

        {auth ? (
          <Button
            disabled={disableAction}
            onClick={() =>
              checkout({ priceId: price.id, email: auth.user.email })
            }
          >
            Get Started
          </Button>
        ) : (
          <Button disabled={isSignInPending} onClick={() => signIn()}>
            Get Started
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-4">
        {price.product.marketing_features.map((feature) => (
          <div key={feature.name} className="flex items-center gap-2">
            <CheckIcon className="size-4 text-primary" />
            <p>{feature.name}</p>
          </div>
        ))}
      </CardContent>
    </CardRoot>
  );
};

export default PriceCard;
