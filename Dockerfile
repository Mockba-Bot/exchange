FROM node:20 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# setup [ARG] to catch values from workflow
#ARG VITE_BASE_URL
# ARG VITE_API_URL
# ARG VITE_RECAPTCHA_SITE_KEY

# move values from [ARG] to [ENV]
#ENV VITE_BASE_URL=$VITE_BASE_URL
ARG VITE_MOCKBA_API_URL
ENV VITE_MOCKBA_API_URL=${VITE_MOCKBA_API_URL}
# ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY

RUN npm run build

# Stage 2: Serve Vue app with Nginx
FROM nginx:1.25.1
# --- still root here ---
RUN mkdir -p /var/cache/nginx/client_temp \
    && chown -R 101:101 /var/cache/nginx /var/run /var/log/nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf   # without "user" directive
COPY --from=build /app/dist /usr/share/nginx/html

USER 101:101
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]