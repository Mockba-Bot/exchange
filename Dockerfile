FROM node:20-slim AS base

ARG VITE_MOCKBA_API_URL
ENV VITE_MOCKBA_API_URL=${VITE_MOCKBA_API_URL}

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 👇 Pass it inline so Vite sees it
RUN VITE_MOCKBA_API_URL=$VITE_MOCKBA_API_URL npm run build

FROM base AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build/server ./build/server
COPY --from=builder /app/build/client ./build/client

EXPOSE 3000
CMD ["npm", "run", "start"]
