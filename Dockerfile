########################################
# build stage
########################################
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build          # -> remix build

########################################
# runtime stage – Node only
########################################
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app ./

ENV NODE_ENV=production
EXPOSE 3000                # remix-serve listens on 3000 by default
CMD ["npm","run","start"]  # this runs: remix-serve build
