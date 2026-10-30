# Contract: CORS da origem web

Única mudança em `teranova_backend` nesta versão.

## Configuração

- Variável: `THERAPIST_WEB_ORIGIN`
- Um valor por ambiente. Local: `http://localhost:5174`. Produção: a origem real da plataforma.
- Origem ausente ou diferente da configurada: a resposta não libera o navegador. Não refletir a origem pedida.

## Onde vale

Rotas:

- `/auth`
- `/user`
- `/patient`
- `/session`
- `/clinic`
- `/report`
- `/billing`

Fora:

- `/admin`
- `/webhooks/stripe`

## Resposta

- `Access-Control-Allow-Origin`: o valor exato de `THERAPIST_WEB_ORIGIN`
- `Vary`: `Origin`
- `Access-Control-Allow-Headers`: `Authorization`, `Content-Type`, `X-Clinic-Id`
- `Access-Control-Allow-Methods`: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Sem `Access-Control-Allow-Credentials`
- `OPTIONS` responde 204 e não executa a rota

## Prova

- Origem configurada consegue o preflight e a chamada.
- Outra origem, e o admin, não passam a receber esta liberação.
- O cookie do portal administrativo continua no CORS próprio dele.
