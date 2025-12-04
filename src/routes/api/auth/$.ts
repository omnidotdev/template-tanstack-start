import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

import auth from "@/lib/auth/auth";

const loggingMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      const response = await next();
      const duration = Date.now() - startTime;

      console.info(
        `[${timestamp}] ${request.method} ${request.url} - (${duration}ms)`,
      );

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `[${timestamp}] ${request.method} ${request.url} - Error (${duration}ms):`,
        error,
      );

      throw error;
    }
  },
);

const ApiAuthRoute = createFileRoute("/api/auth/$")({
  server: {
    middleware: [loggingMiddleware],
    handlers: {
      GET: ({ request }) => {
        return auth.handler(request);
      },
      POST: ({ request }) => {
        return auth.handler(request);
      },
    },
  },
});

export default ApiAuthRoute;
