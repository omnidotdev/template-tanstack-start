# 🌴 TanStack Start Template

This is a template repository for a frontend web application powered by [TanStack Start](https://tanstack.com/start).

## Features

- 🚀 **Modern React Stack**: Built with [TanStack Start](https://tanstack.com/start) and TypeScript for optimal developer experience and performance
- 🔐 **Authentication & Authorization**:
  - [Better Auth](https://www.better-auth.com) integration with OAuth2/OpenID Connect support
  - JWT-based authentication with remote JWKS validation via [jose](https://github.com/panva/jose)
  - Protected routes with automatic redirects
  - Server-side authentication middleware
- 💳 **Payments & Subscriptions**:
  - [Stripe](https://stripe.com) integration for payment processing
  - Subscription management with billing portal
  - Pricing pages with tier comparison
  - Customer portal for subscription updates and cancellations
- 🎨 **UI/UX**:
  - Modern component library with [Ark UI](https://ark-ui.com) and [shadcn/ui](https://ui.shadcn.com) patterns
  - [Tailwind CSS](https://tailwindcss.com) v4 with optimized class sorting
  - [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) for Tailwind-powered animations
  - Dark/light theme support with persistent preferences
  - Responsive design with mobile-first approach
  - Toast notifications with [Sonner](https://sonner.emilkowal.ski)
  - [Lucide React](https://lucide.dev) and [Simple Icons](https://simpleicons.org) for iconography
- 📱 **Progressive Web App (PWA)**:
  - [Serwist](https://serwist.pages.dev) service worker for offline functionality
  - App installation with native-like experience
  - Automatic updates with user notifications
  - Offline status indicators and caching strategies
  - Web app manifest for app store distribution
  - Background sync and push notification ready
- 📊 **Data Management**:
  - [TanStack Query](https://tanstack.com/query) for server state management
  - [TanStack Table](https://tanstack.com/table) for data visualization
  - GraphQL integration with code generation
  - Type-safe API calls with [GraphQL Request](https://github.com/jasonkuhrt/graphql-request)
  - [Zod](https://zod.dev) for runtime schema validation
- 📈 **GraphQL Integration**:
  - [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) for type-safe queries
  - React Query hooks generation
  - TypeScript SDK generation
  - MSW mocks for testing
- 🧪 **Testing**:
  - Unit tests with [Bun test runner](https://bun.sh/docs/cli/test)
  - [Testing Library](https://testing-library.com) for component testing
  - [Happy DOM](https://github.com/nicholascrm/happy-dom) for fast DOM simulation
  - E2E tests with [Playwright](https://playwright.dev)
  - [MSW (Mock Service Worker)](https://mswjs.io) for API mocking
  - Coverage reporting
- 🛠️ **Developer Experience**:
  - Hot module replacement during development
  - [TanStack Devtools](https://tanstack.com/devtools) for Query, Router, and React debugging
  - Code quality with [Biome](https://biomejs.dev) for linting and formatting
  - Git hooks with [Husky](https://typicode.github.io/husky)
  - TypeScript strict mode with comprehensive type safety
  - [Knip](https://knip.dev) for unused dependency detection
  - Easy spin up with [Tilt](https://tilt.dev)
- 🚢 **Production Ready**:
  - Server-side rendering (SSR) support
  - Environment-specific configurations
  - TLS/HTTPS support with [mkcert](https://github.com/nicholascrm/vite-plugin-mkcert)
  - Optimized build process with Vite
  - Route-based code splitting

## Local Development

First, `cp .env.local.template .env.local` and fill in the values.

### Building and Running

Run `tilt up`, or:

```sh
bun i
```

```sh
bun dev
```

### PWA (Optional Tasks)

#### Generate Icons

Generate PWA icons:

```sh
bun icons:generate
```

#### Audit

Run a comprehensive PWA audit with [Unlighthouse](https://unlighthouse.dev):

```sh
# first, start the dev server
bun dev

# in another terminal, run the audit
bun pwa:audit
```

This crawls the entire site and runs Google Lighthouse audits on each page, providing a dashboard with:

- Performance scores
- Accessibility checks
- Best practices
- SEO analysis
- PWA compliance

## Testing

The project includes a comprehensive test suite with unit tests and E2E tests.

### Unit Tests

```sh
bun test

# or in watch mode
bun test:watch

# or test with coverage reporting
bun test:coverage
```

### E2E Tests

```sh
# first, ensure Playwright browsers are installed
bunx playwright install

# run E2E tests
bun test:e2e

# or run with UI
bun test:e2e:ui
```

Tests use [MSW (Mock Service Worker)](https://mswjs.io) to mock API calls. GraphQL mocks are auto-generated in `src/generated/graphql.mock.ts` via GraphQL Code Generator.

## License

The code in this repository is licensed under MIT, &copy; [Omni LLC](https://omni.dev). See [LICENSE.md](LICENSE.md) for more information.
