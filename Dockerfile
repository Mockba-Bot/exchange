# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:20-slim AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# TODO fix: use this layer will cause "Cannot find package buffer-polyfill"
# Setup production node_modules
# FROM base as production-deps
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY package.json package-lock.json ./
# RUN npm prune --omit=dev

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
ARG VITE_MOCKBA_API_URL
ENV VITE_MOCKBA_API_URL=$VITE_MOCKBA_API_URL
RUN npm run build

FROM base AS runtime
WORKDIR /app

# COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build/server ./build/server
COPY --from=builder /app/build/client ./build/client


ENV NODE_ENV=production

EXPOSE 3010

CMD ["npm", "run","start"]