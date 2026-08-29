import { useSessionRefresh } from "@omnidotdev/providers/react";
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
import { Toaster } from "sonner";

import {
  DefaultCatchBoundary,
  Footer,
  Header,
  NotFound,
} from "@/components/layout";
import auth from "@/lib/auth/auth";
import app from "@/lib/config/app.config";
import { isDevEnv } from "@/lib/config/env.config";
import "@/lib/styles/globals.css";

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
        <h1 className="font-bold text-6xl text-white tracking-tight">
          {app.name}
        </h1>
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
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      // .ico fallback for surfaces that don't read SVG favicons (link previews, iMessage)
      {
        rel: "icon",
        href: "/favicon.ico",
        sizes: "any",
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
      {
        rel: "canonical",
        href: app.url,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: app.name,
          url: app.url,
          description: app.description,
        }),
      },
    ],
  }),
  loader: () => getThemeServerFn(),
  errorComponent: DefaultCatchBoundary,
  // Render 404s in-shell: a thrown `notFound()` renders here inside RootDocument
  // (globals + layout), not as a bare unstyled page. Pairs with the router's
  // `defaultNotFoundComponent` for unmatched routes.
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  // Keep the OAuth access token fresh while the user is idle
  useSessionRefresh(fetchSession);

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
 * Root document.
 */
function RootDocument({ children }: PropsWithChildren) {
  const theme = Route.useLoaderData();

  return (
    <html suppressHydrationWarning lang="en" className={theme}>
      <head>
        <HeadContent />
      </head>

      <body>
        <ThemeProvider theme={theme}>
          <Header />

          <div className="relative flex h-dvh w-full flex-col gap-0 pl-[calc(100vw-100%)]">
            {/* min-w-0 so a wide descendant (a long unbreakable string, a wide
                table) is contained instead of forcing horizontal page overflow */}
            <main className="mt-16.5 min-w-0 flex-1">{children}</main>

            <Footer />
          </div>

          <Toaster position="top-center" richColors />
        </ThemeProvider>

        <TanStackDevtools
          plugins={[
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
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
