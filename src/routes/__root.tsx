import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { auth } from "@/lib/auth/auth";
import appCss from "@/lib/styles/globals.css?url";
import { seo } from "@/lib/util/seo";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { getThemeServerFn } from "@/server/theme";

import type { QueryClient } from "@tanstack/react-query";
import type { Session, User } from "better-auth";

const fetchSession = createServerFn().handler(async () => {
  const request = getRequest();

  return await auth.api.getSession({ headers: request.headers });
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: { session: Session; user: User } | null;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo(),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  beforeLoad: async () => {
    const session = await fetchSession();

    return { auth: session };
  },
  loader: () => getThemeServerFn(),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
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
        </ThemeProvider>

        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
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
}
