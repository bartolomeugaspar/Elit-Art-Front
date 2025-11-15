# 📊 Painel Administrativo Elit'Arte

## Visão Geral

O painel administrativo é uma interface completa para gerenciar todos os aspectos da plataforma Elit'Arte. Ele permite que administradores gerenciem usuários, eventos, inscrições e newsletter.

## 🚀 Acesso

### URL
```
http://localhost:3000/admin
```

### Credenciais de Teste
```
Email: admin@elit-Artee.com
Senha: admin123
```

## 📋 Funcionalidades

### 1. **Dashboard** (`/admin/dashboard`)
- Visão geral com estatísticas principais
- Total de usuários
- Total de eventos
- Total de inscrições
- Total de inscritos na newsletter
- Ações rápidas
- Status do sistema

### 2. **Gerenciamento de Usuários** (`/admin/users`)
- **Listar** todos os usuários cadastrados
- **Criar** novo usuário com:
  - Nome
  - Email
  - Senha
  - Função (Admin, Arteista, Usuário)
- **Editar** informações do usuário
- **Deletar** usuário
- Visualizar status (Ativo/Inativo)
- Visualizar data de criação

### 3. **Gerenciamento de Eventos** (`/admin/events`)
- **Listar** todos os eventos
- **Criar** novo evento com:
  - Título
  - Descrição
  - Categoria
  - Data e hora
  - Local
  - Capacidade
- **Editar** evento
- **Deletar** evento
- Visualizar vagas disponíveis
- Visualizar capacidade total

### 4. **Gerenciamento de Inscrições** (`/admin/registrations`)
- **Listar** todas as inscrições em eventos
- **Atualizar status** da inscrição:
  - Confirmada (✓)
  - Pendente (⏳)
  - Cancelada (✗)
- **Deletar** inscrição
- Visualizar estatísticas:
  - Total de inscrições
  - Inscrições confirmadas
  - Inscrições pendentes
- Filtrar por status

### 5. **Gerenciamento de Newsletter** (`/admin/newsletter`)
- **Listar** todos os inscritos na newsletter
- **Enviar** email para todos os inscritos com:
  - Assunto customizável
  - Mensagem customizável
- **Deletar** inscrito
- Visualizar estatísticas:
  - Total de inscritos
  - Taxa de inscrição

## 🎨 Interface

### Layout
- **Sidebar** colapsível com menu de navegação
- **Header** com título da página atual
- **Conteúdo principal** responsivo
- **Tema escuro** com cores roxas e brancas

### Componentes
- Tabelas com dados
- Formulários para criação/edição
- CArteões de estatísticas
- Botões de ação
- Ícones do Lucide React

## 🔐 Segurança

- ✅ Autenticação obrigatória
- ✅ Apenas administradores podem acessar
- ✅ Token JWT armazenado no localStorage
- ✅ Redirecionamento automático para login se não autenticado
- ✅ Proteção de rotas

## 📱 Responsividade

O painel é totalmente responsivo:
- Desktop: Layout completo com sidebar
- Tablet: Sidebar colapsível
- Mobile: Menu adaptado

## 🛠️ Estrutura de Arquivos

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx           # Layout raiz do admin
│       ├── page.tsx             # Redirecionamento para login
│       ├── login/
│       │   └── page.tsx         # Página de login
│       ├── dashboard/
│       │   └── page.tsx         # Dashboard principal
│       ├── users/
│       │   └── page.tsx         # Gerenciamento de usuários
│       ├── events/
│       │   └── page.tsx         # Gerenciamento de eventos
│       ├── registrations/
│       │   └── page.tsx         # Gerenciamento de inscrições
│       └── newsletter/
│           └── page.tsx         # Gerenciamento de newsletter
├── components/
│   └── AdminLayout.tsx          # Layout com sidebar
└── hooks/
    └── useAuth.ts              # Hook de autenticação
```

## 🔄 Fluxo de Autenticação

1. Usuário acessa `/admin`
2. Redirecionado para `/admin/login`
3. Insere email e senha
4. Sistema valida credenciais
5. Se admin: redireciona para `/admin/dashboard`
6. Se não admin: exibe erro
7. Token armazenado no localStorage
8. Todas as requisições incluem o token no header

## 📡 Integração com API

Todas as requisições para o backend incluem:
```
Authorization: Bearer {token}
```

### Endpoints Utilizados

- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Verificar autenticação
- `GET /api/users` - Listar usuários
- `POST /api/auth/register` - Criar usuário
- `DELETE /api/users/{id}` - Deletar usuário
- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento
- `DELETE /api/events/{id}` - Deletar evento
- `GET /api/registrations` - Listar inscrições
- `PATCH /api/registrations/{id}` - Atualizar inscrição
- `DELETE /api/registrations/{id}` - Deletar inscrição
- `GET /api/newsletter` - Listar inscritos
- `POST /api/newsletter/send` - Enviar email
- `DELETE /api/newsletter/{id}` - Deletar inscrito

## 🎯 Próximos Passos

- [ ] Edição de usuários
- [ ] Edição de eventos
- [ ] Filtros avançados
- [ ] Paginação
- [ ] Exportação de dados (CSV/PDF)
- [ ] Gráficos e relatórios
- [ ] Auditoria de ações
- [ ] Backup automático

## 📞 Suporte

Para problemas ou dúvidas sobre o painel admin, verifique:
1. Se o backend está rodando na porta 5000
2. Se as credenciais estão corretas
3. Se o token JWT é válido
4. Se o usuário tem role 'admin'
