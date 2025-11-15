#!/bin/bash

# Diretório base do projeto
BASE_DIR="/home/kali/Documentos/Elit-Arte-Front/src/app/admin"

# Criar backup dos arquivos atuais
echo "Criando backup dos arquivos atuais..."
mkdir -p "$BASE_DIR/backup"
cp "$BASE_DIR/dashboard/page.tsx" "$BASE_DIR/backup/dashboard-page.tsx.bak"
cp "$BASE_DIR/events/page.tsx" "$BASE_DIR/backup/events-page.tsx.bak"
cp "$BASE_DIR/users/page.tsx" "$BASE_DIR/backup/users-page.tsx.bak"
cp "$BASE_DIR/newsletter/page.tsx" "$BASE_DIR/backup/newsletter-page.tsx.bak"

# Remover arquivos antigos
echo "Removendo arquivos antigos..."
rm -f "$BASE_DIR/dashboard/page.tsx"
rm -f "$BASE_DIR/events/page.tsx"
rm -f "$BASE_DIR/users/page.tsx"
rm -f "$BASE_DIR/newsletter/page.tsx"

# Mover novos arquivos para os locais corretos
echo "Movendo novos arquivos..."
mv "$BASE_DIR/new-dashboard.tsx" "$BASE_DIR/dashboard/page.tsx"
mv "$BASE_DIR/new-events.tsx" "$BASE_DIR/events/page.tsx"
mv "$BASE_DIR/new-users.tsx" "$BASE_DIR/users/page.tsx"
mv "$BASE_DIR/new-newsletter.tsx" "$BASE_DIR/newsletter/page.tsx"

# Remover arquivos temporários
echo "Limpando arquivos temporários..."
rm -f "$BASE_DIR/new-layout.tsx"

echo "Atualização concluída com sucesso!"
echo "Backups disponíveis em: $BASE_DIR/backup/"
