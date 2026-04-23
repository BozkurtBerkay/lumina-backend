# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----
FROM deps AS build
COPY tsconfig.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src ./src
RUN npx prisma generate
RUN npm run build
RUN cp -R src/generated dist/generated

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production

# Sadece production dependency'leri kur
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Build çıktılarını kopyala
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
