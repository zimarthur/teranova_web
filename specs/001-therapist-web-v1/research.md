# Research: Plataforma web da terapeuta (v1)

## Stack e família do admin

- **Decision**: Vite 7, React 19, TypeScript 5.9, Tailwind 3.4, TanStack Query 5 e React Router 7, nas mesmas faixas de versão já usadas em `teranova_admin`. SPA em `teranova_web`, código separado do admin, do aplicativo e da landing.
- **Rationale**: Decisão fechada na especificação. O admin já prova essa combinação para um painel em português, com páginas, Query e roteador.
- **Alternatives considered**: Next.js ou outra versão de React. Rejeitadas porque reabririam a decisão fechada.

## Acesso da terapeuta

- **Decision**: Bearer token, igual ao aplicativo. O refresh token fica em `localStorage`. O access token fica em memória e é renovado com `POST /auth/refresh`, enviando o refresh token em `Authorization: Bearer`. `POST /auth/logout` recebe o refresh token no corpo e, em seguida, o navegador apaga o armazenamento local. A clínica selecionada também fica em `localStorage`, como o aplicativo já faz. Não se usa cookie nem `credentials: include`.
- **Rationale**: O serviço já emite `accessToken` e `refreshToken`. O aplicativo só persiste o refresh token e renova o access token ao reabrir. Recarregar a página chama o refresh e permanece na rota atual do React Router. Sair apaga só este navegador.
- **Alternatives considered**: Cookie do admin. Rejeitado porque o portal administrativo é outro modelo de acesso. Guardar o access token em `localStorage`. Desnecessário, porque o refresh já restaura a sessão.

## CORS

- **Decision**: A única alteração em `teranova_backend` é liberar uma origem configurável (`THERAPIST_WEB_ORIGIN`) nas rotas `/auth`, `/user`, `/patient`, `/session`, `/clinic`, `/report` e `/billing`. Cabeçalhos permitidos: `Authorization`, `Content-Type`, `X-Clinic-Id`. Métodos: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`. A origem é exatamente a configurada. Sem `Access-Control-Allow-Credentials`. `/admin` e `/webhooks/stripe` ficam de fora.
- **Rationale**: O navegador bloqueia a chamada direta ao serviço hoje, porque essas rotas não enviam CORS. O admin tem CORS próprio, com cookie, e não serve para a terapeuta. Cada ambiente aponta a variável para uma origem só: local `http://localhost:5174`, produção para o endereço real.
- **Alternatives considered**: Proxy do Vite como único caminho. Rejeitado porque esconderia a mudança que precisa existir em produção. Lista de origens no mesmo processo. Desnecessária: cada ambiente tem a sua origem.

## Criar sessão sem áudio

- **Decision**: `POST /session` continua multipart, como o aplicativo envia, com `start`, `end`, `patient` (objeto em JSON) e `rawTranscribedNotes`. A parte `audio` não é enviada. O cliente não chama `POST /session/transcribe` e não pede microfone.
- **Rationale**: O serviço já aceita a nota sem arquivo. O campo de upload é opcional. Inventar um JSON puro exigiria mudar o contrato atual.
- **Alternatives considered**: Novo endpoint só de texto. Rejeitado porque criaria uma segunda API.

## Tamanho da nota

- **Decision**: A web não impõe teto novo. Nota vazia ou só com espaços é barrada na interface, com a explicação de que a nota precisa ser preenchida. O teto já existente é o corpo JSON padrão do serviço. Se o salvamento estourar esse teto, a terapeuta permanece no resumo, com a nota visível e com mensagem recuperável.
- **Rationale**: O aplicativo escrito só exige texto depois do trim. O validador do serviço só exige nota não vazia.
- **Alternatives considered**: Contador de caracteres novo. Rejeitado pela especificação.

## Onde a terapeuta cai ao recarregar

- **Decision**: Uma tela já salva (ficha, sessão, lista, relatório, configurações) permanece nessa URL depois do refresh, desde que o refresh token ainda valha. Abaixo de 768 pixels, qualquer URL mostra só o aviso e não busca dado clínico. Nota não salva não vira rascunho: abandonar ou recarregar o fluxo antes de salvar não cria sessão.
- **Rationale**: Foi adiado na clarificação como detalhe de página web. O roteador já guarda a URL. Prometer rascunho seria capacidade que o aplicativo não tem.
- **Alternatives considered**: Sempre voltar ao início. Pior para retomar uma ficha. Rascunho automático da nota. Capacidade nova.

## Retorno do pagamento

- **Decision**: A web usa `POST /billing/checkout-session` e `POST /billing/portal-session` como o aplicativo. Abre a URL devolvida. Não altera `CHECKOUT_SUCCESS_URL` nem `CHECKOUT_CANCEL_URL` nem `portalReturnUrl`, que hoje apontam para o esquema `teranova://`. Ao voltar para a aba da web, a tela de plano busca o perfil de novo.
- **Rationale**: A única mudança de serviço desta versão é o CORS. Mudar a URL de retorno quebraria o aplicativo, que depende do mesmo valor. A assinatura continua sendo atualizada pelo webhook; a web só precisa reler o plano.
- **Alternatives considered**: Enviar uma URL de retorno da web no corpo do checkout. Exige mudança de serviço além do CORS.

## Catálogo de planos

- **Decision**: Basic, Plus e Pro, ciclos mensal e anual, limites e preços ficam numa constante do cliente, espelhando o catálogo que o aplicativo mostra hoje. Não há endpoint de planos.
- **Rationale**: O aplicativo já exibe essa tabela localmente. A comparação precisa ser a mesma.
- **Alternatives considered**: Criar endpoint de catálogo. Fora do escopo.

## Mensagens em português

- **Decision**: A interface traduz os resultados conhecidos do serviço do mesmo jeito que o aplicativo, em vez de mostrar o texto cru em inglês. Login 401 vira "Credenciais inválidas". Cadastro 400 vira "Este usuário já possui uma conta." Código inválido e recuperação seguem as frases da especificação. 402 usa a comunicação de limite de plano. 403 de papel ou de sessão usa a recusa já conhecida, sem conteúdo clínico.
- **Rationale**: Vários erros de autenticação saem em inglês do serviço. A especificação exige português e as mesmas frases do aplicativo.
- **Alternatives considered**: Exibir `error` cru. Quebra o idioma e, em alguns fluxos, o cuidado de não revelar conta.

## Layout do código

- **Decision**: `src/app`, `src/pages`, `src/features/<área>/{ui,api}`, `src/entities/<nome>/model.ts`, `src/shared/{api,ui}`. Alias `@/`. Porta de desenvolvimento 5174, para conviver com o admin na 5173.
- **Rationale**: É a organização que o admin já usa, só que com as áreas da terapeuta.
- **Alternatives considered**: `components/` e `services/` genéricos. Esconde o domínio e afasta o código do admin.

## Verificação

- **Decision**: `tsc --noEmit` e ESLint, como o admin. Vitest e Testing Library para o portão de 768 pixels, o mapeamento das mensagens de autenticação, a nota vazia e a ocultação de editar/iniciar sessão. O restante da prova de ponta a ponta está no `quickstart.md`, contra o serviço já existente. Sem suíte nova no backend além do que for preciso para o CORS não aceitar origem estranha.
- **Rationale**: O admin não tem runner de teste. As regras que mais quebram com um descuido são as que a especificação trata como prontas ou proibidas.
- **Alternatives considered**: Playwright obrigatório nesta fase. Útil depois, pesado demais para o primeiro plano. Só teste manual. Fraco para o portão de largura e para a permissão da ficha.

## O que não entra no cliente

- **Decision**: Nenhuma tela, rota ou chamada de gravação, transcrição, reprodução, duração de áudio ou biometria. `POST /session/transcribe` não é usado.
- **Rationale**: Ausências fechadas da v1.
- **Alternatives considered**: Esconder o botão e deixar a chamada no código. Aumenta o risco de a capacidade aparecer.
