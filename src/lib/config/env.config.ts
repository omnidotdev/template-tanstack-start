// core
export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;
export const API_GRAPHQL_URL = `${API_BASE_URL}/graphql`;
export const AUTH_ISSUER_URL = `${AUTH_BASE_URL}/api/auth`;

// auth
export const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
export const AUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;
