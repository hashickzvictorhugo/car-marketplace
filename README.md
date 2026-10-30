# AutoMax - Marketplace de Veículos

Um marketplace completo de veículos construído com Next.js 15, TypeScript, Tailwind CSS, Prisma, Clerk e Vercel.

##  Funcionalidades

### Para Compradores
- **Busca Avançada** - Filtros por marca, modelo, preço, ano, km, combustível, transmissão, carroceria, cor, localização
- **Listagem Inteligente** - Grid/List, paginação, ordenação (preço, ano, km, data)
- **Detalhes Completos** - Galeria de fotos, ficha técnica, equipamentos, descrição, vendedor verificado
- **Comparador** - Compare até 4 veículos lado a lado (tabela ou cards)
- **Favoritos** - Salve veículos, receba alertas de preço
- **Financiamento** - Simulador com 8 bancos, taxas reais, seguros opcionais
- **Contato Direto** - Chat/telefone com vendedores

### Para Vendedores
- **Painel Completo** - Meus anúncios, estatísticas, contatos recebidos
- **Criação Guiada** - 4 passos: dados, fotos, detalhes, publicação
- **Planos Flexíveis** - Básico (grátis), Destaque, Premium
- **Gestão de Leads** - Responder contatos, marcar como lido/respondido
- **Relatórios** - Visualizações, favoritos, contatos por anúncio

### Para Administradores
- **Moderação** - Aprovar/rejeitar anúncios, gerenciar usuários
- **Métricas** - Dashboard com KPIs, gráficos de conversão
- **Configurações** - Planos, taxas, categorias, emails

## 🛠 Tech Stack

| Camada | Tecnologia |
|--------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | Clerk (Next.js) |
| **Storage** | Vercel Blob |
| **Deploy** | Vercel / Cloudflare Pages |
| **Payments** | Stripe / Mercado Pago (ready) |
| **Email** | SendGrid / Resend (ready) |

##  Estrutura do Projeto

```
src/
├── app/                    # App Router pages
│   ├── api/               # API Routes
│   │   ├── listings/      # CRUD veículos
│   │   ├── brands/        # Marcas
│   │   ├── models/        # Modelos
│   │   ├── favorites/     # Favoritos
│   │   ├── inquiries/     # Contatos
│   │   ├── upload/        # Upload imagens
│   │   └── webhooks/      # Clerk webhooks
│   ├── comprar/           # Listagem pública
│   ├── veiculo/[id]/      # Detalhe do veículo
│   ├── vender/            # Criar anúncio
│   ├── dashboard/         # Painel do vendedor
│   ├── favoritos/         # Favoritos do usuário
│   ├── marca/[id]/        # Veículos por marca
│   ├── destaques/         # Veículos em destaque
│   ├── comparar/          # Comparador
│   └── financiamento/     # Simulador
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── car-card.tsx       # Card de veículo (3 variantes)
│   ├── search-filters.tsx # Filtros avançados
│   ├── header.tsx         # Header com auth
│   └── footer.tsx         # Footer completo
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # NextAuth config
│   ├── utils.ts           # Helpers (format, calc, etc)
│   └── types.ts           # TypeScript types
└── middleware.ts          # Clerk middleware
```

## Quick Start

### Pré-requisitos
- Node.js 20+
- PostgreSQL (local, Neon, Supabase, etc)
- Conta Clerk (auth)
- Conta Vercel (deploy + blob)

### Instalação

```bash
# Clone e entre no diretório
cd car-marketplace

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Setup do banco
npx prisma generate
npx prisma db push

# Rode em desenvolvimento
npm run dev
```

### Variáveis de Ambiente (.env)

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/cadastro
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=whsec_...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AutoMax

# Opcional: Email
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@automax.com
```

## Deploy

### Vercel (Recomendado)
```bash
npm i -g vercel
vercel
# Configure env vars no dashboard
vercel --prod
```

### Cloudflare Pages
```bash
npm i -g wrangler
wrangler login
wrangler pages deploy .vercel/output --project-name=car-marketplace
```

### Docker
```bash
docker build -t car-marketplace .
docker run -p 3000:3000 --env-file .env car-marketplace
```

##  Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento (Turbopack)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # ESLint
npm run type-check   # TypeScript check
npx prisma studio    # GUI do banco
npx prisma migrate dev # Migrações
```

## Schema do Banco (Prisma)

Principais models:
- **User** - Compradores, vendedores, admins (Clerk sync)
- **Brand/Model** - Catálogo de veículos
- **Listing** - Anúncios com status, features, imagens
- **Favorite** - Favoritos dos usuários
- **Inquiry** - Contatos comprador ↔ vendedor
- **Comparison** - Veículos para comparar
- **ViewHistory** - Analytics de visualizações
- **Notification** - Notificações em tempo real
- **Setting** - Configurações do sistema

## Extensibilidade

### Adicionar novo campo no anúncio
1. `prisma/schema.prisma` - Adicionar ao model `Listing`
2. `npx prisma migrate dev`
3. Atualizar `src/lib/types.ts`
4. Atualizar formulário em `/vender` e API

### Novo banco de financiamento
Adicionar ao array `BANKS` em `/financiamento/page.tsx`

### Nova página
Criar pasta em `src/app/nova-pagina/page.tsx`

##  Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

##  Contribuindo

1. Fork o projeto
2. Crie branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit (`git commit -m 'Add: nova funcionalidade'`)
4. Push (`git push origin feature/nova-funcionalidade`)
5. Abra Pull Request

---

**AutoMax** - O maior marketplace de veículos do Brasil 🚗✨
