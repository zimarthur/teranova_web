# Contract: API da terapeuta consumida pela web

A web não cria endpoint. Ela chama o serviço que o aplicativo já usa. Toda chamada autenticada, exceto o refresh, manda `Authorization: Bearer <accessToken>`. Chamadas de uma clínica mandam `X-Clinic-Id`.

O cliente renova o access token uma vez em 401, com `POST /auth/refresh` e o refresh token no lugar do access token. Se o refresh falhar, este navegador volta para a entrada e apaga o armazenamento local.

## Conta

| Ação | Chamada | Resultado que a interface mostra |
|------|---------|----------------------------------|
| Cadastrar | `POST /auth/signup` `{ email, password }` | 201 guarda os tokens e abre o código. 400: "Este usuário já possui uma conta." |
| Entrar | `POST /auth/login` `{ email, password }` | 200 segue para onboarding ou início, conforme o perfil. 401: "Credenciais inválidas" |
| Confirmar | `POST /auth/confirm-account` `{ confirmationToken }` | 401: "Código inválido ou expirado" |
| Reenviar código | `POST /auth/resend-confirmation-token` `{ email }` | |
| Pedir recuperação | `POST /auth/request-password-reset` `{ email }` | 200 segue para o código exista ou não a conta |
| Validar código | `POST /auth/validate-reset-token` `{ email, token }` | 401: "Código de recuperação inválido ou expirado" |
| Nova senha | `POST /auth/reset-password` `{ email, token, newPassword }` | Senha com no mínimo 6 caracteres |
| Renovar | `POST /auth/refresh` com Bearer do refresh token | Troca os dois tokens |
| Sair | `POST /auth/logout` `{ refreshToken }` | Apaga a credencial local mesmo se a rede falhar depois do clique |
| Perfil | `GET /user/me` | Inclui passos iniciais quando o serviço os manda |
| Onboarding | `POST /user/onboarding-submit` `{ firstName, lastName, specialty }` | Sem os três, a rota clínica não abre |
| Foto da conta | `PUT /user/me/avatar`, `DELETE /user/me/avatar` | Arquivo inválido: "A foto deve ser JPEG, PNG ou WebP de até 5 MB." |
| Excluir conta | `DELETE /user/me` | Só depois da confirmação de exclusão permanente |

## Pacientes

| Ação | Chamada |
|------|---------|
| Listar e buscar | `GET /patient?page&limit&q` |
| Criar | `POST /patient` |
| Ler | `GET /patient/:id` |
| Editar, inclusive ativo/inativo | `PUT /patient/:id` |
| Panorama | `GET /patient/:id/session-insights` |
| Foto | `PUT /patient/:id/avatar`, `DELETE /patient/:id/avatar` |
| Equipe | `POST /patient/:id/care-team`, `DELETE /patient/:id/care-team/:userId` |
| Documentos | `GET/POST /patient/:id/documents`, `GET/DELETE /patient/:id/documents/:documentId` |

Criar paciente no consultório pessoal pode responder 402. A interface mostra a comunicação de limite do plano, com o nome do plano e o limite de pacientes. Falta de acesso à lista não mostra dado de outro paciente.

A ficha só oferece editar e nova sessão para equipe de cuidado com paciente ativo. A ação some da tela; se o serviço recusar, a mensagem é de permissão, sem conteúdo clínico.

## Sessões

| Ação | Chamada |
|------|---------|
| Hoje e lista | `GET /session/last-sessions` e `GET /session` com `page`, `limit`, `therapistIds`, `patientIds`, `from`, `to` |
| Abrir | `GET /session/:id` |
| Criar | `POST /session` multipart, sem a parte `audio` |

Corpo da criação: `start`, `end`, `patient` como JSON `{"id":"..."}`, `rawTranscribedNotes` com a nota já sem espaços nas pontas.

`POST /session/transcribe` não é chamado.

`from` e `to` vão juntos. Sessão sem permissão mostra "Você não tem acesso a esta sessão." e não renderiza as notas. Copiar usa a área de transferência do navegador e confirma "Notas copiadas".

## Relatórios

| Ação | Chamada |
|------|---------|
| Listar | `GET /report?page&limit` |
| Prévia | `POST /report/preview` `{ patientId, periodPreset, therapistIds }` |
| Criar | `POST /report` com o mesmo corpo |
| Abrir | `GET /report/:id` |
| Tentar de novo | `POST /report/:id/retry` |

`periodPreset`: `LAST_30_DAYS`, `LAST_90_DAYS`, `ALL_TIME`. Sem sessão elegível, a prévia não é confirmada como relatório. 402 usa a comunicação de limite mensal de relatórios.

## Clínica e plano

| Ação | Chamada |
|------|---------|
| Listar clínicas e convites recebidos | `GET /clinic` |
| Criar | `POST /clinic` `{ name, cnpj, address }` |
| Membros | `GET /clinic/:id/members` |
| Convidar | `POST /clinic/:id/members` `{ email }` |
| Remover | `DELETE /clinic/:id/members/:memberId` |
| Conceder papel | `POST /clinic/:id/members/:memberId/roles` `{ role }` |
| Revogar papel | `DELETE /clinic/:id/members/:memberId/roles/:role` |
| Buscar terapeuta | `GET /clinic/therapists/search` |
| Aceitar ou recusar convite | `POST /clinic/invitations/:memberId/accept` e `.../decline` |
| Contratar | `POST /billing/checkout-session` `{ planCode: PLUS\|PRO, billingCycle: monthly\|annual }` |
| Assinatura atual | `POST /billing/portal-session` `{}` |

Papel que a pessoa não tem não aparece como ação. 402 ao criar clínica usa a comunicação de clínicas adicionais. Checkout e portal devolvem uma URL; a web a abre e, ao recuperar o foco, relê `GET /user/me`.
