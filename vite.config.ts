import { SECURITY_HEADERS } from "@omnidotdev/providers/server";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import mkcert from "vite-plugin-mkcert";
import viteTsConfigPaths from "vite-tsconfig-paths";

/**
 * Vite configuration.
 * @see https://vite.dev/config
 */
const config = defineConfig(({ command }) => ({
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  plugins: [
    devtools(),
    // use `mkcert` in development
    command === "serve" && mkcert(),
    nitroV2Plugin({
      preset: "node-server",
      // Inline srvx to avoid module resolution issues with Bun runtime;
      // inline better-auth so nitro traces its subpath exports (e.g.
      // `@better-auth/utils/random`), which externalizing drops at build time
      externals: { inline: ["srvx", "better-auth", "@better-auth"] },
      routeRules: {
        "/**": {
          headers: {
            ...SECURITY_HEADERS,
            "Permissions-Policy": "geolocation=(), camera=(), microphone=()",
            "Cache-Control": "public, max-age=0, must-revalidate",
          },
        },
      },
    }),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    imagetools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
}));

export default config;
