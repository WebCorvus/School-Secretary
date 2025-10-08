FROM node:22.18.0-alpine AS base


FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


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

RUN mkdir -p .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/entrypoint.sh /entrypoint.sh

RUN chmod u+x /entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
