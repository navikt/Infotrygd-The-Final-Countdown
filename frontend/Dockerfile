# =========================
# Build stage
# =========================
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-dev AS builder

RUN node -e 'const [major, minor, patch] = process.versions.node.split(".").map(Number); if (major !== 24 || minor < 22 || (minor === 22 && patch < 1)) throw new Error("Node.js >=24.22.1 <25 is required (CVE-2026-111497)");'

WORKDIR /app

# Copy dependency files first (better caching)
COPY package.json pnpm-lock.yaml ./
COPY .npmrc ./

# Activate correct pnpm version from package.json
RUN corepack prepare "$(node -p 'require("./package.json").packageManager')" --activate

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build app (Vite)
RUN pnpm build


FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim AS runtime

RUN ["node", "-e", "const [major, minor, patch] = process.versions.node.split('.').map(Number); if (major !== 24 || minor < 22 || (minor === 22 && patch < 1)) throw new Error('Node.js >=24.22.1 <25 is required (CVE-2026-111497)');"]

ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY server.mjs ./

USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["node"]
CMD ["server.mjs"]