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

# Copia os arquivos do projeto
COPY . .

# Instala dependências completas (inclui dev)
RUN npm ci

# Compila o projeto (server.ts + worker.ts)
RUN npm run build

# Gera Prisma Client com base no novo caminho
RUN npx prisma generate --schema=src/infrastructure/database/schema.prisma

# ---------------------------
# Runner final (produção)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Cria usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 api && \
    chown api:nodejs .

# Copia node_modules de produção
COPY --from=deps /app/node_modules ./node_modules

# Copia a build (inclui server.js e worker.js)
COPY --from=build /app/build ./build

# Copia apenas a pasta do Prisma (schema, migrations, etc.)
COPY --from=build /app/src/infrastructure/database ./src/infrastructure/database

# Copia arquivos adicionais com permissões corretas
COPY --chown=api:nodejs . .

# Copia os scripts de entrada
COPY ./migrate.sh .
COPY ./worker.sh .
RUN chmod +x ./migrate.sh ./worker.sh

# Define usuário não-root
USER api

# Expõe porta da API
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# ENTRYPOINT padrão (API)
ENTRYPOINT ["./migrate.sh"]
