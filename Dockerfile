FROM node:20-slim AS base

ARG VITE_MOCKBA_API_URL
ENV VITE_MOCKBA_API_URL=${VITE_MOCKBA_API_URL}

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
WORKDIR /app

# Copy the package.json and package-lock.json first to leverage Docker cache
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ⬇️ Write the env variable to .env.production so Vite will read it
RUN echo "VITE_MOCKBA_API_URL=$VITE_MOCKBA_API_URL" > .env.production

# Build it
RUN npm run build

FROM base AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build/server ./build/server
COPY --from=builder /app/build/client ./build/client


EXPOSE 3000

# Use the production build of the server
CMD ["npm", "run", "start"]
