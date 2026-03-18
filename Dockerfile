##############################
# 1. BUILD STAGE
##############################
FROM node:20 AS build
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=4096"
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

##############################
# 2. RUNTIME STAGE (NGINX + NON-ROOT USER)
##############################
FROM nginx:stable-alpine

# Install envsubst (part of gettext) and create non-root user and group
RUN apk add --no-cache gettext && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html/dws

# Copy runtime template & entrypoint and default nginx config.
COPY default.conf /etc/nginx/conf.d/default.conf
COPY env.template.js /usr/share/nginx/html/dws/env.template.js
COPY entrypoint.sh /entrypoint.sh


# Permissions and config hardening in a single layer
RUN rm /etc/nginx/conf.d/default.conf && \
    mkdir -p /var/cache/nginx/pids && \
    chown -R appuser:appgroup /var/cache/nginx /usr/share/nginx/html /var/log/nginx && \
    chmod +x /entrypoint.sh && \
    sed -i 's/user  nginx;/user appuser;/g' /etc/nginx/nginx.conf && \
    sed -i 's|pid        /run/nginx.pid;|pid        /var/cache/nginx/pids/nginx.pid;|g' /etc/nginx/nginx.conf

USER appuser

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
