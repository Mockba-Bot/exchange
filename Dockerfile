FROM node:20 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .


# move values from [ARG] to [ENV]
#ENV VITE_BASE_URL $VITE_BASE_URL
ENV VITE_API_URL $VITE_API_URL
# ENV VITE_RECAPTCHA_SITE_KEY $VITE_RECAPTCHA_SITE_KEY

RUN npm run build

# Stage 2: Serve Vue app with Nginx
FROM nginx:stable-alpine
# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 8080

# Use the default command to run Nginx in the foreground
# This is necessary to keep the container running
# and to serve the Vue app correctly.
CMD ["nginx", "-g", "daemon off;"]