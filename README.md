# Fluxus Hub App

Frontend web da Fluxus Hub para operar dashboard, contatos, campanhas, instancias de WhatsApp e configuracoes.

Este projeto consome a API do repositorio `api-fluxushub` por HTTP.

## Stack

- Next.js `16.2.4` com App Router
- React `19.2.4`
- TypeScript
- Tailwind CSS v4
- shadcn/Radix UI
- Sonner para toasts
- Lucide React para icones

## Requisitos

- Node.js compativel com Next.js 16
- `pnpm`
- Backend `api-fluxushub` rodando localmente ou uma URL de API configurada

## Configuracao Local

Crie um arquivo `.env.local` se precisar apontar para outro backend:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=https://api.fluxushub.com.br
```

Se `NEXT_PUBLIC_API_URL` nao for definido, o app usa `http://localhost:8000`.
Use o mesmo host do front (`localhost`) para manter o refresh cookie funcionando em desenvolvimento.
Para desenvolvimento local, sobrescreva `.env.local` com `NEXT_PUBLIC_API_URL=http://localhost:8000`.
Em producao, o app planejado roda em `https://app.fluxushub.com.br` e consome `https://api.fluxushub.com.br`.

## Instalar Dependencias

```bash
pnpm install
```

## Rodar Em Desenvolvimento

```bash
pnpm dev
```

O app fica disponivel em:

```text
http://localhost:3000
```

## Deploy Com Docker

O projeto possui `Dockerfile` multi-stage usando o build standalone do Next.js.

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.fluxushub.com.br \
  -t fluxushub-app .
```

- Porta exposta pelo container: `3000`.
- Em Dokploy, use deploy como `Application` com `Dockerfile`.
- Configure `NEXT_PUBLIC_API_URL=https://api.fluxushub.com.br` como variavel/build arg antes do build.
- Para teste local contra a API local, use `--build-arg NEXT_PUBLIC_API_URL=http://localhost:8000`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
pnpm test:run
```

- `pnpm dev`: inicia o servidor de desenvolvimento.
- `pnpm build`: gera build de producao.
- `pnpm start`: serve o build de producao.
- `pnpm lint`: executa ESLint.
- `pnpm test`: executa Vitest em modo watch.
- `pnpm test:run`: executa a suite uma vez para validacao local/CI.

Suite basica atual: Vitest + Testing Library em ambiente `jsdom`.

## Rotas Principais

- `/login`: login.
- `/accept-invite`: aceite de convite.
- `/register`: redireciona para `/login`.
- `/dashboard`: visao geral operacional.
- `/contacts`: contatos, listas, tags e importacao.
- `/campaigns`: criacao, envio e acompanhamento de campanhas.
- `/whatsapp`: gerenciamento de instancias WhatsApp.
- `/settings`: configuracoes do workspace, envio e conta.

## Estrutura

```text
app/                 Rotas Next.js
components/brand/    Logo e elementos de marca
components/layout/   Shell, sidebar e topbar
components/ui/       Componentes base estilo shadcn/Radix
features/            Modulos de dominio
lib/                 Cliente API, auth, navegacao e utilitarios
public/              Logos e assets estaticos
```

## Padroes Do Projeto

- Rotas em `app/` devem permanecer finas e delegar para `features/.../components`.
- Chamadas HTTP ficam preferencialmente em `features/*/api` ou em `lib/api.ts`.
- Estado e efeitos de tela ficam em hooks dentro de `features/*/hooks`.
- Tipos compartilhados da API ficam em `lib/api.ts`; tipos especificos ficam em `features/*/types.ts`.
- O app usa alias `@/*`.
- Textos de interface estao majoritariamente em portugues.

## Integracao Com Backend

O cliente HTTP central fica em `lib/api.ts`.

- O access token JWT fica apenas em memoria no browser.
- O refresh token fica em cookie `HttpOnly` emitido pelo backend.
- Requisicoes autenticadas usam `Authorization: Bearer <access_token>`.
- O `fetch` usa `credentials: "include"` para permitir refresh via cookie.
- Ao recarregar a pagina, o app chama `/api/auth/token/refresh/` para obter um novo access token.
- Logout chama `/api/auth/logout/`, limpa o cookie no backend e remove o access token em memoria.

## Observacoes

- O tema claro/escuro usa a chave `fluxushub_theme` no `localStorage`.
- Contatos e campanhas usam paginacao de 20 itens por pagina nos hooks atuais.
- Listas/tags de contatos aceitam resposta paginada pela API ou arrays legados.
- Detalhes de campanha aceitam destinatarios/eventos paginados pela API ou arrays legados.
- A suite basica cobre importacao/payload de contatos, utils de campanha, normalizacao de detalhes e regras principais do modal de campanha.
- O `next.config.ts` possui build standalone, Strict Mode, compressao, cabecalho `X-Powered-By` e imagens locais de `/media/**`.
- Em producao, o dominio planejado do app e `https://app.fluxushub.com.br`.
- O favicon SVG e configurado em `app/layout.tsx` usando logos em `public/`; nao ha `app/favicon.ico` no estado atual.
- O backend precisa estar rodando para as telas autenticadas carregarem dados reais.
