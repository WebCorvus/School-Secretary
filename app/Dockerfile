FROM node:22.18.0-alpine AS base


FROM base AS deps

WORKDIR /app

COPY package.json ./

RUN npm install


FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . ./

RUN npm run build


FROM base AS runner

RUN apk add --no-cache libc6-compat curl

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/entrypoint.sh /entrypoint.sh

RUN chown -R nextjs:nodejs /app

RUN chmod u+x /entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
