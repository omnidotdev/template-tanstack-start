import { HttpResponse, http } from "msw";

const AUTH_BASE_URL = "https://localhost:8000";

/**
 * Test user returned by mocked OIDC endpoints.
 */
export const TEST_USER = {
  id: "test-user-id-12345",
  email: "test@example.com",
  name: "Test User",
  image: null,
} as const;

/**
 * Mock OIDC discovery document.
 */
const oidcDiscovery = {
  issuer: AUTH_BASE_URL,
  authorization_endpoint: `${AUTH_BASE_URL}/oauth2/authorize`,
  token_endpoint: `${AUTH_BASE_URL}/oauth2/token`,
  userinfo_endpoint: `${AUTH_BASE_URL}/oauth2/userinfo`,
  jwks_uri: `${AUTH_BASE_URL}/.well-known/jwks.json`,
  scopes_supported: ["openid", "profile", "email", "offline_access"],
  response_types_supported: ["code"],
  grant_types_supported: ["authorization_code", "refresh_token"],
  token_endpoint_auth_methods_supported: ["client_secret_post"],
  code_challenge_methods_supported: ["S256"],
};

/**
 * Auth-related MSW handlers for mocking OIDC and Better Auth endpoints.
 */
export const authHandlers = [
  // OIDC Discovery endpoint
  http.get(`${AUTH_BASE_URL}/.well-known/openid-configuration`, () => {
    return HttpResponse.json(oidcDiscovery);
  }),

  // JWKS endpoint (empty for testing - tokens won't be validated)
  http.get(`${AUTH_BASE_URL}/.well-known/jwks.json`, () => {
    return HttpResponse.json({ keys: [] });
  }),

  // Token endpoint
  http.post(`${AUTH_BASE_URL}/oauth2/token`, async () => {
    return HttpResponse.json({
      access_token: "mock-access-token",
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: "mock-refresh-token",
      id_token: "mock-id-token",
      scope: "openid profile email offline_access",
    });
  }),

  // Userinfo endpoint
  http.get(`${AUTH_BASE_URL}/oauth2/userinfo`, ({ request }) => {
    const auth = request.headers.get("authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

    if (!token || token === "bad-token") {
      return HttpResponse.json({ error: "invalid_token" }, { status: 401 });
    }

    return HttpResponse.json({
      sub: TEST_USER.id,
      email: TEST_USER.email,
      name: TEST_USER.name,
      picture: TEST_USER.image,
    });
  }),

  // Better Auth session endpoint
  http.get("*/api/auth/get-session", () => {
    return HttpResponse.json({
      session: {
        id: "test-session-id",
        userId: TEST_USER.id,
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      user: {
        id: TEST_USER.id,
        email: TEST_USER.email,
        name: TEST_USER.name,
        image: TEST_USER.image,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }),
];
