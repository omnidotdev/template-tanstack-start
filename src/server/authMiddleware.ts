import { createMiddleware } from "@tanstack/react-start";
import { createRemoteJWKSet, jwtVerify } from "jose";

import auth from "@/lib/auth/auth";
import { AUTH_ISSUER_URL } from "@/lib/config/env.config";

const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  const { accessToken, idToken } = await auth.api.getAccessToken({
    body: { providerId: "omni" },
    headers: request.headers,
  });

  if (!idToken) throw new Error("ID Token not found");

  const jwks = createRemoteJWKSet(new URL(`${AUTH_ISSUER_URL}/jwks`));

  const { payload } = await jwtVerify(idToken, jwks);

  if (!payload) throw new Error("Invalid ID Token");

  return next({
    context: {
      accessToken,
      idToken: payload,
    },
  });
});

export default authMiddleware;
