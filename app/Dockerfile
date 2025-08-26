FROM node:22.18.0 AS base

FROM base AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN npm prune --production


FROM base AS production

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public

RUN npm install --only=production

EXPOSE 3000