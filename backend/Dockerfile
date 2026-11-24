FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl python3 make g++
COPY package*.json ./
RUN npm ci --no-audit --no-fund

FROM base AS migrate
RUN mkdir -p /app/data && chown node:node /app/data
COPY prisma.config.ts ./
COPY prisma ./prisma
CMD ["sh", "-c", "touch /app/data/tasks.db && exec npm run db:migrate"]

FROM migrate AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev --no-audit --no-fund

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN mkdir -p /app/data && chown node:node /app/data
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
