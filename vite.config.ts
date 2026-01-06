import { serwist } from "@serwist/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
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
    nitroV2Plugin({ preset: "node-server" }),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
    }),
  ],
}));

export default config;
