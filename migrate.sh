#!/bin/sh
until npx prisma migrate deploy --schema=./prisma/schema.prisma; do
  echo "Banco indisponível, tentando novamente em 3s..."
  sleep 3
done

echo "✅ Migrations aplicadas com sucesso!"
echo "🚀 Iniciando aplicação..."
npm run start
