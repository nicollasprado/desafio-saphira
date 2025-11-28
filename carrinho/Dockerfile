FROM node:20-slim AS builder

WORKDIR /app

RUN corepack enable

COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
COPY ./prisma ./prisma

RUN pnpm install

COPY . .

RUN pnpm dlx prisma generate

RUN pnpm build



FROM node:20-slim AS runner

WORKDIR /app

RUN corepack enable

RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.production ./.env

ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "start"]