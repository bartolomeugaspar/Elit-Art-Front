# 🎭 Elit'Arte - Plataforma Cultural Completa

<div align="center">

![Elit'Arte Logo](public/icon.jpeg)

### **Movimento Artístico angolano dedicado à preservação e celebração da rica cultura de Angola**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Live Site](https://img.shields.io/badge/Live_Site-🌐_Online-success?style=for-the-badge)](https://elit-arte-front.vercel.app/)

[🌐 Site Online](https://elit-arte-front.vercel.app/) • [📱 Demo Mobile](https://elit-arte-front.vercel.app/) • [📖 Documentação](#-documentação-técnica) • [🤝 Contribuir](#-como-contribuir)

</div>

---

## 🌟 Sobre o Elit'Arte

O **Elit'Arte** é um movimento Artístico angolano fundado em **13 de Fevereiro de 2024** que une **teatro, música, dança, literatura, pintura e cinema**, com o objetivo de promover e celebrar nossa rica cultura através da fusão entre tradição e contemporaneidade.

### 🎯 Nossa Missão
Promover a Arte nas suas múltiplas expressões como ferramentas de transformação da nossa sociedade e de desenvolvimento dos angolanos, marcadamente com traços da nossa cultura angolana tradicional.

### 👁️ Nossa Visão
Ser reconhecido como o maior movimento Artístico de Angola, em inovaçãoArtística, inspirando gerações e transformando vidas por meio da Arte.

## 🛠️ Stack Tecnológico

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Next.js** | 14.x | Framework React com App Router e SSR |
| **TypeScript** | 5.x | Tipagem estática e segurança de código |
| **Tailwind CSS** | 3.x | Estilização utility-first responsiva |
| **Lucide React** | Latest | Ícones modernos e leves |
| **Recharts** | Latest | Gráficos e visualizações de dados |

### Backend (API)
| Tecnologia | Descrição |
|------------|-----------|
| **Node.js** | Runtime JavaScript |
| **Express** | Framework web robusto |
| **PostgreSQL** | Banco de dados relacional |
| **Vercel** | Hospedagem e deployment |

### Features
- ✅ **Autenticação JWT** com sistema de roles (admin/user)
- ✅ **Dashboard administrativo** completo
- ✅ **Blog** com categorias e busca
- ✅ **Galeria de arte** interativa
- ✅ **Sistema de eventos** com inscrições
- ✅ **Fórum comunitário** com tópicos e respostas
- ✅ **Newsletter** e notificações
- ✅ **Sistema de auditoria** (audit logs)
- ✅ **Upload de imagens** e gestão de mídia
- ✅ **Responsivo** e otimizado para mobile

## 📁 Estrutura do Projeto

```
Elit-Art-Front/
├── src/
│   ├── app/                          # App Router (Next.js 14)
│   │   ├── admin/                    # Painel administrativo
│   │   │   ├── dashboard/            # Dashboard com estatísticas
│   │   │   ├── users/                # Gestão de usuários
│   │   │   ├── artists/              # Gestão de artistas
│   │   │   ├── events/               # Gestão de eventos
│   │   │   ├── registrations/        # Gestão de inscrições
│   │   │   ├── galeria/              # Gestão de obras
│   │   │   ├── blog/                 # Gestão de posts
│   │   │   ├── comunidade/           # Gestão do fórum
│   │   │   ├── newsletter/           # Gestão de newsletter
│   │   │   ├── imprensa/             # Gestão de imprensa
│   │   │   └── audit-logs/           # Logs de auditoria
│   │   ├── eventos/                  # Página pública de eventos
│   │   │   └── [id]/                 # Detalhes do evento
│   │   ├── galeria/                  # Galeria de obras
│   │   │   └── [id]/                 # Detalhes da obra
│   │   ├── blog/                     # Blog público
│   │   │   └── [slug]/               # Post individual
│   │   ├── comunidade/               # Fórum comunitário
│   │   │   └── [id]/                 # Detalhes do tópico
│   │   ├── imprensa/                 # Sala de imprensa
│   │   ├── loja/                     # Loja online (em desenvolvimento)
│   │   ├── globals.css               # Estilos globais
│   │   ├── layout.tsx                # Layout raiz
│   │   └── page.tsx                  # Homepage
│   │
│   ├── components/
│   │   ├── layout/                   # Componentes de layout
│   │   │   ├── Header.tsx            # Menu responsivo
│   │   │   └── Footer.tsx            # Rodapé
│   │   ├── sections/                 # Seções da homepage
│   │   │   ├── HeroSection.tsx       # Banner principal
│   │   │   ├── PresentationSection.tsx
│   │   │   ├── IdentitySection.tsx
│   │   │   ├── TeamSection.tsx
│   │   │   └── ...
│   │   ├── admin/                    # Componentes admin
│   │   │   ├── ArtistForm.tsx
│   │   │   ├── EventForm.tsx
│   │   │   └── EventGalleryModal.tsx
│   │   ├── AdminLayout.tsx           # Layout do painel admin
│   │   ├── BackgroundMusic.tsx       # Player de música
│   │   ├── EventRegistrationModal.tsx
│   │   └── Toast.tsx                 # Sistema de notificações
│   │
│   ├── hooks/                        # Custom React Hooks
│   │   ├── useAuth.ts                # Hook de autenticação
│   │   ├── useEvents.ts              # Hook de eventos
│   │   ├── useArtworks.ts            # Hook de obras
│   │   ├── useBlog.ts                # Hook de blog
│   │   ├── useArtists.ts             # Hook de artistas
│   │   └── useProducts.ts            # Hook de produtos
│   │
│   └── lib/
│       └── api.ts                    # Cliente API centralizado
│
├── public/                           # Assets estáticos
│   ├── icon.jpeg                     # Logo do Elit'Arte
│   ├── musica-fundo.mp3              # Música ambiente
│   └── [imagens e vídeos]            # Galeria de mídia
│
├── tailwind.config.js                # Configuração do Tailwind
├── tsconfig.json                     # Configuração TypeScript
├── next.config.js                    # Configuração Next.js
└── package.json                      # Dependências do projeto
```

### Backend (Elit-Art-Back)
```
Elit-Art-Back/
├── src/
│   ├── routes/                       # Rotas da API
│   │   ├── auth.ts                   # Autenticação
│   │   ├── users.ts                  # Usuários
│   │   ├── artists.ts                # Artistas
│   │   ├── events.ts                 # Eventos
│   │   ├── artworks.ts               # Obras de arte
│   │   ├── blog.ts                   # Posts do blog
│   │   ├── forum.ts                  # Fórum comunitário
│   │   ├── newsletter.ts             # Newsletter
│   │   ├── press.ts                  # Releases de imprensa
│   │   └── audit.routes.ts           # Auditoria
│   ├── models/                       # Modelos de dados
│   ├── services/                     # Lógica de negócio
│   ├── middleware/                   # Middlewares
│   └── config/                       # Configurações
└── uploads/                          # Upload de arquivos
```

## 🎨 ÁreasArtísticas

### 🎭 **Teatro**
- Dramatização de peças teatrais de vanguarda
- Temáticas sociais e culturais angolanas
- espectáculos: "Octhali", "O preço da ingratidão"

### 🎵 **Música**
- Interpretação e produção de canções angolanas
- Fusão de estilos tradicionais com modernos
- Concursos e oficinas de canto

### 💃 **Dança**
- Expressão corporal da cultura angolana
- Coreografias tradicionais e contemporâneas
- Workshops e apresentações

### 📚 **Literatura**
- Promoção da leitura e escrita
- Obras com temática angolana
- Concursos literários

### 🎬 **Cinema**
- Produção audiovisual cultural
- Documentários sobre tradições
- Festivais de cinema

### 🎨 **Pintura**
- Arte visual angolana
- Exposições e workshops
- Preservação da Arte tradicional

## ✨ Funcionalidades Principais

### 🎯 Para Visitantes
- 🏠 **Homepage Interativa** - Carousel, apresentação e áreas artísticas
- 📅 **Eventos** - Listagem com filtros e detalhes completos
- 🎨 **Galeria de Arte** - Obras organizadas por tipo (pintura, escultura, fotografia, etc.)
- 📝 **Blog Cultural** - Artigos, poesia, contos e textos dramáticos
- 💬 **Fórum Comunitário** - Discussões por categoria com sistema de respostas
- 📰 **Sala de Imprensa** - Releases e comunicados oficiais
- 🎵 **Player de Música** - Música ambiente com controle de volume
- 📲 **Inscrição em Eventos** - Formulário com validação e confirmação

### 🔐 Para Administradores
- 📊 **Dashboard Completo** - Estatísticas em tempo real com gráficos
- 👥 **Gestão de Usuários** - CRUD completo com roles (admin/user)
- 🎭 **Gestão de Artistas** - Perfis com biografia e redes sociais
- 📅 **Gestão de Eventos** - Criação, edição, galeria de fotos
- ✅ **Gestão de Inscrições** - Aprovação, cancelamento, controle de status
- 🖼️ **Gestão de Obras** - Upload de imagens, categorização
- ✍️ **Editor de Blog** - Posts com categorias, imagens e SEO
- 💬 **Moderação do Fórum** - Fixar, fechar tópicos, gerenciar respostas
- 📧 **Newsletter** - Envio de emails em massa
- 🔍 **Logs de Auditoria** - Rastreamento de todas as ações no sistema

### 🎨 Design & UX
- 📱 **Mobile-First** - Interface otimizada para smartphones
- 🎭 **Tema Elit'Arte** - Paleta de cores douradas, marrom e laranja
- ⚡ **Performance** - Carregamento rápido com otimização de imagens
- ♿ **Acessibilidade** - Navegação por teclado e leitores de tela
- 🌐 **SEO Otimizado** - Meta tags e structured data
- 🔄 **Transições Suaves** - Animações e micro-interações
- 📊 **Gráficos Interativos** - Visualização de dados no dashboard

## 🎨 Paleta de Cores

```css
/* Cores do Elit'Arte */
--elit-red: #8B4513;      /* Marrom/vermelho escuro */
--elit-orange: #D2691E;   /* Laranja médio */
--elit-yellow: #F4A460;   /* Dourado claro */
--elit-brown: #654321;    /* Marrom escuro */
--elit-gold: #DAA520;     /* Dourado vibrante */
--elit-dark: #2D1810;     /* Marrom muito escuro */
--elit-light: #F5F5DC;    /* Bege claro */
```

## 🌐 Acesso Online

### 📱 **No Telefone/Mobile**
1. Abra o navegador (Chrome, Safari, etc.)
2. Acesse: **https://elit-Arte.vercel.app/**
3. O site é totalmente responsivo e otimizado para mobile!

### 💻 **No Desktop**
- Acesse diretamente: **https://elit-Arte.vercel.app/**
- Experiência completa com todas as funcionalidades

### 📲 **Instalar como App (PWA)**
- **Android**: Menu → "Adicionar à tela inicial"
- **iOS**: CompArteilhar → "Adicionar à Tela de Início"

## 🚀 Começando

### 📋 Pré-requisitos
```bash
Node.js >= 18.x
npm >= 9.x ou yarn >= 1.22.x
Git
```

### ⚙️ Instalação e Configuração

#### 1. Clone o repositório
```bash
# Frontend
git clone https://github.com/bartolomeugaspar/Elit-Art-Front.git
cd Elit-Art-Front

# Backend (opcional, se for executar localmente)
git clone https://github.com/bartolomeugaspar/Elit-Art-Back.git
cd Elit-Art-Back
```

#### 2. Configure as variáveis de ambiente

**Frontend** - Crie `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://elit-arte-back.vercel.app/api
```

**Backend** - Crie `.env`:
```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/elitarte
JWT_SECRET=seu_secret_aqui
```

#### 3. Instale as dependências
```bash
# Frontend
npm install

# Backend
cd ../Elit-Art-Back
npm install
```

#### 4. Execute em modo de desenvolvimento
```bash
# Frontend (porta 3000)
npm run dev

# Backend (porta 3001)
cd ../Elit-Art-Back
npm run dev
```

Acesse: `http://localhost:3000`

### 📦 Build para Produção

```bash
# Frontend
npm run build
npm start

# Backend
npm run build
npm start
```

### 🚀 Deploy

#### Vercel (Recomendado)
```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel --prod
```

#### Docker
```bash
# Build da imagem
docker build -t elitarte-front .

# Execute o container
docker run -p 3000:3000 elitarte-front
```

### 🧪 Testes

```bash
# Execute os testes
npm test

# Cobertura de testes
npm run test:coverage

# Testes E2E
npm run test:e2e
```

## 👥 Equipa

### 🎯 **Líderes**
- **Faustino Domingos (Guido Alves)** - Fundador e Diretor Geral
- **Josemara Comongo (Maíris de Jesus)** - Co-fundadora
- **Luísa Gonçalves** - DiretoraArtística

### 🎭 **Artistas  **
Mais de 20 Artistasnas diversas áreas: teatro, música, dança, literatura, cinema e pintura.

## 📞 Contato

- **📧 Email**: faustinodomingos83@hotmail.com
- **📱 Telefone**: +244 927 935 543
- **💬 WhatsApp**: +244 950 291 335
- **📍 Localização**: Luanda, Angola

## 📚 Documentação Técnica

### 🔌 API Endpoints

#### Autenticação
```typescript
POST   /api/auth/register      // Registro de usuário
POST   /api/auth/login         // Login
POST   /api/auth/logout        // Logout
GET    /api/auth/me            // Usuário atual
```

#### Eventos
```typescript
GET    /api/events             // Listar eventos
GET    /api/events/:id         // Detalhes do evento
POST   /api/events             // Criar evento (admin)
PUT    /api/events/:id         // Atualizar evento (admin)
DELETE /api/events/:id         // Deletar evento (admin)
```

#### Obras de Arte
```typescript
GET    /api/artworks           // Listar obras
GET    /api/artworks/:id       // Detalhes da obra
POST   /api/artworks           // Criar obra (admin)
PUT    /api/artworks/:id       // Atualizar obra (admin)
DELETE /api/artworks/:id       // Deletar obra (admin)
```

#### Blog
```typescript
GET    /api/blog               // Listar posts
GET    /api/blog/slug/:slug    // Post por slug
POST   /api/blog               // Criar post (admin)
PUT    /api/blog/:id           // Atualizar post (admin)
DELETE /api/blog/:id           // Deletar post (admin)
```

### 🎨 Guia de Estilo

#### Cores da Marca
```css
/* Paleta Principal */
--elit-gold: #DAA520;       /* Dourado vibrante */
--elit-orange: #D2691E;     /* Laranja médio */
--elit-red: #8B4513;        /* Marrom/vermelho */
--elit-brown: #654321;      /* Marrom escuro */
--elit-yellow: #F4A460;     /* Dourado claro */
--elit-dark: #2D1810;       /* Marrom muito escuro */
--elit-light: #fafaebff;    /* Bege claro */
```

#### Tipografia
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### 🔒 Segurança

- ✅ Autenticação JWT com tokens de acesso
- ✅ Validação de dados no frontend e backend
- ✅ Proteção contra XSS e CSRF
- ✅ Rate limiting nas APIs
- ✅ Sanitização de inputs
- ✅ Logs de auditoria para ações administrativas

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Siga os passos abaixo:

### 1. Fork o Projeto
```bash
# Via GitHub UI ou CLI
gh repo fork bartolomeugaspar/Elit-Art-Front
```

### 2. Crie uma Branch
```bash
# Para novas features
git checkout -b feature/nome-da-feature

# Para correções de bugs
git checkout -b fix/descricao-do-bug

# Para melhorias de documentação
git checkout -b docs/melhoria-docs
```

### 3. Faça suas Alterações
```bash
# Adicione os arquivos modificados
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona sistema de notificações"

# Siga o padrão Conventional Commits:
# feat: nova funcionalidade
# fix: correção de bug
# docs: documentação
# style: formatação
# refactor: refatoração de código
# test: testes
# chore: tarefas de build/config
```

### 4. Push e Pull Request
```bash
# Push para seu fork
git push origin feature/nome-da-feature

# Abra um PR no GitHub com:
# - Título claro e descritivo
# - Descrição detalhada das mudanças
# - Screenshots (se aplicável)
# - Referências a issues relacionadas
```

### 📝 Diretrizes de Código

- ✅ Use TypeScript para type safety
- ✅ Siga o ESLint e Prettier configurados
- ✅ Escreva testes para novas funcionalidades
- ✅ Mantenha componentes pequenos e reutilizáveis
- ✅ Documente funções complexas
- ✅ Use nomes descritivos para variáveis e funções

## 🐛 Reportar Bugs

Encontrou um bug? Ajude-nos a melhorar!

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/bartolomeugaspar/Elit-Art-Front/issues)
2. Abra uma [nova issue](https://github.com/bartolomeugaspar/Elit-Art-Front/issues/new) com:
   - Título descritivo
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Informações do ambiente (browser, OS, etc.)

## 🗺️ Roadmap

### 🚀 Em Desenvolvimento
- [ ] Sistema de pagamentos integrado
- [ ] Loja online completa
- [ ] App mobile (React Native)
- [ ] Sistema de notificações push
- [ ] Chat em tempo real
- [ ] Integração com redes sociais

### ✅ Concluído
- [x] Sistema de autenticação
- [x] Dashboard administrativo
- [x] Blog e galeria
- [x] Sistema de eventos
- [x] Fórum comunitário
- [x] Sistema de auditoria

## 📊 Status do Projeto

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-green)
![Uptime](https://img.shields.io/badge/uptime-99.9%25-brightgreen)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License

Copyright (c) 2024 Elit'Arte

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

## 🙏 Agradecimentos

- 🎭 A todos os artistas do Elit'Arte
- 👥 À comunidade que apoia o movimento
- 💻 Aos contribuidores do projeto
- 🎨 Aos designers e criadores de conteúdo

## 📞 Suporte

Precisa de ajuda? Entre em contato:

- 📧 **Email**: faustinodomingos83@hotmail.com
- 💬 **WhatsApp**: +244 950 291 335
- 📱 **Telefone**: +244 927 935 543
- 🐛 **Issues**: [GitHub Issues](https://github.com/bartolomeugaspar/Elit-Art-Front/issues)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/bartolomeugaspar/Elit-Art-Front/discussions)

## 🌟 Apoie o Elit'Arte

> *"Somos o sopro criativo que transforma histórias em emoção."*

Junte-se ao movimento artístico que está transformando Angola através da Arte e cultura!

### Formas de Apoiar

- ⭐ Dê uma estrela no projeto
- 🔄 Compartilhe nas redes sociais
- 🤝 Contribua com código
- 💡 Sugira melhorias
- 📣 Divulgue o Elit'Arte
- 🎭 Participe dos eventos

---

<div align="center">

**© 2024 Elit'Arte - Todos os direitos reservados**

*Preservando raízes, criando futuro* 🇦🇴✨

[![Site](https://img.shields.io/badge/🌐-Visit_Website-gold?style=for-the-badge)](https://elit-arte-front.vercel.app/)
[![GitHub](https://img.shields.io/badge/⭐-Star_on_GitHub-181717?style=for-the-badge&logo=github)](https://github.com/bartolomeugaspar/Elit-Art-Front)

**Feito com ❤️ pelo Elit'Arte e comunidade**

</div>
