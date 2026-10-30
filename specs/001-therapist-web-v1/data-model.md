# Data model: Plataforma web da terapeuta (v1)

Este cliente não cria persistência clínica. Os registros abaixo são a visão que a interface mantém dos dados que o serviço da terapeuta já guarda. Validações de catálogo continuam no serviço; a interface repete as regras que a terapeuta vê.

## Terapeuta

| Campo | Regras |
|-------|--------|
| id | Identidade da conta, vinda do serviço |
| email | Obrigatório no cadastro e no login |
| password | Só no formulário. Mínimo de 6 caracteres. A confirmação precisa coincidir. Não fica armazenada no navegador |
| firstName, lastName | Obrigatórios no onboarding |
| specialty | Uma de: `PSICOLOGA`, `PSICOPEDAGOGA`, `FONOAUDIOLOGA`, `NUTRICIONISTA`, `FISIOTERAPEUTA`, `TERAPEUTA_MUSICAL`, `TERAPEUTA_OCUPACIONAL`, `PSICOMOTRICISTA`, `EDUCADOR_FISICO`, `ACOMPANHANTE_TERAPEUTICO`, `SUPERVISOR_CLINICO`, `OUTROS` |
| confirmedAt | Ausente: conta ainda não confirmada |
| plan | `BASIC`, `PLUS` ou `PRO` |
| subscription | Presente em Plus e Pro, com ciclo e estado já devolvidos pelo serviço |
| avatarUrl | Opcional. JPEG, PNG ou WebP de até 5 MB |
| newUserSteps | `account`, `patient`, `session`. O bloco de primeiros passos some quando os três estão concluídos |

### Estados da conta

1. Anônima: sem refresh token.
2. Não confirmada: há sessão, `confirmedAt` ausente. Só o fluxo de código.
3. Onboarding: confirmada, sem nome, sobrenome ou especialidade. O produto clínico não abre.
4. Autenticada: confirmada e com onboarding feito. Recarregar restaura este estado pelo refresh token.
5. Encerrada neste navegador: logout apaga o refresh token local e no serviço.

## Clínica

| Campo | Regras |
|-------|--------|
| id | Enviada em `X-Clinic-Id` nas chamadas clínicas |
| type | `PERSONAL` ou `SHARED` |
| name, cnpj, address | Obrigatórios ao criar clínica adicional |
| roles | Somente os papéis já existentes: `MANAGE_ROLES`, `ADD_PATIENT`, `ADD_THERAPIST`, `REMOVE_THERAPIST`, `MANAGE_CARE_TEAM`, `ACCESS_ALL_PATIENTS`, `VIEW_ALL_THERAPIST_NOTES` |
| receivedInvitations | Convites `PENDING` da terapeuta. A contagem aparece na conta |

A clínica selecionada fica neste navegador. Trocar a clínica invalida listas de pacientes, sessões e relatórios. Consultório pessoal não mostra gestão de clínica compartilhada. Plano sem clínica adicional recebe a recusa de limite já usada no aplicativo.

## Paciente

| Campo | Regras |
|-------|--------|
| firstName, lastName | Obrigatórios |
| birthday | `dd/MM/aaaa`, não futura, idade até 120 anos |
| gender | `MASCULINE`, `FEMININE`, `OTHER` |
| diagnosis | `TEA_LEVEL_1`, `TEA_LEVEL_2`, `TEA_LEVEL_3`, `SUSPECTED_TEA`, `UNDER_INVESTIGATION`, `NEUROTYPICAL`, `OTHER_DISORDER`, `NOT_INFORMED` |
| additionalConditions | Zero ou mais: `ADHD`, `ANXIETY`, `DEPRESSION`, `INTELLECTUAL_DISABILITY`, `LANGUAGE_DISORDER`, `DEVELOPMENTAL_DELAY`, `EPILEPSY`, `SLEEP_DISORDER`, `SENSORY_PROCESSING_DISORDER`, `MOTOR_DIFFICULTIES`, `AGGRESSIVE_BEHAVIOR`, `FOOD_SELECTIVITY`, `ODD` |
| status | `ACTIVE` ou `INACTIVE` |
| avatarUrl | Opcional, mesmas regras da foto da terapeuta |
| careTeam | Só em clínica compartilhada |

### Quem escreve na ficha

- Editar e iniciar sessão existem só se o paciente está `ACTIVE` e a terapeuta está na equipe de cuidado.
- No consultório pessoal, quem abre o próprio paciente conta como equipe.
- `ACCESS_ALL_PATIENTS` sem estar na equipe abre a ficha e não mostra editar nem iniciar sessão.
- Paciente `INACTIVE`: sem editar e sem nova sessão. Quem está na equipe pode reativar. Documento não é enviado nem removido.

## Sessão

| Campo | Regras |
|-------|--------|
| patient | Obrigatório antes da nota |
| rawTranscribedNotes | Obrigatória depois do trim. É a nota digitada. Não há arquivo de áudio |
| start, end | Data de hoje e horários sugeridos como no aplicativo. Editáveis. O fim permanece depois do início; se uma edição inverter, o outro horário anda uma hora |
| notes | Texto mostrado em "Suas anotações" |
| structuredNotes | Ausente até a interpretação terminar. Quando existe, vira o bloco "Resumo estruturado" |
| status | `RECORD_RECEIVED`, `TRANSCRIBED`, `RUNNING_AI_PIPELINE`, `DONE` ou `ERROR`. A web não oferece áudio em nenhum deles |

Fluxo local, sem persistir rascunho: escolher paciente → nota → resumo → salvar. Falha no salvar permanece no resumo com a nota visível. Abandonar ou recarregar antes de salvar não cria sessão. Sessão sem permissão não traz `notes` nem `structuredNotes` para a tela.

Filtros da lista: terapeutas, pacientes, e `from` junto com `to`. Atalhos: Hoje, Última semana, Últimos 15 dias, Último mês, e "Filtrar por mim".

## Documento

| Campo | Regras |
|-------|--------|
| name | Até 120 caracteres |
| type | `ANAMNESIS`, `CLINICAL_REPORT`, `TECHNICAL_OPINION`, `EXTERNAL_REPORT`, `REFERRAL`, `EXAM`, `CONSENT`, `OTHER` |
| file | PDF, JPEG, PNG ou WebP de até 20 MB |

A aba só existe para quem está na equipe de cuidado. Abrir usa o recurso que o serviço já devolve. Falha ao abrir mostra "Não foi possível abrir o documento. Tente novamente."

## Relatório de jornada

| Campo | Regras |
|-------|--------|
| patientId | Obrigatório |
| periodPreset | `LAST_30_DAYS`, `LAST_90_DAYS` ou `ALL_TIME` |
| therapistIds | Pelo menos um profissional com sessão no período para gerar |
| status | `PROCESSING`, `COMPLETED` ou `FAILED`. Falha pode ser tentada de novo |
| preview | Não gera relatório. Sem sessão elegível, a tela explica o que falta |

Limite mensal do plano pessoal bloqueia a criação com a comunicação já usada no aplicativo. O texto da configuração lembra que o relatório não substitui o julgamento clínico.

## Plano

| Plano | O que a comparação mostra |
|-------|---------------------------|
| BASIC | Até 5 pacientes particulares, 5 relatórios de jornada por mês, sem clínicas adicionais. Abre a comparação |
| PLUS | Pacientes e relatórios ilimitados no consultório pessoal, sem clínicas adicionais. Abre a assinatura atual |
| PRO | O que o Plus oferece no consultório pessoal, clínicas adicionais, pacientes e relatórios ilimitados nas clínicas, plano da clínica para a equipe. Abre a assinatura atual |

Ciclos: `monthly` e `annual`. Preços e textos são os do catálogo atual do aplicativo. Não há cota de quantidade para criar sessão.

## O que este navegador guarda

| Chave | Conteúdo | Quando some |
|-------|----------|-------------|
| Refresh token | Credencial de renovação | Sair, exclusão da conta ou refresh inválido |
| Clínica selecionada | Id da clínica | Sair, ou quando a clínica deixa de existir na lista |

Nada de áudio, biometria ou rascunho de nota.
