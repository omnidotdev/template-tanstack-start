# syntax=docker/dockerfile:1@sha256:4edf897a3ffa55b89f906fc8cc78afdb3f1834cc9c7083565e611a8a7d5fe99e

FROM oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
# Skip puppeteer's chrome-headless-shell download (pulled in by @unlighthouse/cli devDep)
# The base image lacks tar/unzip; we don't run puppeteer in this image anyway
ENV PUPPETEER_SKIP_DOWNLOAD=true
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
# Bust the COPY cache per commit. The Fractal operator always builds
# --cache-from <name>:buildcache and injects GIT_SHA; importing that registry
# cache can false-hit "COPY . ." so a new commit reuses a stale source layer and
# ships old code. Consuming GIT_SHA before the copy forces a re-copy every commit
ARG GIT_SHA=unknown
RUN echo "source-cache-bust ${GIT_SHA}"
COPY . .
RUN bun run build

# TODO: Switch back to Bun runtime once module resolution is fixed
# Bun doesn't properly resolve externalized Nitro packages (srvx, react-dom/server)
# Error: Cannot find package 'srvx' from '/app/.output/server/chunks/virtual/entry.mjs'
# Error: Cannot find module 'react-dom/server'
FROM node:22-alpine@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402 AS runner
WORKDIR /app
ENV NODE_ENV=production
# Bake the built commit so the running commit is observable and a stale build is
# detectable (compare BUILD_SHA against the expected commit)
ARG GIT_SHA=unknown
ENV BUILD_SHA=${GIT_SHA}

# Nitro bundles production deps into .output/server/node_modules.
COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
