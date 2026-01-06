import { defaultCache } from "@serwist/vite/worker";
import { Serwist } from "serwist";

import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";

// Declares the injection point for the precache manifest.
// @serwist/vite replaces this with the list of assets to cache at build time.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  // Assets to precache, injected at build time by @serwist/vite
  precacheEntries: self.__SW_MANIFEST,

  // skipWaiting: Activate new SW immediately instead of waiting for all tabs to close.
  // Combined with clientsClaim, this ensures updates take effect on next navigation.
  skipWaiting: true,

  // clientsClaim: Take control of all clients (tabs) immediately on activation.
  // Without this, the new SW wouldn't control existing tabs until they're reloaded.
  clientsClaim: true,

  // navigationPreload: Enables Navigation Preload API for faster navigations.
  // Allows the browser to start fetching the page while the SW is booting up.
  navigationPreload: true,

  // runtimeCaching: Strategies for caching requests not in the precache manifest.
  // defaultCache includes sensible defaults for fonts, images, scripts, etc.
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
