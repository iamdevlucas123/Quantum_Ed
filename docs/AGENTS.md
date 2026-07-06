# AGENTS.md

## Projeto e stack

QuantumEd e uma plataforma full stack de cursos curtos para formar desenvolvedores em Engenharia de IA.  
Stack principal:

- Frontend: React 19, Next App Router, TypeScript, Zustand, Tailwind CSS + shadcn/ui
- Backend: Node.js, Express 5, TypeScript, Prisma 6, PostgreSQL 15, JWT, bcrypt, cookie-parser, cors
- Tipos compartilhados: `packages/shared/types/index.d.ts`
- Infra local: Docker Compose
- Pacotes: `npm` em `app/` e `api/`

## Setup e comandos

Instalar:

```bash
cd app && npm install
cd ../api && npm install
```

Rodar com Docker:

```bash
docker compose up -d db api app
```

Portas:

- Frontend Docker: `http://localhost:3001`
- Frontend local Next: `http://localhost:5173`
- API: `http://localhost:3000`
- PostgreSQL: `localhost:5433`

Rodar sem Docker:

```bash
cd api && npm run dev
cd app && npm run dev
```

Prisma:

```bash
cd api
npx prisma format
npx prisma generate
npm run import:courses
npm run seed
docker compose exec api npx prisma migrate dev --name <migration_name>
docker compose exec api npx prisma studio --schema prisma/schema.prisma --hostname 0.0.0.0 --port 5555 --browser none
```

Checks:

```bash
cd app && npm run test:unit && npm run test:coverage && npm run lint && npm run typecheck && npm run build
cd api && npm run test:unit && npm run test:coverage && npm run typecheck && npm run build
```

Testes de integracao da API, com PostgreSQL real:

```bash
cd api
npx prisma generate
npx prisma migrate deploy
npm run import:courses:integration
npm run test:integration
```

Para rodar localmente contra o Docker Compose atual, usar um banco separado de teste, por exemplo `quantum_ed_test`, e apontar `DATABASE_URL` para esse banco antes de `migrate deploy`, `import:courses:integration` e `test:integration`.

Testes E2E do frontend com Playwright:

```bash
cd app
npm run test:e2e
npm run test:e2e:report
```

Antes do E2E, preparar o banco de teste com migrations e `import:courses:integration`. A config do Playwright tambem executa essa preparacao via `app/e2e/global_setup.ts` usando `DATABASE_URL` do ambiente.

## Stack planejada de CI/CD

- CI/CD: `GitHub Actions`
- Runtime CI: `Node.js 20`, alinhado aos Dockerfiles atuais
- Instalacao: `npm ci`, porque o projeto ja usa `package-lock.json`
- Unit tests frontend: `Vitest` + `React Testing Library` + `jsdom`
- Unit tests backend: `Vitest`
- Mocks HTTP frontend: `MSW`
- Integracao API: `Vitest` + `Supertest` + PostgreSQL 15 como service container
- E2E: `Playwright`
- Coverage: `@vitest/coverage-v8`
- Seguranca: `CodeQL`, `Dependabot`, `npm audit`, GitHub secret scanning
- Deploy frontend: Vercel conectado ao GitHub, com Preview Deploy em PR e Production Deploy na branch `main`
- Deploy backend: Render conectado ao GitHub, com Production Deploy na branch `main`
- Banco: Neon com `prisma migrate deploy`, nunca `migrate dev` em CI/CD

Suite de testes unitarios inicial implementada:

- Backend: `Vitest` + `@vitest/coverage-v8`, configurado em `api/vitest.unit.config.ts`
- Backend integracao: `Vitest` + `Supertest`, configurado em `api/vitest.integration.config.ts`
- Frontend: `Vitest` + `@vitest/coverage-v8` + `jsdom` + Testing Library, configurado em `app/vitest.config.ts`
- E2E frontend: `Playwright`, configurado em `app/playwright.config.ts`, com Chromium como alvo inicial
- Setup de DOM do frontend em `app/src/test/setup.ts`
- Testes unitarios cobrem auth rules/service, authoring rules, profile utils/mapper, filtros de cursos, stores Zustand e componentes criticos de auth/filtros/rota protegida
- Testes de integracao da API ficam em `api/src/test/integration/`, usam sufixo `.integration.test.ts`, importam o app Express diretamente e cobrem auth, cursos publicos/protegidos, profile e progresso de lesson
- Testes E2E ficam em `app/e2e/`, usam sufixo `.e2e.ts`, reutilizam ou sobem API e Next via Playwright `webServer`, usam PostgreSQL real de teste e cobrem home, cursos, auth, course detail, lesson viewer, progresso, profile e logout
- Coverage atual validado: backend acima de 60% global e auth acima de 80%; frontend acima de 60% global
- Workflow E2E existe em `.github/workflows/e2e.yml`, roda em PRs para `main`, push em `main`, `workflow_dispatch` e nightly `0 3 * * *`; usa PostgreSQL 15 service container, instala API/app, migra/importa o catalogo, inicia API/app explicitamente, roda `npx playwright test` e sobe `playwright-report`, `test-results` e logs apenas em falha
- Workflow principal de qualidade existe em `.github/workflows/ci.yml`, roda em PRs/pushes para `main`, usa Node.js 20 com `npm ci` e possui jobs `api-quality`, `app-quality` e `api-integration`
- Workflow de seguranca existe em `.github/workflows/security.yml`, roda em PRs, push em `main`, weekly schedule e `workflow_dispatch`; usa CodeQL para JavaScript/TypeScript e `npm audit --audit-level=high` em `app` e `api`; o job de audit define uma `DATABASE_URL` de teste para permitir o `postinstall` da API (`prisma generate`)
- Dependabot existe em `.github/dependabot.yml` para npm em `/app`, npm em `/api` e GitHub Actions em `/`
- Branch remota padrao: `main`; os workflows de PR dependem de PRs apontando para `main`
- Deploy de producao nao fica em GitHub Actions no fluxo atual: PR roda testes e Vercel Preview; merge/push em `main` dispara producao na Vercel e no Render

## Estrutura do repositório

- `app/`: frontend React/Next App Router
- `api/`: backend Express/Prisma
- `packages/shared/types/`: contratos TypeScript compartilhados
- `docs/`: documentacao, specs e cursos JSON versionados
- `docker-compose.yml`: orquestracao local
- `app/vercel.json`: configuracao Vercel minima; nao usar rewrites SPA para rotas do Next App Router

Frontend (`app/src`):

- `app/`: rotas do Next App Router
- `route_pages/`: componentes legados de pagina reutilizados pelas rotas do App Router
- `components/`: UI e guards
- `components/ui/`: componentes shadcn/ui gerados e compartilháveis
- `lib/utils.ts`: utilitario `cn()` para compor classes Tailwind com `clsx` e `tailwind-merge`
- `services/`: clientes HTTP e acesso a API
- `context/`: stores Zustand (`auth_store.ts`, `ui_store.ts`)
- `styles/`: CSS global (`index.css`) com Tailwind, tokens globais e variaveis shadcn

Frontend E2E (`app/e2e`):

- `helpers/`: helpers de auth e dados de teste
- `*.e2e.ts`: testes Playwright por fluxo
- `global_setup.ts`: prepara banco E2E com Prisma migrations e importador de cursos
- `app/playwright.config.ts`: configura web servers da API e Next, Chromium, trace/screenshot/video apenas em falhas

Backend (`api/src`):

- `config/`: env, jwt, prisma, cors, cookies
- `routes/`: definicao de rotas
- `controllers/`: camada HTTP
- `services/`: regra de negocio + Prisma direto
- `services/__tests__/`: testes unitarios dos services
- `test/integration/`: helpers e testes de integracao HTTP com Supertest e PostgreSQL real
- `services/types/`: tipos internos auxiliares dos services
- `middlewares/`: auth/autorizacao
- `types/`: tipos auxiliares do backend/Express
- `api/tsconfig.build.json`: config de build de producao da API, exclui testes e helpers de teste para que `npm run build` funcione sem `vitest`/`supertest` em ambientes de producao

## Padrões de frontend, backend e auth

- Rotas do frontend em `app/src/app/` via Next App Router
- Estrutura inicial do Next App Router fica em `app/src/app/`; as rotas reutilizam as paginas atuais diretamente via file-system routing
- `app/src/app/providers.tsx` e o provider client-side global; ele roda `refreshSession()` via Zustand e deve ser montado dentro de `app/src/app/layout.tsx`
- CSS global do App Router deve ser importado apenas em `app/src/app/layout.tsx` via `../styles/index.css`; esse arquivo e o ponto de entrada do Tailwind e tambem guarda tokens globais/shadcn
- Rotas protegidas no App Router devem envolver o conteudo com `RequireAuth` usando `children`
- Componentes/paginas client-side da migracao usam `'use client'`; navegacao deve usar `next/link` e `next/navigation`, nao React Router
- `/courses` e `/courses/:courseSlug` sao publicas; lesson viewer e profile continuam protegidos
- Deploy Vercel deve usar o roteamento nativo do Next App Router; nao configurar rewrite SPA para `/(.*)` -> `/`
- `app/next.config.mjs` nao deve customizar `distDir` no deploy Vercel; manter o output padrao do Next (`.next`) e deixar Output Directory em branco nas configuracoes da Vercel
- `app/next.config.mjs` define `turbopack.root` para `app/` por causa dos multiplos lockfiles do repositorio
- Componentes legados de pagina reutilizados pelo App Router ficam em `app/src/route_pages/`; nao usar `app/src/pages/`, porque o Next interpreta essa pasta como Pages Router
- Assets do frontend ficam em `app/public/` e devem ser referenciados por URL absoluta, por exemplo `/assets/icons/quantum-atom-mark.png`; avaliar `next/image` depois para imagens criticas
- Arquivos de entrada/config do Vite foram removidos (`app/index.html`, `app/src/main.tsx`, `app/vite.config.js`, `app/vite-env.d.ts`); `npm run dev`, `build` e `preview` usam Next
- Tailwind usa `app/postcss.config.mjs` com `@tailwindcss/postcss`
- shadcn/ui usa `app/components.json` com style `new-york`, base color `neutral`, componentes em `app/src/components/ui` e utilitario em `app/src/lib/utils.ts`
- A migracao principal de CSS para Tailwind/shadcn foi aplicada em Header/LoginModal, Home, courses list, course detail, lesson viewer, profile, not found, Loader e Footer; estes fluxos nao dependem mais de CSS legado por feature/page
- Componentes compartilhados devem preferir shadcn/ui (`Button`, `Card`, `Dialog`, `Input`, `Label`) e utilitarios Tailwind; novos componentes shadcn devem continuar em `app/src/components/ui`
- Shell visual padrao das paginas migradas: `min-h-screen bg-background text-foreground`, container centralizado `max-w-7xl` com `px-4 py-8 sm:px-6 lg:px-8`
- `app/vitest.config.ts` resolve o alias `@` para `app/src`, alinhado ao `tsconfig`, porque shadcn/ui e componentes migrados usam imports `@/...`
- Ordem historica de migracao visual concluida para os fluxos principais; novas telas devem seguir os componentes shadcn/ui e o shell Tailwind padrao descritos acima
- Estado global com Zustand; apesar do nome da pasta, `context/` contem stores
- Requests autenticadas centralizadas em `app/src/services/http_client.ts`
- API clients por dominio: `auth_api.ts`, `user_api.ts`, `course_api.ts`, `lesson_api.ts`
- Backend segue `routes -> controllers -> services -> Prisma`; nao ha camada repository separada
- `/auth/*` e publico; `/users` e `/admin` dependem de auth
- leitura publica de cursos fica fora do `requireAuth`: `GET /courses` e `GET /courses/:slug`
- `GET /public/stats` e publico e serve `developerCount` calculado no backend com cache em memoria de 1 hora
- Rate limiting em memoria: global para a API e regras mais restritivas em `/auth/signin`, `/auth/signup` e `/auth/refresh`
- background jobs simples rodam no boot da API via `setInterval`; hoje existe cleanup diario de refresh tokens e um placeholder de welcome email dependente de infraestrutura de email/persistencia
- Respostas de erro da API devem usar formato unico: `{ "message": "..." }`
- Access token vai em `Authorization: Bearer <token>`
- Refresh token fica em cookie `httpOnly`
- Em producao com frontend e backend em dominios diferentes, cookies de auth usam `secure: true` e `sameSite: 'none'`; em dev local permanecem `sameSite: 'lax'`
- O projeto usa apenas cookies essenciais de autenticacao; nao ha banner/modal de consentimento no frontend
- `signup` valida sintaxe de email no backend e rejeita emails malformados com `400`
- `signup` tambem valida politica minima de senha no backend; o frontend mostra demonstrador de forca e regras minimas no modal
- OAuth Google e GitHub usam callbacks no backend, criam a mesma sessao local (JWT + refresh cookie) e expõem botões no modal
- envs de OAuth no backend: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL`, `FRONTEND_URL`
- Em deploy gratuito atual, usar `FRONTEND_URL`/`CORS_ORIGINS` com a URL real da Vercel (`https://quantum-ed-76g2.vercel.app`) e `NEXT_PUBLIC_API_URL` com a URL real do Render (`https://quantum-ed-api.onrender.com`)
- `ExploreMenu` consome cursos reais via `getCourses()` e agrupa por subject em hook compartilhado no frontend
- `course_section.tsx` na home consome o catálogo real e organiza a vitrine por subject via `app/src/services/course_catalog.ts`
- Catalogo de cursos depende de dados no banco; migrations criam tabelas, mas nao populam cursos automaticamente
- Cursos base ficam em JSON canonico versionado em `docs/courses/catalog/`; popular o banco com `cd api && npm run import:courses`
- Dataset minimo para testes de integracao fica em `docs/courses/integration/integration-test-course.json`; importar com `cd api && npm run import:courses:integration`
- Validar os JSONs sem conectar no banco com `npm run import:courses -- --validate-only` e `npm run import:courses:integration -- --validate-only`
- Suite de integracao da API requer `NODE_ENV=test`, `DATABASE_URL` apontando para banco com `test` no nome, secrets JWT de teste e catalogo importado por `import:courses:integration`; `api/src/test/integration/test_env.ts` falha cedo se o banco parecer inseguro
- Em `NODE_ENV=test`, o app Express nao inicia `publicStatsService.start()` e os rate limiters fazem bypass para evitar handles pendentes e flakiness; comportamento de dev/producao permanece inalterado
- O importador fica em `api/scripts/import_courses.js`, valida campos obrigatorios/slugs, faz upsert via Prisma, recalcula `lessonsCount`/`hoursCount` e nao usa `deleteMany` destrutivo por padrao
- Seed inicial manual em `api/prisma/seed.js` fica como legado/dev bootstrap; preferir `import:courses` para catalogo versionado
- Em producao gratuita sem Render Shell, popular Neon localmente apontando `DATABASE_URL` para a connection string do Neon e rodando `npx prisma migrate deploy` seguido de `npm run import:courses`
- A pagina `courses_list.tsx` usa shell Tailwind padronizado, filtros controlados em `CoursesFilters` e estados de loading/erro/vazio em `CoursesGrid`; manter a spec `docs/specs/courses_list_professional_redesign.md` como referencia para layout, filtros e estado selecionado
- Detalhe de curso usa endpoint protegido `/courses/:courseSlug/detail` para retornar `saved` e progresso das licoes por usuario; `CourseHero` controla save/unsave persistente, `CourseContent` usa modulos colapsaveis e colore modulos completos em verde escuro
- `lesson_viewer` exibe apenas o modulo ativo na sidebar, deriva navegacao por modulo a partir do payload de licoes e mostra `Next module` quando a proxima acao muda de modulo
- `lesson_viewer` possui controle `Mark lesson complete` para persistir progresso da lesson via `PUT /courses/:courseSlug/lessons/:lessonSlug/progress`
- A pagina `profile.tsx` usa shell Tailwind padronizado, nao possui tabs nem botao `Edit Profile`; `Update Bio` e upload de avatar persistem em `User.bio` e `User.avatarUrl` via `PATCH /users/me/profile`
- Upload de avatar no profile usa data URL pequeno sem dependencia externa ou storage dedicado; manter validacao de tamanho/tipo no frontend e no backend enquanto infraestrutura de arquivos nao existir
- A hero da home usa uma cena decorativa com 5 planetas PNG posicionados com Tailwind dentro de `app/src/components/home_page/hero.tsx`
- A secao About da home fica em `app/src/components/home_page/about.tsx`, usa Tailwind/shadcn e deve seguir `docs/about-section-spec.md`: copy especifica, layout responsivo em duas colunas no desktop, mission panel, capabilities e metricas em `dl`
- O frontend usa `protectedRequest`; em `401` tenta `refreshSession()`
- Se o refresh falhar, limpa sessao no `auth_store` e abre login via `ui_store`
- Signup sempre cria usuario como `STUDENT`
- E2E usa emails unicos com prefixo `e2e+`, curso `integration-test-course`, Chromium, `workers: 1`, e exige `DATABASE_URL` apontando para banco com `test` no nome
- Em execucao local com Docker Compose ja usando `localhost:3000`, pode-se rodar E2E com `NEXT_PUBLIC_API_URL=http://localhost:3002` para a API Playwright subir em outra porta
- Em CI E2E, API e app sao iniciados por passos explicitos no workflow; `app/playwright.config.ts` usa `reuseExistingServer: true` para reaproveitar esses servidores e manter fallback local
- Workflow E2E usa `NEXT_PUBLIC_API_URL=http://localhost:3000` e o step `Start app` roda apenas `npm run dev`, sem flags extras de Vite
- Playwright frontend sobe o Next com `npm run dev` e `PLAYWRIGHT_BASE_URL` padrao `http://localhost:5173`
- CI principal em `.github/workflows/ci.yml`: `api-quality` roda `npm ci`, typecheck, build, `prisma validate`, `prisma generate` e unit tests; `app-quality` roda lint, typecheck, build e unit tests; `api-integration` usa PostgreSQL 15 service container, `prisma migrate deploy`, `import:courses:integration` e `test:integration`
- E2E Playwright permanece separado em `.github/workflows/e2e.yml`
- Seguranca em `.github/workflows/security.yml`: CodeQL JS/TS e `npm audit --audit-level=high` para `app`/`api`; Trivy fica fora do escopo enquanto nao houver publicacao de imagens Docker; `npm-audit` usa `DATABASE_URL` fake de teste apenas para satisfazer `prisma generate` no `postinstall`

## Deploy gratuito atual

Arquitetura usada para deploy sem AWS:

- Frontend: Vercel Hobby, root directory `app`, build `npm run build`, output directory padrao da Vercel em branco
- Backend: Render Free Web Service, root directory `api`
- Database: Neon Free Postgres

Configuracoes importantes:

- Branch de producao no GitHub/Vercel/Render: `main`
- Pull requests para `main` devem rodar `CI`, `E2E`, `Security` e Preview Deploy da Vercel antes do merge
- Nao ha staging no fluxo atual; depois do merge em `main`, Vercel e Render fazem deploy de producao diretamente
- Vercel env: `NEXT_PUBLIC_API_URL=https://quantum-ed-api.onrender.com`
- Validar cuidadosamente o deploy na Vercel se qualquer configuracao de Output Directory for alterada; o fluxo padrao da plataforma espera o output nativo do Next
- Render envs principais: `NODE_ENV=production`, `DATABASE_URL`, `FRONTEND_URL=https://quantum-ed-76g2.vercel.app`, `CORS_ORIGINS=https://quantum-ed-76g2.vercel.app`, secrets JWT/OAuth
- Render build command recomendado: `npm install && npx prisma migrate deploy && npm run build`
- Render start command recomendado: `node dist/src/server.js`
- `api/Procfile` existe para ambientes tipo Beanstalk/Procfile: `web: npm run start`
- `api/package.json` possui `postinstall` com `prisma generate`, `prestart` com `npm run build` e `build` apontando para `tsconfig.build.json`

OAuth em producao:

- Google authorized JavaScript origin: `https://quantum-ed-76g2.vercel.app`
- Google redirect URI: `https://quantum-ed-api.onrender.com/auth/google/callback`
- GitHub OAuth App homepage: `https://quantum-ed-76g2.vercel.app`
- GitHub OAuth App callback: `https://quantum-ed-api.onrender.com/auth/github/callback`
- Usar OAuth App do GitHub, nao GitHub App; se pedir Webhook URL, a tela esta errada

Operacao do banco Neon:

- Nao usar Neon Auth; o projeto ja tem auth proprio com JWT, refresh cookie, bcrypt e OAuth
- Para popular catalogo sem Render Shell, rodar localmente:

```powershell
cd "C:\Users\lucas\OneDrive\Area de Trabalho\Computing\PROJECTS\Quantum_Ed\api"
$env:DATABASE_URL="postgresql://...neon.tech/quantum_ed?sslmode=require"
npx.cmd prisma migrate deploy
npm.cmd run import:courses
Remove-Item Env:DATABASE_URL
```

- Nao colar `DATABASE_URL`, OAuth secrets, JWT secrets ou qualquer secret em chats/logs publicos; se vazar, regenerar imediatamente

## Regras de segurança e limites de mudança

- Nao remova `credentials: 'include'` de `http_client.ts`
- Nao altere fluxo de JWT, refresh token ou cookies sem revisar `auth_service.ts`, `cookies.ts` e `jwt.ts`
- Nao exponha `passwordHash` em responses
- Nao torne rotas protegidas publicas sem motivo explicito
- Mudancas de schema exigem migration Prisma correspondente
- Pode alterar sozinho: componentes/pages/CSS, services frontend, stores Zustand, backend (`routes/controllers/services/middlewares`), tipos compartilhados, Prisma/schema/migrations, docs
- Nao altere sem necessidade explicita: `docker-compose.yml`, envs reais, scripts de `package.json`, configs de build/lint/tsconfig, migrations antigas

## Como responder ao finalizar

- Resumir o que foi alterado
- Listar os principais arquivos modificados
- Informar validacoes executadas (`typecheck`, `build`, `prisma generate`, migration, etc.)
- Apontar limitacoes, gaps ou dependencias de ambiente/dados
- Se algo nao estiver confirmado no projeto, dizer explicitamente: `nao identificado no projeto atual`

Observacoes curtas:

- `api/src/config/.env.example` existe
- `app/.env` e `api/src/config/.env` sao esperados
- `.env.example` do frontend, Prettier e pasta dedicada de hooks: nao identificados no projeto atual
