# Base image
FROM node:20-slim AS base

# Accept API URL at build time
ARG VITE_MOCKBA_API_URL
ENV VITE_MOCKBA_API_URL=${VITE_MOCKBA_API_URL}

# Dependencies layer: install all deps (dev + prod)
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Build layer: compile the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runtime layer: run the server with full node_modules
FROM base AS runtime
WORKDIR /app

# ⛔ We're not using pruned deps; this avoids "buffer-polyfill not found" errors
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build/server ./build/server
COPY --from=builder /app/build/client ./build/client

EXPOSE 3000

CMD ["npm", "run", "start"]
