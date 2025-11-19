# 🔧 Como Resetar o .env.local

## ⚠️ Problema
O arquivo `.env.local` (que está em `.gitignore`) ainda tem a configuração antiga com `/api/` duplicado.

## ✅ Solução

### Opção 1: Deletar o arquivo (Recomendado)
```bash
rm .env.local
```

Depois reinicie o servidor:
```bash
npm run dev
```

O Next.js vai usar o `.env` automaticamente.

### Opção 2: Editar manualmente
Abra `.env.local` e mude para:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Depois reinicie:
```bash
npm run dev
```

## 🔍 Verificar qual está sendo usado

Abra o DevTools (F12) → Console e execute:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```

Deve mostrar: `http://localhost:5000`

## 📝 Nota

- `.env` - Versionado no git (público)
- `.env.local` - NÃO versionado (local, privado)

Se `.env.local` existe, ele sobrescreve o `.env`.

## 🚀 Após resetar

1. Delete o cache: `rm -rf .next`
2. Reinicie: `npm run dev`
3. Teste a página de blog novamente
