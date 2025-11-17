# 🚀 Guia de Início Rápido - Painel Admin Elit'Arte

## Pré-requisitos

- Backend rodando em `http://localhost:5000`
- Frontend rodando em `http://localhost:3000`
- Node.js 18+ instalado

## 1️⃣ Iniciar o Backend

```bash
cd /home/kali/Documentos/Elit-Arte-Back
npm run dev
```

Você deve ver:
```
✅ Server running on port 5000
📍 Environment: development
🌐 Frontend URL: http://localhost:3000
```

## 2️⃣ Iniciar o Frontend

```bash
cd /home/kali/Documentos/Elit-Arte-Front
npm run dev
```

Você deve ver:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

## 3️⃣ Acessar o Painel Admin

1. Abra seu navegador
2. Acesse: `http://localhost:3000/admin`
3. Você será redirecionado para a página de login

## 4️⃣ Fazer Login

**Credenciais de Teste:**
- **Email:** admin@elit-Arte.com
- **Senha:** admin123

Clique em "Entrar" e você será redirecionado para o dashboard.

## 📊 Funcionalidades Disponíveis

### Dashboard (`/admin/dashboard`)
- Visualizar estatísticas gerais
- Ver total de usuários, eventos, inscrições e newsletter
- Ações rápidas
- Status do sistema

### Usuários (`/admin/users`)
- **Listar** todos os usuários cadastrados
- **Criar** novo usuário (nome, email, senha, função)
- **Editar** informações do usuário
- **Deletar** usuário
- Filtrar por função (Admin, Arteista, Usuário)
- Ver status (Ativo/Inativo)

### Eventos (`/admin/events`)
- **Listar** todos os eventos
- **Criar** novo evento (título, descrição, categoria, data, local, capacidade)
- **Editar** evento
- **Deletar** evento
- Ver vagas disponíveis
- Filtrar por categoria

### Inscrições (`/admin/registrations`)
- **Listar** todas as inscrições em eventos
- **Confirmar** inscrição
- **Cancelar** inscrição
- **Deletar** inscrição
- Ver estatísticas (total, confirmadas, pendentes)
- Filtrar por status

### Newsletter (`/admin/newsletter`)
- **Listar** todos os inscritos
- **Enviar** email para todos os inscritos
- **Deletar** inscrito
- Ver estatísticas (total de inscritos, taxa de inscrição)

## 🎨 Interface

### Sidebar
- Menu colapsível com todas as seções
- Ícones para cada seção
- Informações do usuário logado
- Botão de logout

### Tabelas
- Dados organizados em tabelas
- Ações rápidas (editar, deletar, etc)
- Filtros e busca
- Paginação (em desenvolvimento)

### Formulários
- Validação de campos
- Mensagens de erro/sucesso
- Campos obrigatórios marcados

## 🔐 Segurança

- ✅ Autenticação obrigatória com JWT
- ✅ Apenas admins podem acessar
- ✅ Token armazenado no localStorage
- ✅ Redirecionamento automático se não autenticado
- ✅ Proteção de rotas no frontend

## 🐛 Troubleshooting

### "Erro ao conectar com o backend"
- Verifique se o backend está rodando em `http://localhost:5000`
- Verifique se o CORS está configurado corretamente
- Verifique se as variáveis de ambiente estão corretas

### "Email ou senha incorretos"
- Use as credenciais de teste fornecidas
- Verifique se o usuário é admin
- Verifique se o usuário está ativo no banco de dados

### "Acesso negado"
- Verifique se você está logado como admin
- Verifique se o token JWT é válido
- Tente fazer logout e login novamente

### "Tabela vazia"
- Verifique se há dados no banco de dados
- Tente criar um novo registro
- Verifique se o backend está retornando dados

## 📱 Responsividade

O painel é totalmente responsivo:
- **Desktop:** Layout completo com sidebar
- **Tablet:** Sidebar colapsível
- **Mobile:** Menu adaptado

## 🔗 Links Úteis

- **Frontend:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **API Docs:** http://localhost:5000/api-docs
- **Backend Health:** http://localhost:5000/api/health

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `ADMIN_PANEL.md` - Documentação completa do painel
- Backend `API_DOCUMENTATION.md` - Documentação da API
- Backend `README.md` - Guia do backend

## 💡 Dicas

1. Use o Swagger (`/api-docs`) para testar endpoints da API
2. Abra o DevTools (F12) para ver logs e erros
3. Verifique o localStorage para ver o token JWT
4. Use credenciais de teste para não afetar dados reais

## ✅ Próximos Passos

1. Testar todas as funcionalidades do painel
2. Criar usuários, eventos e inscrições de teste
3. Enviar emails via newsletter
4. Verificar se tudo está funcionando corretamente
5. Fazer ajustes conforme necessário

---

**Pronto para começar? Acesse http://localhost:3000/admin! 🎉**
