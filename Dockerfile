# ---------------------------
# Base image
FROM node:lts-slim AS base

# Instala dependências básicas, como o OpenSSL necessário pro Prisma
RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# ---------------------------
# Dependências (prod)
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------------------------
# Build da aplicação e geração do Prisma Client
FROM base AS build
WORKDIR /app

# Copia os arquivos do projeto (inclusive prisma)
COPY prisma ./prisma/
COPY . .

# Instala todas as dependências (inclui as de dev para build e generate)
RUN npm ci

# Compila o projeto (assume que gera build/ com server.js)
RUN npm run build

# Gera Prisma Client com engines nativos corretos
RUN npx prisma generate

# ---------------------------
# Runner final (produção)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Cria usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 api && \
    chown api:nodejs .

# Copia node_modules de prod
COPY --from=deps /app/node_modules ./node_modules

# Copia a pasta de build da aplicação
COPY --from=build /app/build ./build

# Copia a pasta prisma (schema, migrations, etc)
COPY --from=build /app/prisma ./prisma

# 📌 COPIA O CLIENT DO PRISMA GERADO!
COPY --from=build /app/src/generated/prisma /app/src/generated/prisma

# Copia outros arquivos (ex: .env, package.json) com as permissões corretas
COPY --chown=api:nodejs . .

# Define usuário não-root
USER api

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["npm", "run", "start"]
