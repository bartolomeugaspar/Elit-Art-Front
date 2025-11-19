# 🔧 Correção de URL da API - Duplicação de /api/

## ❌ Problema
A URL estava sendo duplicada: `/api/api/blog/slug/...`

## ✅ Solução Aplicada

### 1. Arquivo `.env`
```bash
# ❌ ANTES
NEXT_PUBLIC_API_URL=https://elit-arte-back.vercel.app/api/

# ✅ DEPOIS
NEXT_PUBLIC_API_URL=https://elit-arte-back.vercel.app
```

### 2. Arquivo `src/lib/api.ts`
```typescript
// ❌ ANTES
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api/').replace(/\/$/, '');

// ✅ DEPOIS
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app').replace(/\/$/, '');
```

### 3. Arquivo `src/app/blog/[slug]/page.tsx`
```typescript
// ✅ Correto
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const response = await fetch(`${apiUrl}/api/blog/slug/${slug}`)
```

## 🔍 Como Funciona Agora

### Em Desenvolvimento
- `NEXT_PUBLIC_API_URL` = `http://localhost:5000` (do `.env.local`)
- URL final: `http://localhost:5000/api/blog/slug/revista-elit-art-especial` ✅

### Em Produção
- `NEXT_PUBLIC_API_URL` = `https://elit-arte-back.vercel.app`
- URL final: `https://elit-arte-back.vercel.app/api/blog/slug/revista-elit-art-especial` ✅

## 📋 Checklist

- ✅ `.env` sem `/api/` no final
- ✅ `src/lib/api.ts` sem `/api/` no padrão
- ✅ Página de blog usa `${apiUrl}/api/...`
- ✅ Hooks usam `${process.env.NEXT_PUBLIC_API_URL}/...`
- ✅ Sem duplicação de `/api/`

## 🚀 Próximos Passos

1. Reinicie o servidor Next.js: `npm run dev`
2. Teste a página de blog
3. Clique em um artigo para verificar se carrega

## 📝 Nota

Se ainda tiver `.env.local` com valor antigo, ele sobrescreve o `.env`. Verifique se está configurado corretamente.
