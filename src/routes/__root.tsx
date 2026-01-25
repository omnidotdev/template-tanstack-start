import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

import { ErrorBoundary, Footer, Header } from "@/components/layout";
import auth from "@/lib/auth/auth";
import app from "@/lib/config/app.config";
import { isDevEnv } from "@/lib/config/env.config";
import appCss from "@/lib/styles/globals.css?url";
import createMetaTags from "@/lib/util/createMetaTags";
import ThemeProvider from "@/providers/ThemeProvider";
import { getThemeServerFn } from "@/server/functions/theme";

import type { QueryClient } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

const fetchSession = createServerFn().handler(async () => {
  const headers = getRequestHeaders();

  return await auth.api.getSession({ headers });
});

/**
 * Coming soon teaser page for production.
 */
function ComingSoon() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-sky-900 to-sky-800">
      <div className="text-center">
        <div className="text-9xl">✨</div>
      </div>
    </div>
  );
}

/**
 * Root route.
 */
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async () => {
    const session = await fetchSession();

    return { auth: session };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "theme-color",
        content: app.pwa.themeColor,
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "default",
      },
      {
        name: "apple-mobile-web-app-title",
        content: app.name,
      },
      {
        name: "mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "msapplication-TileColor",
        content: app.pwa.themeColor,
      },
      ...createMetaTags(),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "apple-touch-icon",
        href: "/img/favicon-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/img/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/img/favicon-16x16.png",
      },
    ],
  }),
  loader: () => getThemeServerFn(),
  errorComponent: ErrorBoundary,
  component: RootComponent,
});

function RootComponent() {
  // Note: Production teaser is intentionally disabled for this app
  // To enable, uncomment the isDevEnv check below
  // if (!isDevEnv) {
  //   return (
  //     <RootDocument>
  //       <ComingSoon />
  //     </RootDocument>
  //   );
  // }

  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

// Suppress unused warnings while teaser is disabled
void isDevEnv;
void ComingSoon;

/**
 * Register the service worker for PWA functionality.
 *
 * The service worker (sw.js) is built by @serwist/vite from src/sw.ts and provides:
 * - Precaching of static assets for offline access
 * - Runtime caching strategies for dynamic content
 * - Navigation preloading for faster page loads
 *
 * Update behavior:
 * - Checks for SW updates every hour via registration.update()
 * - When an update is found, shows a toast notification
 * - User can choose when to refresh (non-disruptive updates)
 * - skipWaiting + clientsClaim in sw.ts ensures immediate activation on refresh
 */
const registerServiceWorker = async () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.info("SW registered:", registration.scope);

    // Check for updates hourly. This catches updates even if users keep the tab
    // open for extended periods. The browser also checks on navigation events.
    setInterval(
      () => {
        registration.update();
      },
      60 * 60 * 1000,
    );

    // Listen for new service worker installations
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        // Only show update notification if there's an existing controller,
        // meaning this is an update, not the initial installation
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          toast("Update Available", {
            description: "A new version is available. Refresh to update.",
            action: {
              label: "Refresh",
              onClick: () => window.location.reload(),
            },
            duration: Number.POSITIVE_INFINITY,
          });
        }
      });
    });
  } catch (error) {
    console.error("SW registration failed:", error);
  }
};

/**
 * Root document.
 */
function RootDocument({ children }: PropsWithChildren) {
  const theme = Route.useLoaderData();

  // Register service worker on client
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <html suppressHydrationWarning lang="en" className={theme}>
      <head>
        <HeadContent />
      </head>

      <body>
        <ThemeProvider theme={theme}>
          <Header />

          <div className="relative flex h-dvh w-full flex-col gap-0 pl-[calc(100vw-100%)]">
            <main className="mt-16.5 flex-1">{children}</main>

            <Footer />
          </div>

          <Toaster position="top-center" richColors />
        </ThemeProvider>

        <TanStackDevtools
          plugins={[
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
              defaultOpen: true,
            },
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />

        <Scripts />
      </body>
    </html>
  );
}

export default RootDocument;
