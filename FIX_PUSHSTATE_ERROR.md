# Fix: Uncaught SyntaxError: redeclaration of let pushState

## Problema
```
Uncaught SyntaxError: redeclaration of let pushState
    <anonymous> http://localhost:3000/blog:1
```

## Causa
Este erro ocorre quando:
1. O Next.js está recompilando em desenvolvimento
2. Há conflito entre versões do código em cache
3. O hot reload não limpou o cache corretamente

## Soluções

### Solução 1: Limpar Cache e Reiniciar (Recomendado)

```bash
# 1. Parar o servidor (Ctrl+C)
# 2. Limpar cache do Next.js
rm -rf .next

# 3. Limpar cache do npm
npm cache clean --force

# 4. Reiniciar o servidor
npm run dev
```

### Solução 2: Limpar Cache do Navegador

1. Abra DevTools (F12)
2. Clique com botão direito no ícone de reload
3. Selecione "Empty cache and hard reload"
4. Ou pressione: **Ctrl+Shift+Delete** (Windows/Linux) ou **Cmd+Shift+Delete** (Mac)

### Solução 3: Limpar Tudo

```bash
# Parar o servidor
# Ctrl+C

# Remover node_modules
rm -rf node_modules

# Remover cache
rm -rf .next

# Reinstalar dependências
npm install

# Reiniciar
npm run dev
```

### Solução 4: Usar Incognito (Teste Rápido)

1. Abra uma aba Incognito/Privada
2. Acesse http://localhost:3000/blog
3. Se funcionar, o problema é cache do navegador

## Quando Ocorre

- ✅ Após fazer alterações no código
- ✅ Ao navegar entre páginas rapidamente
- ✅ Ao recarregar a página (F5)
- ✅ Após reiniciar o servidor

## Prevenção

1. **Não feche o terminal abruptamente** - Use Ctrl+C
2. **Aguarde a compilação terminar** - Veja "compiled successfully" no terminal
3. **Limpe o cache regularmente** - `rm -rf .next` a cada semana
4. **Use hard reload** - Ctrl+Shift+R ao invés de F5

## Checklist de Resolução

- [ ] Parou o servidor com Ctrl+C
- [ ] Removeu a pasta `.next` com `rm -rf .next`
- [ ] Limpou o cache do navegador (Ctrl+Shift+Delete)
- [ ] Reiniciou o servidor com `npm run dev`
- [ ] Aguardou "compiled successfully" no terminal
- [ ] Recarregou a página (Ctrl+Shift+R)
- [ ] Testou em aba Incognito

## Se Ainda Não Funcionar

```bash
# Opção nuclear - limpar tudo
rm -rf node_modules .next
npm install
npm run dev
```

## Referência

- **Next.js Docs**: https://nextjs.org/docs/basic-features/fast-refresh
- **Common Issues**: https://nextjs.org/docs/messages/fast-refresh-reload

## Status

**Última Ocorrência**: 2025-11-19 13:32
**Página Afetada**: `/blog`
**Resolução**: Limpar cache e reiniciar servidor
**Resultado**: ✅ Resolvido / ⏳ Pendente / ❌ Não Resolvido
