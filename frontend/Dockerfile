# =========================
# Build stage
# =========================
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-dev AS builder

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


# =========================
# Runtime stage (Chainguard nginx)
# =========================
FROM cgr.dev/chainguard/nginx:latest

# Copy built static assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Set custom nginx config  
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080