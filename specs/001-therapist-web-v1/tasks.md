---
description: "Task list for the therapist web v1"
---

# Tasks: Plataforma web da terapeuta (v1)

**Input**: Design documents from `/specs/001-therapist-web-v1/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: A especificação não pede TDD geral. O plano pede quatro suítes Vitest: mensagens de autenticação, portão de 768 pixels, nota vazia e ocultação de editar/iniciar sessão. Essas quatro entram nas histórias correspondentes e devem falhar antes da implementação que as faz passar. O restante se prova pelo quickstart.

**Organization**: Tarefas agrupadas por história para implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História da spec (US1–US10)
- Setup, fundação e polimento não levam história

## Path Conventions

- Cliente único em `src/` na raiz de `teranova_web`
- A única mudança de serviço está em `teranova_backend/src/`
- Testes em `tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Criar a SPA vazia na família do admin

- [X] T001 Criar `package.json` com React 19, React Router 7, TanStack Query 5, Vite 7, Tailwind 3.4, TypeScript 5.9, Vitest, Testing Library e os scripts `dev`, `build`, `lint` e `test`
- [X] T002 Configurar alias `@`, porta 5174 e entrada da aplicação em `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `index.html`, `src/main.tsx` e `src/vite-env.d.ts`
- [X] T003 [P] Configurar Tailwind em `tailwind.config.js`, `postcss.config.js` e `src/app/index.css`
- [X] T004 [P] Configurar ESLint em `eslint.config.js` no mesmo formato de `teranova_admin/eslint.config.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Cliente HTTP, credencial e CORS sem os quais nenhuma história chama o serviço

**⚠️ CRITICAL**: Nenhuma história começa antes desta fase

- [X] T005 [P] Liberar `THERAPIST_WEB_ORIGIN` só nas rotas da terapeuta em `teranova_backend/src/config/env.ts`, `teranova_backend/src/middleware/therapistCors.ts` e `teranova_backend/src/server.ts`, conforme `specs/001-therapist-web-v1/contracts/cors.md`
- [X] T006 Guardar refresh token e clínica selecionada em `src/shared/api/sessionStore.ts`
- [X] T007 Enviar Bearer, renovar uma vez no 401 e anexar `X-Clinic-Id` em `src/shared/api/http.ts`
- [X] T008 [P] Criar o cliente do TanStack Query em `src/shared/api/queryClient.ts` e as chaves em `src/shared/api/queryKeys.ts`
- [X] T009 [P] Traduzir falhas conhecidas para português em `src/shared/api/errors.ts`, conforme `specs/001-therapist-web-v1/contracts/therapist-api.md`
- [X] T010 Montar `QueryClientProvider` e `ErrorBoundary` em `src/app/providers.tsx` e `src/main.tsx`
- [X] T011 Criar a tabela de rotas vazia, ainda sem telas clínicas, em `src/app/router.tsx`

**Checkpoint**: Origem local consegue o preflight e o cliente distingue anônimo de credencial guardada

---

## Phase 3: User Story 1 - Criar a conta e entrar (Priority: P1) 🎯 MVP

**Goal**: Cadastro, confirmação, recuperação, onboarding, sessão que sobrevive ao reload e sair neste navegador

**Independent Test**: Criar uma conta, confirmar, completar nome, sobrenome e especialidade, recarregar e continuar dentro. Sair pede o acesso de novo. Login inválido diz "Credenciais inválidas".

### Tests for User Story 1

- [X] T012 [P] [US1] Escrever o teste que falha para login 401, cadastro 400 e recuperação que segue igual com ou sem conta em `tests/auth-errors.test.ts`

### Implementation for User Story 1

- [X] T013 [P] [US1] Definir os estados da conta e o catálogo de especialidades em `src/entities/user/model.ts`
- [X] T014 [US1] Implementar signup, login, confirmação, reenvio, recuperação, refresh, logout e perfil em `src/features/auth/api/auth.ts`
- [X] T015 [P] [US1] Construir os formulários de entrada, cadastro, código e senha nova em `src/features/auth/ui/LoginForm.tsx`, `src/features/auth/ui/SignupForm.tsx`, `src/features/auth/ui/ConfirmAccountForm.tsx` e `src/features/auth/ui/ResetPasswordForm.tsx`
- [X] T016 [P] [US1] Construir o onboarding obrigatório em `src/features/onboarding/ui/OnboardingForm.tsx` e `src/pages/OnboardingPage.tsx`
- [X] T017 [US1] Impedir o produto clínico sem confirmação e sem onboarding em `src/app/RequireAuth.tsx` e `src/app/RequireOnboarding.tsx`
- [X] T018 [US1] Publicar `/entrar`, `/criar-conta`, `/confirmar-conta`, `/recuperar-senha`, `/recuperar-senha/codigo`, `/recuperar-senha/nova` e `/onboarding` em `src/pages/LoginPage.tsx`, `src/pages/SignupPage.tsx`, `src/pages/ConfirmAccountPage.tsx`, `src/pages/ResetPasswordPage.tsx` e `src/app/router.tsx`
- [X] T019 [US1] Encerrar só este navegador ao sair, apagando o refresh token local em `src/features/auth/api/auth.ts` e `src/shared/api/sessionStore.ts`

**Checkpoint**: História 1 funciona em largura de computador sem pacientes nem sessões

---

## Phase 4: User Story 2 - No celular, só o aviso do aplicativo (Priority: P1)

**Goal**: Abaixo de 768 pixels, qualquer endereço mostra só o aviso e não busca dado clínico

**Independent Test**: Estreitar abaixo de 768 pixels autenticada e anônima. Só o aviso aparece. Em 768 pixels o fluxo da história 1 volta.

### Tests for User Story 2

- [X] T020 [P] [US2] Escrever o teste que falha para largura abaixo e a partir de 768 pixels em `tests/viewport-gate.test.tsx`

### Implementation for User Story 2

- [X] T021 [US2] Mostrar só o aviso do aplicativo Teranova e não montar rotas que buscam dado clínico em `src/app/ViewportGate.tsx`
- [X] T022 [US2] Envolver o roteador com o portão em `src/app/providers.tsx`

**Checkpoint**: Histórias 1 e 2 passam juntas. Nenhuma chamada de paciente ou sessão sai com a janela estreita

---

## Phase 5: User Story 3 - Ver o início do dia (Priority: P1)

**Goal**: Cabeçalho, clínica atual, primeiros passos, sessões de hoje e as quatro ações

**Independent Test**: Entrar com passos incompletos e ver o convite para escrever, não gravar. Sem sessão hoje, ler "Nenhuma sessão hoje". Trocar a clínica muda o que o início mostra.

### Implementation for User Story 3

- [X] T023 [P] [US3] Modelar clínica pessoal, clínica compartilhada e clínica selecionada em `src/entities/clinic/model.ts`
- [X] T024 [P] [US3] Modelar o resumo de sessão usado na lista de hoje em `src/entities/session/model.ts`
- [X] T025 [US3] Carregar clínicas, restaurar a seleção e gravá-la neste navegador em `src/features/clinic/api/clinics.ts`
- [X] T026 [US3] Carregar sessões de hoje com continuação da lista em `src/features/home/api/todaySessions.ts`
- [X] T027 [US3] Montar saudação, seletor de clínica, primeiros passos, ações e lista de hoje em `src/features/home/ui/HomeHeader.tsx`, `src/features/home/ui/FirstSteps.tsx`, `src/features/home/ui/HomeActions.tsx`, `src/features/home/ui/SessionsToday.tsx` e `src/pages/HomePage.tsx`
- [X] T028 [US3] Publicar `/` para quem concluiu o onboarding em `src/app/router.tsx`

**Checkpoint**: O início abre depois da história 1 e não oferece microfone

---

## Phase 6: User Story 4 - Cadastrar e abrir o paciente (Priority: P1)

**Goal**: Lista, cadastro, edição, foto e ficha com as abas do aplicativo. Editar e iniciar sessão só na equipe de um paciente ativo

**Independent Test**: Cadastrar um paciente com foto válida. Na clínica compartilhada, quem não está na equipe abre a ficha sem editar, sem nova sessão e sem documentos. Paciente inativo não oferece editar nem iniciar sessão.

### Tests for User Story 4

- [X] T029 [P] [US4] Escrever o teste que falha para equipe, acesso amplo, paciente inativo e consultório pessoal em `tests/patient-chart-actions.test.tsx`

### Implementation for User Story 4

- [X] T030 [P] [US4] Definir campos, catálogos e a regra de quem escreve na ficha em `src/entities/patient/model.ts`
- [X] T031 [US4] Implementar lista, busca, criação, edição, foto e panorama em `src/features/patients/api/patients.ts`
- [X] T032 [US4] Construir lista, formulário e validação de data em `src/features/patients/ui/PatientForm.tsx`, `src/pages/PatientsPage.tsx` e `src/pages/PatientFormPage.tsx`
- [X] T033 [US4] Construir as abas Dados, Equipe, Sessões e Documentos, escondendo editar e nova sessão fora da regra, em `src/features/patients/ui/PatientChart.tsx` e `src/pages/PatientChartPage.tsx`
- [X] T034 [US4] Mostrar a comunicação de limite do plano quando criar paciente responde 402 em `src/features/billing/ui/PlanLimitDialog.tsx`
- [X] T035 [US4] Publicar `/pacientes`, `/pacientes/novo`, `/pacientes/:id` e `/pacientes/:id/editar` em `src/app/router.tsx`

**Checkpoint**: A ficha respeita equipe e paciente ativo sem ainda salvar uma sessão

---

## Phase 7: User Story 5 - Escrever uma sessão e reler outra (Priority: P1)

**Goal**: Fluxo só por escrito e leitura da transcrição, inclusive a que veio do aplicativo, sem áudio

**Independent Test**: Salvar uma nota e achá-la no início, na lista e na ficha. Nota vazia não avança. Abrir uma sessão gravada no aplicativo não oferece arquivo, duração nem reprodução.

### Tests for User Story 5

- [X] T036 [P] [US5] Escrever o teste que falha para nota vazia ou só com espaços em `tests/new-session-note.test.tsx`

### Implementation for User Story 5

- [X] T037 [US5] Ler uma sessão e criar outra em multipart sem a parte `audio` em `src/features/sessions/api/sessions.ts`
- [X] T038 [US5] Construir escolha do paciente, nota e resumo com os horários sugeridos do aplicativo em `src/features/sessions/ui/NewSessionFlow.tsx` e `src/pages/NewSessionPage.tsx`
- [X] T039 [US5] Manter a nota no resumo quando o salvamento falha e não criar sessão se o fluxo for abandonado em `src/features/sessions/ui/NewSessionFlow.tsx`
- [X] T040 [US5] Mostrar resumo, "Suas anotações", "Resumo estruturado" e "Copiar notas", sem áudio, em `src/features/sessions/ui/SessionDetail.tsx` e `src/pages/SessionPage.tsx`
- [X] T041 [US5] Abrir o fluxo escrito pelo início e pela ficha de quem pode atender em `src/features/home/ui/HomeActions.tsx`, `src/features/patients/ui/PatientChart.tsx` e `src/app/router.tsx`

**Checkpoint**: Uma sessão escrita e uma sessão do aplicativo são legíveis. `POST /session/transcribe` não é chamado

---

## Phase 8: User Story 6 - Encontrar sessões (Priority: P2)

**Goal**: Lista com terapeutas, pacientes e período, nos mesmos recortes do aplicativo

**Independent Test**: Aplicar Hoje, Última semana, Últimos 15 dias, Último mês e "Filtrar por mim". Data inicial sem a final não filtra pela metade.

### Implementation for User Story 6

- [X] T042 [US6] Implementar os filtros de terapeutas, pacientes e intervalo em `src/features/sessions/ui/SessionFilters.tsx`
- [X] T043 [US6] Listar sessões com continuação e publicar `/sessoes` em `src/pages/SessionsPage.tsx` e `src/app/router.tsx`

**Checkpoint**: A lista usa o mesmo cliente de sessão da história 5 e não mostra nota de sessão sem permissão

---

## Phase 9: User Story 7 - Tratar documentos do paciente (Priority: P2)

**Goal**: Listar, enviar, abrir e remover documentos com os limites e a permissão do aplicativo

**Independent Test**: Na equipe, enviar um PDF de até 20 MB, abrir e remover. Fora da equipe, a aba não existe. Paciente inativo não aceita alteração.

### Implementation for User Story 7

- [X] T044 [US7] Implementar lista, envio, abertura e remoção em `src/features/patients/api/documents.ts`
- [X] T045 [US7] Exibir a aba só para a equipe de cuidado e recusar alteração de paciente inativo em `src/features/patients/ui/PatientDocuments.tsx`

**Checkpoint**: Documento fora de PDF, JPEG, PNG ou WebP de 20 MB, ou nome acima de 120 caracteres, explica a regra e não entra na lista

---

## Phase 10: User Story 8 - Gerar e ler um relatório de jornada (Priority: P2)

**Goal**: Listar, configurar, gerar e abrir relatórios, sem inventar relatório quando falta paciente ou sessão

**Independent Test**: Sem sessão elegível, a configuração explica o que falta. Com sessão elegível, gerar abre o detalhe. No limite mensal, a mensagem é a do aplicativo.

### Implementation for User Story 8

- [X] T046 [US8] Modelar prévia, período e status do relatório em `src/entities/report/model.ts`
- [X] T047 [US8] Implementar lista, prévia, criação, detalhe e nova tentativa em `src/features/reports/api/reports.ts`
- [X] T048 [US8] Construir lista, configuração e detalhe, com o aviso de que o relatório não substitui o julgamento clínico, em `src/features/reports/ui/ReportList.tsx`, `src/features/reports/ui/ReportConfigure.tsx`, `src/features/reports/ui/ReportDetail.tsx`, `src/pages/ReportsPage.tsx`, `src/pages/ReportConfigurePage.tsx` e `src/pages/ReportDetailPage.tsx`
- [X] T049 [US8] Bloquear a criação no limite mensal reutilizando `src/features/billing/ui/PlanLimitDialog.tsx` e publicar `/relatorios`, `/relatorios/novo` e `/relatorios/:id` em `src/app/router.tsx`

**Checkpoint**: Relatório vazio não é fabricado. A lista continua quando houver mais

---

## Phase 11: User Story 9 - Cuidar da clínica e dos convites (Priority: P2)

**Goal**: Clínica compartilhada, papéis já existentes e convites, sem papel novo

**Independent Test**: No consultório pessoal, a gestão compartilhada não aparece. Sem o papel, a ação não aparece. Convite recebido mostra a contagem e pode ser aceito ou recusado.

### Implementation for User Story 9

- [X] T050 [US9] Implementar membros, papéis, convite, criação de clínica e aceitar ou recusar em `src/features/clinic/api/members.ts`
- [X] T051 [US9] Mostrar informações da clínica e gestão de terapeutas, escondendo a ação de quem não tem o papel, em `src/features/clinic/ui/ClinicSettings.tsx`, `src/features/clinic/ui/TherapistManagement.tsx`, `src/features/patients/ui/CareTeam.tsx`, `src/pages/ClinicPage.tsx` e `src/pages/ClinicTherapistsPage.tsx`
- [X] T052 [US9] Listar convites recebidos com a contagem pendente em `src/features/clinic/ui/ReceivedInvitations.tsx`, `src/pages/InvitationsPage.tsx` e `src/app/router.tsx`

**Checkpoint**: Acesso a todos os pacientes continua sem editar e sem atender. Vincular paciente só existe com o papel de equipe

---

## Phase 12: User Story 10 - Ver a conta e o plano (Priority: P2)

**Goal**: Detalhes da conta, comparação Basic e assinatura Plus ou Pro, sem biometria

**Independent Test**: Basic abre a comparação. Plus ou Pro abrem a assinatura. A foto da conta segue JPEG, PNG ou WebP de até 5 MB. Não existe seção de biometria.

### Implementation for User Story 10

- [X] T053 [P] [US10] Copiar o catálogo atual Basic, Plus e Pro em `src/entities/plan/model.ts`
- [X] T054 [P] [US10] Construir detalhes da conta, foto e exclusão irreversível em `src/features/settings/ui/AccountDetails.tsx` e `src/pages/AccountPage.tsx`
- [X] T055 [US10] Abrir checkout para Basic e o portal da assinatura para Plus ou Pro em `src/features/billing/api/billing.ts`, `src/features/billing/ui/PlanCompare.tsx`, `src/features/billing/ui/SubscriptionPanel.tsx` e `src/pages/PlanPage.tsx`
- [X] T056 [US10] Reunir configurações sem biometria e reler o perfil quando a aba volta do pagamento em `src/pages/SettingsPage.tsx` e `src/app/router.tsx`

**Checkpoint**: Sair continua encerrando só este navegador. O retorno do pagamento não muda a URL do aplicativo

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Fechar as ausências e a prova do quickstart

- [X] T057 [P] Confirmar que `src/` não pede microfone, não chama `POST /session/transcribe`, não reproduz áudio e não oferece biometria
- [X] T058 Rodar `npm run build`, `npm run lint` e `npm test` na raiz de `teranova_web`
- [X] T059 Executar os dez cenários de `specs/001-therapist-web-v1/quickstart.md` em `http://localhost:5174`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa imediata
- **Foundational (Phase 2)**: depende do setup e bloqueia todas as histórias
- **Histórias (Phase 3+)**: dependem da fundação
- **Polish (Phase 13)**: depende das histórias que entrarem na entrega

### User Story Dependencies

- **US1 (P1)**: só depende da fundação. MVP.
- **US2 (P1)**: só depende da fundação. Pode seguir em paralelo com US1 porque o portão fica em `src/app/ViewportGate.tsx`. A integração em `src/app/providers.tsx` espera US1 se as duas forem juntas.
- **US3 (P1)**: depende de US1 para haver terapeuta autenticada e de US2 para não buscar sessão com a janela estreita.
- **US4 (P1)**: depende de US3 para a clínica selecionada.
- **US5 (P1)**: depende de US4 para escolher o paciente e de US3 para a sessão aparecer no início.
- **US6 (P2)**: depende de US5, reutilizando `src/features/sessions/api/sessions.ts`.
- **US7 (P2)**: depende de US4, na ficha.
- **US8 (P2)**: depende de US4 para o paciente e de US5 para existir sessão elegível.
- **US9 (P2)**: depende de US3 para a clínica selecionada e de US4 para a equipe na ficha.
- **US10 (P2)**: depende de US1 para a conta. O diálogo de limite criado em US4 é reutilizado por US8 e US9.

### Within Each User Story

- O teste da história, quando existe, fica vermelho antes da implementação que o faz passar
- Modelo antes da chamada de API
- Chamada de API antes da tela
- Tela antes de publicar a rota

### Parallel Opportunities

- T003 e T004 em paralelo depois de T001
- T005, T006, T008 e T009 em paralelo no início da fundação. T007 espera T006. T010 espera T008. T011 espera T010
- Depois da fundação, US1 e US2 podem andar juntas, com cuidado em `src/app/providers.tsx`
- T012 com T013; T015 com T016
- T023 com T024; T029 com T030; T053 com T054
- `src/app/router.tsx` é arquivo compartilhado. Publicar rotas em sequência, não em paralelo

### Parallel Example: User Story 1

```bash
# Teste e modelo, arquivos diferentes:
Task: "tests/auth-errors.test.ts"
Task: "src/entities/user/model.ts"

# Formulários depois da API de auth:
Task: "src/features/auth/ui/LoginForm.tsx e demais formulários"
Task: "src/features/onboarding/ui/OnboardingForm.tsx"
```

### Parallel Example: User Story 4

```bash
Task: "tests/patient-chart-actions.test.tsx"
Task: "src/entities/patient/model.ts"
```

### Parallel Example: User Story 5

```bash
Task: "tests/new-session-note.test.tsx"
# A implementação em src/features/sessions/ui/NewSessionFlow.tsx começa depois do teste vermelho
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 e Phase 2
2. Completar Phase 3
3. Parar e validar a história 1 em largura de computador
4. A história 2 pode entrar em seguida para o aviso de celular não ficar para o fim

### Incremental Delivery

1. Fundação pronta
2. US1: conta utilizável
3. US2: celular bloqueado
4. US3: início do dia
5. US4: paciente e ficha
6. US5: sessão escrita e leitura sem áudio. Este é o primeiro corte que cobre o critério clínico da spec
7. US6 a US10: lista, documentos, relatório, clínica e plano
8. Phase 13: build, testes e quickstart

### Parallel Team Strategy

1. Todo mundo fecha setup e fundação
2. Uma pessoa fica em US1, outra em US2
3. US3 espera US1
4. US4 espera US3. US10 pode começar a constante de planos em paralelo com US4, sem publicar a rota ainda
5. US6 espera US5. US7 espera US4. US8 espera US4 e US5. US9 espera US3 e US4

---

## Notes

- [P] só quando os arquivos não se cruzam
- História no rótulo só da Phase 3 à Phase 12
- Não criar endpoint, papel, rascunho de nota, teto novo de nota nem URL de retorno de pagamento
- Não chamar `POST /session/transcribe`
- Commitar ao fim de cada tarefa ou de um grupo coerente
- Parar em qualquer checkpoint e testar a história sozinha
