# Contract: telas da plataforma

Interface em português (Brasil). De 768 pixels para cima, o produto completo. Abaixo disso, qualquer endereço mostra só o aviso para usar o aplicativo Teranova e não monta as telas que buscam dado clínico.

Recarregar uma tela já salva permanece nela quando a credencial ainda vale. O fluxo de nova sessão não guarda rascunho.

## Endereços

| Endereço | Quem entra |
|----------|------------|
| `/entrar` | Anônima |
| `/criar-conta` | Anônima |
| `/confirmar-conta` | Conta ainda não confirmada |
| `/recuperar-senha`, `/recuperar-senha/codigo`, `/recuperar-senha/nova` | Recuperação |
| `/onboarding` | Confirmada, sem nome, sobrenome ou especialidade |
| `/` | Início |
| `/pacientes`, `/pacientes/novo`, `/pacientes/:id`, `/pacientes/:id/editar` | Pacientes e ficha |
| `/sessoes`, `/sessoes/nova`, `/sessoes/:id` | Lista, escrita e leitura |
| `/relatorios`, `/relatorios/novo`, `/relatorios/:id` | Relatórios de jornada |
| `/configuracoes`, `/configuracoes/conta`, `/configuracoes/plano` | Conta, plano e sair |
| `/configuracoes/clinica`, `/configuracoes/terapeutas`, `/configuracoes/convites` | Clínica compartilhada e convites |

Endereço desconhecido, com sessão válida, volta ao início. Sem sessão, volta a `/entrar`. Conta não confirmada não abre o início. Onboarding incompleto não abre paciente, sessão ou relatório.

## Início

Cabeçalho com saudação pelo primeiro nome, clínica selecionada e configurações. Ações: Nova sessão, Pacientes, Sessões, Relatórios com IA. Primeiros passos enquanto `newUserSteps` não está completo; o passo da sessão convida a escrever. Sessões de hoje continuam quando houver mais. Vazio: "Nenhuma sessão hoje".

## Nova sessão

1. Escolher o paciente. Pela ficha, o paciente já vem escolhido.
2. Nota começa vazia. Vazia ou só com espaços não avança e explica que a nota precisa ser preenchida.
3. Resumo com paciente, nota, data, início e fim. Data e horários editáveis, sem duração e sem indício de áudio.
4. Salvar cria a sessão sem arquivo. Falha permanece no resumo com a nota visível.

## Leitura da sessão

Resumo, "Suas anotações" e, se houver texto, "Resumo estruturado". Cada bloco com texto tem "Copiar notas" e confirma "Notas copiadas". Sessão vinda do aplicativo não oferece arquivo, duração nem reprodução.

## Ficha

Abas: Dados; Equipe, só em clínica compartilhada; Sessões; Documentos, só na equipe de cuidado. Editar e nova sessão só com paciente ativo e terapeuta na equipe. No consultório pessoal, quem abre o próprio paciente conta como equipe.

## Configurações

Detalhes da conta, plano e sair. Sem biometria. Basic abre a comparação. Plus e Pro abrem a assinatura atual. Clínica compartilhada mostra informações, gestão de terapeutas e convites pendentes. Convites recebidos ficam na conta, com a contagem.

## O que nenhuma tela oferece

Microfone, consentimento de gravação, envio de áudio, duração de gravação, reprodução e biometria.
