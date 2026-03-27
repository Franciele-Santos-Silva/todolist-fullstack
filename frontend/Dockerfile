# Multi-stage build for Vite + React + Nginx
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
# Copy Vite build output (dist/)
COPY --from=build /app/build /usr/share/nginx/html
# Copy custom nginx.conf if needed for proxy
# Nginx config copiado (nginx.conf criado na raiz frontend)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
