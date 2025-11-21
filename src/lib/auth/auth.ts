import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";

import {
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_DISCOVERY_URL,
} from "@/lib/config/env.config";

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "omni",
          clientId: AUTH_CLIENT_ID!,
          clientSecret: AUTH_CLIENT_SECRET!,
          discoveryUrl: AUTH_DISCOVERY_URL!,
          scopes: ["openid", "profile", "email", "offline_access"],
          prompt: "consent",
          accessType: "offline",
        },
      ],
    }),
    // NB: must be the last plugin in the array
    reactStartCookies(),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 minutes
      strategy: "jwt",
      refreshCache: {
        updateAge: 60, // Refresh when 60 seconds remain before expiry
      },
    },
  },
  //  TODO: replace `advanced` configuration with this when https://github.com/better-auth/better-auth/pull/6013 is merged and released
  // account: {
  //   storeStateStrategy: "cookie",
  //   storeAccountCookie: true, // Store account data after OAuth flow in a cookie
  // },
  advanced: {
    oauthConfig: {
      storeStateStrategy: "cookie",
    },
  },
});
