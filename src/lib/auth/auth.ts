import { betterAuth } from "better-auth/minimal";
import { genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import {
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_ISSUER_URL,
} from "@/lib/config/env.config";

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "omni",
          clientId: AUTH_CLIENT_ID!,
          clientSecret: AUTH_CLIENT_SECRET!,
          discoveryUrl: `${AUTH_ISSUER_URL!}/.well-known/openid-configuration`,
          scopes: ["openid", "profile", "email", "offline_access"],
          prompt: "consent",
          accessType: "offline",
          pkce: true,
        },
      ],
    }),
    // NB: must be the last plugin in the array
    tanstackStartCookies(),
  ],
});
