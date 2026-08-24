import { NotFoundPage } from "@omnidotdev/thornberry/not-found";

import app from "@/lib/config/app.config";

/**
 * 404 not found. Renders the shared Omni `<NotFoundPage>` (in-shell,
 * theme-aware, prominent "404", a way home) branded with this app's identity.
 *
 * ! TODO: when scaffolding a real app, pass the product's logomark via `appLogo`
 * ! (the same asset the Header uses, e.g. `<img src="/img/logo.svg" alt="" />`),
 * ! so the 404 carries the product mark. Omit it to brand with the wordmark alone.
 */
const NotFound = () => <NotFoundPage appName={app.name} />;

export default NotFound;
