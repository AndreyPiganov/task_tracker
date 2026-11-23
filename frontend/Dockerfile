FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY index.html tsconfig.json vite.config.ts ./
COPY src ./src
RUN npm run build

FROM busybox:1.37
COPY --from=build /app/dist /www
USER 65534:65534
EXPOSE 8080
CMD ["httpd", "-f", "-p", "8080", "-h", "/www"]
