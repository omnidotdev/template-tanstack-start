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

import { Footer, Header } from "@/components/layout";
import auth from "@/lib/auth/auth";
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

const RootComponent = () => (
  <RootDocument>
    <Outlet />
  </RootDocument>
);

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
      ...createMetaTags(),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  loader: () => getThemeServerFn(),
  component: RootComponent,
});

const RootDocument = ({ children }: PropsWithChildren) => {
  const theme = Route.useLoaderData();

  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <Header />

          <div className="relative flex h-dvh w-full flex-col gap-0 pl-[calc(100vw-100%)]">
            <main className="mt-[66px] flex-1">{children}</main>

            <Footer />
          </div>

          <Toaster position="top-center" richColors />
        </ThemeProvider>

        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
              defaultOpen: true,
            },
            {
              name: "Tanstack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
};

export default RootDocument;
