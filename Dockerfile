# Base image
FROM node:20-slim AS base

# Step 1: Install all dependencies including devDependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Step 2: Build the Remix app with all dependencies available
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Step 3: Prepare only production dependencies for runtime
FROM base AS production-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm prune --omit=dev

# Step 4: Final runtime container
FROM base AS runtime
WORKDIR /app

# Use pruned production-only dependencies
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build/server ./build/server
COPY --from=builder /app/build/client ./build/client

EXPOSE 3000

CMD ["npm", "run", "start"]
