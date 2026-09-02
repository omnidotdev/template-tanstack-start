import { createAuthClient } from "better-auth/react";

/**
 * Auth browser client.
 *
 * better-auth 1.7 rebuilt generic OAuth on the social-provider path, so the
 * dedicated `genericOAuthClient` plugin is gone; generic providers are driven
 * through `signIn.social` on the base client with no extra client plugin
 */
const authClient = createAuthClient();

export default authClient;
