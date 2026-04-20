# AGENTS.md

## Objetivo Do Projeto

- Aplicacao web da Fluxus Hub para operar um painel de campanhas e automacoes.
- O app consome uma API Django/DRF via rotas sob `/api/...`.
- Funcionalidades visiveis no codigo: login, aceite de convite, dashboard, contatos, campanhas, instancias de WhatsApp e configuracoes.
- A rota `/register` redireciona para `/login`; cadastro aberto nao aparece como fluxo ativo no front.

## Stack Principal

- Next.js `16.2.4` com App Router.
- React `19.2.4` e TypeScript em modo `strict`.
- Tailwind CSS v4, `shadcn`, Radix UI e `lucide-react`.
- `sonner` para toasts.
- `qrcode` para exibicao/geracao de QR Code.
- Gerenciador observado: `pnpm` (`pnpm-lock.yaml` e `pnpm-workspace.yaml`).

## Estrutura Relevante

- `app/`: rotas Next.
  - `app/(auth)/login`, `app/(auth)/accept-invite`, `app/(auth)/register`.
  - `app/(app)/dashboard`, `contacts`, `campaigns`, `whatsapp`, `settings`.
- `features/`: modulos de dominio.
  - `auth/`: componentes de login e aceite de convite.
  - `dashboard/`: API, hook de dados, componentes de resumo e utilitarios de composicao da home.
  - `contacts/`: API, hooks, componentes, tipos e utilitarios de contatos/importacao.
  - `campaigns/`: API, hooks, componentes, tipos, constantes e fluxo de campanhas.
  - `whatsapp/`: API, hooks, componentes e tipos de instancias WhatsApp.
  - `settings/`: API e pagina de configuracoes.
- `components/ui/`: componentes base no estilo shadcn/Radix.
- `components/layout/`: shell, sidebar e topbar da area autenticada.
- `components/brand/`: logo da Fluxus Hub.
- `lib/`: cliente HTTP, auth, navegacao e utilitarios.
- `public/`: logos SVG usados no layout e favicon por metadata.

## Como Executar Localmente

```bash
pnpm install
pnpm dev
```

- App local padrao: `http://localhost:3000`.
- API padrao se nenhuma variavel for definida: `http://localhost:8000`.
- Para apontar para outro backend, usar `NEXT_PUBLIC_API_URL` em `.env.local`.
- Dominio de producao planejado: `https://app.fluxushub.com.br`.
- API de producao planejada: `https://api.fluxushub.com.br`.
- Comandos disponiveis:

```bash
pnpm build
pnpm lint
pnpm test:run
pnpm start
```

- Suite basica de testes frontend usa Vitest + Testing Library.
- Deploy planejado no Dokploy: `Application` com `Dockerfile`, porta `3000`.
- O Dockerfile usa build standalone do Next.js e aceita `NEXT_PUBLIC_API_URL` como build arg.
- Em producao, `NEXT_PUBLIC_API_URL` deve apontar para `https://api.fluxushub.com.br` antes do build.

## Padroes Arquiteturais Identificados

- Rotas em `app/` sao finas e delegam para componentes em `features/.../components`.
- Cada feature tende a separar:
  - `api/` para chamadas HTTP.
  - `hooks/` para estado, busca de dados e acoes.
  - `components/` para UI.
  - `types.ts`, `constants.ts` e `utils/` quando necessario.
- `lib/api.ts` centraliza:
  - tipos compartilhados da API,
  - `apiRequest`,
  - access token JWT em memoria,
  - refresh de access token via cookie `HttpOnly`,
  - formatacao basica de erros.
- Area autenticada usa `AppShell`, `AppSidebar` e `AppTopbar`.
- `useCurrentUser` tenta renovar o access token por `/api/auth/token/refresh/`, busca `/api/auth/me/` e redireciona para `/login` se nao houver sessao valida.
- Tema claro/escuro e salvo em `localStorage` com a chave `fluxushub_theme`.
- Campanhas e contatos usam paginacao de 20 itens por pagina nos hooks.
- Listas/tags de contatos aceitam resposta paginada ou array legado no front.
- Detalhes de campanha buscam campanha, preview, destinatarios e eventos em paralelo; destinatarios/eventos aceitam resposta paginada ou array legado.
- `next.config.ts` define build standalone, Strict Mode, remove `X-Powered-By`, habilita compressao e permite imagens de `/media/**` vindas da API local/producao.
- Testes frontend usam Vitest em ambiente `jsdom`, com setup em `test/setup.ts`.

## Convencoes De Codigo Identificadas

- Imports absolutos com alias `@/*`.
- Componentes React em PascalCase.
- Hooks em `use...`.
- Tipos exportados em TypeScript, com dados da API em snake_case para bater com o backend.
- UI com Tailwind classes inline e helpers `cn`.
- Estilo visual baseado em dark mode, com suporte a light mode via classe no `html`.
- Textos da interface estao majoritariamente em portugues.
- Componentes base usam arquivos em `components/ui`, seguindo configuracao de `components.json`.

## Estado Atual Do Projeto

- Rotas principais existem e apontam para suas features.
- Login e aceite de convite estao implementados no front.
- Dashboard mostra metricas e listas operacionais a partir da API.
- Dashboard esta dividido em API, hook, utilitarios e componentes menores.
- Contatos suportam listagem, busca, filtros, importacao, tags/listas e acoes em massa.
- Campanhas suportam criacao em etapas, alvos por tag/lista/todos, preview, midia, modo de envio, detalhes, envio, cancelamento e reenvio de falhas.
- Modal de campanha esta dividido entre componente de composicao, hook de estado/acoes e subcomponentes de header/footer/steps.
- WhatsApp suporta criacao, conexao por QR Code, status, edicao, desconexao e exclusao de instancias.
- Configuracoes incluem workspace, conta e modo padrao de envio.
- `README.md` contem setup local, scripts, rotas principais e notas de integracao com o backend.
- `.env.example` documenta `NEXT_PUBLIC_API_URL`.
- `.env.example` aponta para `https://api.fluxushub.com.br`; para desenvolvimento local, usar `.env.local` com `http://localhost:8000`.
- `Dockerfile` e `.dockerignore` existem para deploy standalone do app; a imagem expoe a porta `3000`.
- Auth usa access token em memoria e refresh token em cookie `HttpOnly` gerenciado pelo backend; em dev, usar o mesmo host (`localhost`) no front e na API para o cookie `SameSite=Lax`.
- Favicon e configurado em `app/layout.tsx` via metadata usando os SVGs em `public/`; nao ha `app/favicon.ico` no estado atual.
- Suite basica de testes cobre CSV/importacao de contatos, payload de contatos, utils de campanha, normalizacao de detalhes de campanha e regras principais do hook do modal de campanha.
- Build de producao deve ser validado com `pnpm build`; lint deve ser validado com `pnpm lint`; testes devem ser validados com `pnpm test:run`.
- `pnpm lint` deve passar sem erros no estado atual.

## Debitos Tecnicos, Lacunas Ou Duvidas

- Nao ha smoke tests E2E configurados.
- Incerteza: regras de permissao por papel parecem depender principalmente do backend; o front apenas consome o contexto do usuario.

## Proximos Passos Provaveis

- Expandir testes de componentes para auth, WhatsApp e configuracoes quando esses fluxos estabilizarem.
- Adicionar smoke tests E2E com Playwright antes de automatizar deploys.
