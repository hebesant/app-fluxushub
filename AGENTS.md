# AGENTS.md

## Objetivo Do Projeto

- Aplicacao web da Fluxus Hub para operar um painel de campanhas e automacoes.
- O posicionamento atual do app e focado em disparos via WhatsApp; textos de interface nao devem vender SMS ou e-mail como canais do produto.
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
  - `settings/`: API, hook de dados e componentes separados por aba para configuracoes.
- `components/ui/`: componentes base no estilo shadcn/Radix.
- `components/layout/`: shell, sidebar e topbar da area autenticada.
- `components/brand/`: logo da Fluxus Hub.
- `lib/`: cliente HTTP, auth, tipos compartilhados, navegacao e utilitarios.
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
- `lib/api.ts` funciona como fachada/barrel.
- A separacao interna atual em `lib/` e:
  - `api-types.ts` para contratos/tipos compartilhados,
  - `auth-session.ts` para token em memoria e limpeza de sessao,
  - `api-client.ts` para `apiRequest`, refresh/logout e formatacao de erros.
- O app agora usa tambem um cache de sessao em memoria para dados de tela, reaproveitando resultados recentes entre navegacoes internas e revalidando ao fundo para reduzir o "pisca" de carregamento ao trocar de aba.
- Area autenticada usa `AppShell`, `AppSidebar` e `AppTopbar`.
- `app/(app)/layout.tsx` envolve a area autenticada com `AuthProvider`; `useAuth` compartilha em memoria o contexto de `/api/auth/me/`, tenta renovar o access token por `/api/auth/token/refresh/` e redireciona para `/login` se nao houver sessao valida.
- Telas autenticadas devem consumir `useAuth` em vez de buscar `/api/auth/me/` isoladamente, para evitar recarregamentos e piscadas de estado padrao entre navegacoes.
- Tema claro/escuro usa a chave compartilhada `fluxushub_theme` e, em producao, tambem um cookie no dominio pai `.fluxushub.com.br` para sincronizar website e app.
- Campanhas e contatos usam paginacao de 20 itens por pagina nos hooks.
- Listas/tags de contatos aceitam resposta paginada ou array legado no front.
- Detalhes de campanha buscam campanha, preview, destinatarios e eventos em paralelo; destinatarios/eventos aceitam resposta paginada ou array legado.
- O runtime de campanhas foi dividido entre hook de detalhes/polling e hook de mutacoes, para reduzir acoplamento no modulo operacional.
- `next.config.ts` define build standalone, Strict Mode, remove `X-Powered-By`, habilita compressao e permite imagens de `/media/**` vindas da API local/producao.
- O app evita `next/font/google` no estado atual para reduzir fragilidade de build em deploys Docker/VPS; a stack tipografica padrao deve vir de fontes locais/sistema.
- Testes frontend usam Vitest em ambiente `jsdom`, com setup em `test/setup.ts`.

## Convencoes De Codigo Identificadas

- Imports absolutos com alias `@/*`.
- Componentes React em PascalCase.
- Hooks em `use...`.
- Tipos exportados em TypeScript, com dados da API em snake_case para bater com o backend.
- Ao trabalhar com billing/Stripe, consultar primeiro o MCP oficial da Stripe configurado no Codex antes de assumir comportamento de Checkout, Customer Portal, webhooks ou estados de assinatura.
- UI com Tailwind classes inline e helpers `cn`.
- Estilo visual baseado em dark mode, com suporte a light mode via classe no `html`.
- Textos da interface estao majoritariamente em portugues.
- Componentes base usam arquivos em `components/ui`, seguindo configuracao de `components.json`.

## Estado Atual Do Projeto

- Rotas principais existem e apontam para suas features.
- Login e aceite de convite estao implementados no front.
- O aceite de convite deve refletir a politica atual de senha do backend: minimo de 10 caracteres, com ao menos uma letra, um numero e um caractere especial.
- Dashboard mostra metricas e listas operacionais a partir da API.
- Dashboard esta dividido em API, hook, utilitarios e componentes menores.
- Contatos suportam listagem, busca, filtros, importacao, tags/listas e acoes em massa.
- Campanhas suportam criacao em etapas, alvos por tag/lista/todos, preview, midia, modo de envio, agendamento unico, detalhes, envio, cancelamento e reenvio de falhas.
- Para campanhas ja efetuadas, a UX deve permitir rever o preview em fluxo separado do modal de logs/detalhes, evitando sobrecarregar a tela de eventos.
- A UI de modo de envio deve permanecer simples para o MVP: o usuario escolhe apenas `Lento`, `Normal` ou `Rapido`, sem ver numeros de delay ou lote. Por baixo dos panos, o backend usa intervalo aleatorio entre `2` e `7` segundos entre mensagens e diferencia os modos por lotes de `10`, `20` e `30`.
- No fluxo por tag, a interface deve permitir selecionar multiplas tags; o backend continua responsavel por deduplicar contatos que caiam em mais de uma tag selecionada.
- Na interface, o modulo `/campaigns` vem sendo apresentado como area de `Disparos`, mantendo a mesma estrutura tecnica por baixo.
- Modal de campanha esta dividido entre componente de composicao, hook de estado/acoes e subcomponentes de header/footer/steps.
- WhatsApp suporta criacao, conexao por QR Code, status, edicao, desconexao e exclusao de instancias.
- Configuracoes incluem workspace, timezone do workspace, conta e modo padrao de envio.
- Configuracoes agora tambem incluem uma aba de billing para owners, consumindo resumo do backend e CTAs para Stripe Checkout e Customer Portal.
- A rota `/settings` agora tambem trata o retorno do Checkout por query params (`billing=success|cancel`), abre a aba de billing, mostra feedback ao owner e força um refresh do resumo antes de limpar a URL.
- A aba de billing agora deve exibir tambem leitura operacional do estado atual da assinatura, incluindo datas de ciclo/trial e mensagens diferentes para `trial`, `active`, `past_due`, `canceled` e ausencia de assinatura Stripe.
- Quando ja existir uma assinatura Stripe ativa/sincronizada, a aba de billing deve atualizar `extra_numbers` diretamente pela API do backend, sem abrir um novo Checkout so para alterar a quantidade; Checkout continua para primeira adesao/retomada e o Customer Portal segue como canal de autoatendimento.
- Configuracoes agora incluem uma aba de equipe para owners gerenciarem membros, papeis e convites pendentes do workspace atual.
- A tela de configuracoes nao deve concentrar toda a logica de dados e UI em um arquivo unico; manter `useSettingsData` como ponto de orquestracao e seções por aba em componentes separados.
- A aba de equipe foi reposicionada para convites por link compartilhavel, nao envio de e-mail transacional; owner escolhe papel e expiracao por presets e compartilha manualmente o link.
- No MVP, o app nao deve expor o papel `admin` na interface de configuracoes; a UX trabalha com `owner` e `member`, embora o papel `admin` continue existindo no backend para futura expansao.
- Na pratica, selects e acoes da aba `Equipe` devem oferecer apenas `owner` e `member`; se aparecer algum membership legado com papel `admin`, a UI pode exibi-lo como contexto, mas nao deve incentivar novas atribuicoes desse papel.
- O proximo ciclo de produto/front esta orientado por administracao de usuarios/workspaces, convites/permissoes e billing real.
- Decisao atual para billing real: usar Stripe Checkout para adesao inicial, Customer Portal para autoatendimento e refletir no app apenas o estado sincronizado pelo backend.
- O modelo comercial atual planejado no app e: `R$ 70/mes` com `1` numero incluso por workspace e `R$ 50/mes` por numero adicional.
- Decisao atual de produto: o painel master interno nao precisa nascer no app; neste primeiro ciclo ele pode viver no Django Admin do backend, enquanto o app foca a experiencia do owner e dos membros do workspace.
- `README.md` contem setup local, scripts, rotas principais e notas de integracao com o backend.
- `.env.example` documenta `NEXT_PUBLIC_API_URL`.
- `.env.example` aponta para `https://api.fluxushub.com.br`; para desenvolvimento local, usar `.env.local` com `http://localhost:8000`.
- `Dockerfile` e `.dockerignore` existem para deploy standalone do app; a imagem expoe a porta `3000`.
- Auth usa access token em memoria e refresh token em cookie `HttpOnly` gerenciado pelo backend; em dev, usar o mesmo host (`localhost`) no front e na API para o cookie `SameSite=Lax`.
- O contexto do usuario autenticado fica em cache de memoria no `AuthProvider`; nao persistir usuario ou tokens em `localStorage`.
- Dashboard, contatos, disparos, WhatsApp e configuracoes devem preferir stale-while-revalidate com cache em memoria de sessao; estados de loading plenos devem aparecer principalmente no primeiro carregamento real, nao em toda troca de rota interna.
- Mudancas de autenticacao devem limpar o cache de sessao em memoria, para impedir que uma conta veja brevemente dados da sessao anterior ao trocar de usuario no mesmo navegador.
- Login e aceite de convite devem respeitar o tema bootstrapado no `html`, inclusive antes da autenticacao.
- Favicon e configurado em `app/layout.tsx` via metadata usando os SVGs em `public/`; nao ha `app/favicon.ico` no estado atual.
- Suite basica de testes cobre CSV/importacao de contatos, payload de contatos, utils de campanha, normalizacao de detalhes de campanha e regras principais do hook do modal de campanha.
- Build de producao deve ser validado com `pnpm build`; lint deve ser validado com `pnpm lint`; testes devem ser validados com `pnpm test:run`.
- `pnpm lint` deve passar sem erros no estado atual.

## Debitos Tecnicos, Lacunas Ou Duvidas

- Nao ha smoke tests E2E configurados.
- Incerteza: regras de permissao por papel parecem depender principalmente do backend; o front apenas consome o contexto do usuario.

## Proximos Passos Provaveis

- Prioridade 1: evoluir a experiencia administrativa para um painel master interno e, no app, ampliar a area de configuracoes para owners gerenciarem membros, convites, papeis e configuracoes do workspace.
- A primeira entrega dessa evolucao agora usa a propria tela `/settings` para listar membros, alterar papeis, remover acessos e enviar/revogar convites quando o usuario atual for owner.
- O fluxo de aceite de convite deve suportar links abertos: quando o convite nao estiver atrelado a um e-mail, a tela `/accept-invite` precisa coletar o e-mail antes de criar a conta.
- Quando funcionalidades mais sensiveis entrarem no produto, o papel `admin` pode voltar a ser exposto na UX; ate la, evitar complexidade artificial de permissao no app.
- Prioridade 2: desenhar no front os fluxos de permissao por papel e estados de convite/aceite antes de abrir o produto para mais usuarios.
- Prioridade 3: integrar billing com Stripe no app, incluindo leitura de assinatura, trial, plano ativo e cobranca por numero adicional.
- A evolucao de billing no app deve usar o MCP oficial da Stripe como apoio preferencial para docs e fluxos atuais, mantendo o backend da Fluxus Hub como fonte de verdade do estado da assinatura.
- A primeira iteracao da UX de billing deve focar owner e workspace: ver plano atual, numeros inclusos, numeros extras, status/trial, CTA para Checkout e CTA para Customer Portal, sem logica critica de billing apenas no front.
- A Fase 1 da UX de billing no app ja deve assumir esse recorte: owner consulta `/api/billing/summary/`, abre Checkout para adesao/retomada e abre Customer Portal para autogerenciamento posterior.
- Prioridade 4: preparar a UX de trial para pequenos estabelecimentos reais, com onboarding simples e limites claros de uso.
- Fase 1 do app deve focar a aba de configuracoes do owner: membros, convites, papeis, perfil do workspace e visibilidade de limites/plano.
- O agendamento deve continuar simples neste ciclo: envio unico, sem recorrencia, sem cron livre e sem timezone por usuario; o fuso vem do workspace.
- A UX de billing no app deve nascer orientada ao workspace: owner responsavel, assinatura unica por workspace e numeros adicionais como expansao da mesma assinatura.
- Expandir testes de componentes para auth, WhatsApp e configuracoes quando esses fluxos estabilizarem.
- Adicionar smoke tests E2E com Playwright antes de automatizar deploys.
