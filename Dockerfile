# Base layer using a lightweight Node.js 20 image
FROM node:20-slim AS base

# Dependencies layer: installs all dependencies (including devDependencies)
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Production dependencies layer:
# Copies only the needed dependencies and prunes devDependencies
FROM base AS production-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm prune --omit=dev

# Build layer: compiles the Remix app using only production dependencies
FROM base AS builder
WORKDIR /app
COPY --from=production-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Final runtime layer: minimal and clean
FROM base AS runtime
WORKDIR /app

# Copy only necessary files for running the app
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build/server ./build/server
COPY --from=builder /app/build/client ./build/client

# Expose the port Remix uses by default
EXPOSE 3000

# Start the Remix app (runs the production server)
CMD ["npm", "run", "start"]
