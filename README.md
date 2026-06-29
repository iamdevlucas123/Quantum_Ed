# QuantumEd

QuantumEd e uma plataforma full stack de cursos curtos para Engenharia de IA. O projeto combina uma aplicacao React/Vite, uma API Express com Prisma, autenticacao com JWT + refresh token em cookie `httpOnly`, OAuth Google/GitHub e persistencia em PostgreSQL.

## Sumario

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Estrutura](#estrutura)
- [Setup Local](#setup-local)
- [Prisma E Dados Iniciais](#prisma-e-dados-iniciais)
- [Variaveis De Ambiente](#variaveis-de-ambiente)
- [Scripts](#scripts)
- [Rotas Principais](#rotas-principais)
- [Deploy Atual](#deploy-atual)
- [Observacoes](#observacoes)

## Sobre

O objetivo do QuantumEd e oferecer uma base evolutiva para publicar cursos organizados por `Subject -> Topic -> Course -> Module -> Lesson -> LessonContent`, acompanhar progresso por usuario e proteger experiencias privadas como profile e lesson viewer.

O catalogo publico de cursos e consumido pelo frontend a partir da API. O detalhe de curso autenticado retorna progresso de licoes e estado de curso salvo. O profile permite editar bio e avatar simples, persistidos no usuario.

## Funcionalidades

- Home com hero visual, about section e vitrine de cursos reais.
- Catalogo publico de cursos em `/courses`.
- Filtros por trilha/subject e busca textual no catalogo.
- Detalhe de curso publico em `/courses/:courseSlug`.
- Detalhe autenticado com `saved`, modulos colapsaveis e progresso por licao.
- Lesson viewer protegido com sidebar, topbar e conteudo principal.
- Navegacao de lesson viewer com `Next module` marcando a licao atual como concluida.
- Profile protegido com update de bio e upload simples de avatar.
- Signup/signin com politica minima de senha.
- OAuth Google e GitHub.
- Refresh token em cookie `httpOnly`.
- Rate limiting em memoria para rotas sensiveis.
- Seed manual para catalogo inicial.

## Stack

Frontend:

- React 19
- React Router DOM 7
- Vite 8
- TypeScript
- Zustand
- CSS por feature/pagina

Backend:

- Node.js
- Express 5
- TypeScript
- Prisma 6
- PostgreSQL 15
- JWT
- bcrypt
- cookie-parser
- cors

Infra/local:

- Docker Compose
- PostgreSQL em container
- Tipos compartilhados em `packages/shared/types`

Deploy gratuito atual:

- Frontend: Vercel Hobby
- Backend: Render Free Web Service
- Database: Neon Free Postgres

## Arquitetura

```text
React/Vite app
  -> HTTP API requests
Express API
  -> Prisma Client
PostgreSQL
```

Autenticacao:

```text
Access token: Authorization: Bearer <token>
Refresh token: cookie httpOnly em /auth
OAuth callbacks: /auth/google/callback e /auth/github/callback
```

## Estrutura

```text
.
|-- api/
|   |-- prisma/
|   |   |-- migrations/
|   |   |-- schema.prisma
|   |   `-- seed.js
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- types/
|   |-- package.json
|   `-- Procfile
|-- app/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- styles/
|   |-- package.json
|   `-- vercel.json
|-- docs/
|-- packages/
|   `-- shared/types/
|-- docker-compose.yml
`-- README.md
```

## Setup Local

Instale dependencias:

```bash
cd app
npm install

cd ../api
npm install
```

Suba com Docker:

```bash
docker compose up -d db api app
```

Portas:

```text
Frontend Docker: http://localhost:3001
Frontend Vite local: http://localhost:5173
API: http://localhost:3000
PostgreSQL: localhost:5433
```

Rodar sem Docker:

```bash
cd api
npm run dev

cd ../app
npm run dev
```

## Prisma E Dados Iniciais

Comandos uteis:

```bash
cd api
npx prisma format
npx prisma generate
```

Criar migration em desenvolvimento:

```bash
docker compose exec api npx prisma migrate dev --name <migration_name>
```

Aplicar migrations em producao:

```bash
npx prisma migrate deploy
```

Popular catalogo inicial:

```bash
cd api
npm run seed
```

O seed manual fica em `api/prisma/seed.js` e cria estes cursos base:

- `prompt-engineering-foundations`
- `rag-systems-essentials`
- `linear-algebra-basics`

As migrations criam as tabelas, mas nao populam cursos automaticamente. Em producao com Neon, rode o seed apontando `DATABASE_URL` para a connection string do Neon.

Exemplo no PowerShell:

```powershell
cd "C:\Users\lucas\OneDrive\Area de Trabalho\Computing\PROJECTS\Quantum_Ed\api"
$env:DATABASE_URL="postgresql://...neon.tech/quantum_ed?sslmode=require"
npx.cmd prisma migrate deploy
npm.cmd run seed
Remove-Item Env:DATABASE_URL
```

Nao exponha `DATABASE_URL` real, JWT secrets ou OAuth secrets em chats, commits ou logs publicos.

## Variaveis De Ambiente

Frontend (`app/.env` ou Vercel):

```env
VITE_API_URL=http://localhost:3000
```

Backend (`api/src/config/.env`, `api/.env` ou Render):

```env
PORT=3000
DATABASE_URL=postgresql://quantum:quantum@db:5432/quantum_ed?schema=public

JWT_SECRET=replace-with-a-secure-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=replace-with-another-secure-secret
REFRESH_TOKEN_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:3001,http://localhost:5173,http://127.0.0.1:3001,http://127.0.0.1:5173
NODE_ENV=development

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=
```

Em producao com Vercel + Render:

```env
NODE_ENV=production
FRONTEND_URL=https://quantum-ed-76g2.vercel.app
CORS_ORIGINS=https://quantum-ed-76g2.vercel.app
GOOGLE_CALLBACK_URL=https://quantum-ed-api.onrender.com/auth/google/callback
GITHUB_CALLBACK_URL=https://quantum-ed-api.onrender.com/auth/github/callback
```

Cookies de auth usam `sameSite: 'none'` e `secure: true` em producao para funcionar com frontend e backend em dominios diferentes.

## Scripts

API:

```bash
cd api
npm run dev
npm run typecheck
npm run build
npm run seed
npm start
```

App:

```bash
cd app
npm run dev
npm run lint
npm run typecheck
npm run build
npm run preview
```

## Rotas Principais

Publicas:

```text
GET  /public/stats
GET  /courses
GET  /courses/:slug
POST /auth/signup
POST /auth/signin
POST /auth/refresh
POST /auth/logout
GET  /auth/google
GET  /auth/google/callback
GET  /auth/github
GET  /auth/github/callback
GET  /auth/verify
```

Protegidas:

```text
GET    /users
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
GET    /users/:id/progress
PATCH  /users/me/profile

GET    /courses/:courseSlug/detail
PUT    /courses/:courseSlug/save
DELETE /courses/:courseSlug/save
GET    /courses/:courseSlug/lessons/:lessonSlug
PUT    /courses/:courseSlug/lessons/:lessonSlug/progress
```

Admin:

```text
/admin/*
```

## Deploy Atual

Frontend na Vercel:

```text
Root Directory: app
Build Command: npm run build
Output Directory: dist
Environment:
  VITE_API_URL=https://quantum-ed-api.onrender.com
```

`app/vercel.json` mantem rewrite SPA para React Router:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

Backend no Render:

```text
Root Directory: api
Build Command: npm install && npx prisma migrate deploy && npm run build
Start Command: node dist/src/server.js
```

Render envs principais:

```text
NODE_ENV=production
DATABASE_URL=<Neon connection string>
FRONTEND_URL=https://quantum-ed-76g2.vercel.app
CORS_ORIGINS=https://quantum-ed-76g2.vercel.app
JWT_SECRET=<secret>
REFRESH_TOKEN_SECRET=<secret>
```

OAuth:

```text
Google JavaScript origin:
https://quantum-ed-76g2.vercel.app

Google redirect URI:
https://quantum-ed-api.onrender.com/auth/google/callback

GitHub OAuth App homepage:
https://quantum-ed-76g2.vercel.app

GitHub OAuth App callback:
https://quantum-ed-api.onrender.com/auth/github/callback
```

Use GitHub OAuth App, nao GitHub App. Se a tela pedir Webhook URL, e a tela errada para este projeto.

## Observacoes

- `api/npm test` ainda e placeholder.
- Nao ha suite automatizada real de testes identificada no projeto atual.
- Neon Auth nao deve ser usado, porque o projeto ja possui auth proprio.
- Upload de avatar usa data URL pequeno enquanto nao houver storage dedicado.
- O seed inicial e manual para evitar reset involuntario de conteudo/progresso em deploys futuros.
- Este README nao usa imagens por decisao do projeto.

## Licenca

Licenca ainda nao definida.


validando testes