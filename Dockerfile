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
#ENV VITE_BASE_URL $VITE_BASE_URL
ENV VITE_MOCKBA_API_URL $VITE_MOCKBA_API_URL
# ENV VITE_RECAPTCHA_SITE_KEY $VITE_RECAPTCHA_SITE_KEY

RUN npm run build

# Stage 2: Serve Vue app with Nginx
FROM nginx:1.25.1 as prod-stage
RUN chown -R 101 /etc/nginx; 
USER 101:101
COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY nginx_big.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/build/client /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]