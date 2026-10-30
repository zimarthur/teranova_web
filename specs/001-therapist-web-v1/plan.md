# Implementation Plan: Plataforma web da terapeuta (v1)

**Branch**: `001-therapist-web-v1` | **Date**: 2026-10-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-therapist-web-v1/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A terapeuta usa no navegador a mesma conta e os mesmos dados do aplicativo Teranova: conta, onboarding, início, pacientes, sessão escrita, leitura de sessão feita no app, documentos, relatórios de jornada, clínica, convites e plano. Abaixo de 768 pixels só existe o aviso para usar o aplicativo. Não há gravação, reprodução de áudio nem biometria.

A implementação é uma SPA nova em `teranova_web`, na família do admin: Vite, React, TypeScript, Tailwind, TanStack Query e React Router. O acesso é Bearer token, como no aplicativo. O serviço atual permanece; a única mudança nele é CORS para a origem desta web. A sessão é criada em multipart sem a parte de áudio.

## Technical Context

**Language/Version**: TypeScript 5.9, na faixa do `teranova_admin`

**Primary Dependencies**: Vite 7, React 19, React Router 7, TanStack Query 5, Tailwind 3.4

**Storage**: Nenhum banco neste repositório. Dado clínico no serviço já existente. Neste navegador: refresh token e id da clínica selecionada em `localStorage`. Access token só em memória.

**Testing**: `tsc --noEmit` e ESLint, como o admin. Vitest e Testing Library para o portão de largura, as mensagens de autenticação, a nota vazia e a ocultação de editar/iniciar sessão. Prova manual em [quickstart.md](quickstart.md).

**Target Platform**: Navegador de computador e tablet, largura a partir de 768 pixels. Abaixo disso, uma única tela de aviso.

**Project Type**: SPA de produto, cliente do serviço da terapeuta. Não é o portal administrativo.

**Performance Goals**: Com o serviço saudável, lista e ficha mostram conteúdo, vazio ou erro em até 2 segundos. A terapeuta que já conhece o aplicativo conclui a sessão escrita em menos de 3 minutos. Abaixo de 768 pixels, nenhuma chamada clínica dispara.

**Constraints**: Português (Brasil). Sem microfone, áudio ou biometria. Sem segunda API e sem modelo clínico novo. Sem cookie do admin. Nota sem teto novo. Sem rascunho da nota. CORS é a única mudança de serviço. Retorno de pagamento continua no endereço já configurado para o aplicativo.

**Scale/Scope**: Uma terapeuta por navegador, clínicas pequenas, listas paginadas de 20. Cerca de 20 endereços. Não é meta desta versão sustentar milhares de sessões simultâneas.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` ainda é o modelo em branco: sem princípios ratificados, sem versão e sem data. Não há gate adicional a cumprir. As restrições que valem são as da especificação e as decisões fechadas de construção.

**Antes da pesquisa:** PASS. Nenhuma violação, porque não existe princípio ratificado para violar.

**Depois do desenho:** PASS. O desenho não introduz serviço clínico novo, papel novo, áudio, biometria nem cookie de admin. A mudança de backend ficou isolada no contrato de CORS.

## Project Structure

### Documentation (this feature)

```text
specs/001-therapist-web-v1/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── cors.md
│   ├── therapist-api.md
│   └── ui.md
└── tasks.md             # /speckit-tasks, não esta fase
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── providers.tsx
│   ├── router.tsx
│   ├── RequireAuth.tsx
│   ├── RequireOnboarding.tsx
│   ├── ViewportGate.tsx
│   ├── ErrorBoundary.tsx
│   └── index.css
├── pages/
├── features/
│   ├── auth/
│   ├── onboarding/
│   ├── home/
│   ├── patients/
│   ├── sessions/
│   ├── reports/
│   ├── clinic/
│   ├── settings/
│   └── billing/
├── entities/
│   ├── user/
│   ├── patient/
│   ├── session/
│   ├── clinic/
│   ├── report/
│   └── plan/
└── shared/
    ├── api/
    └── ui/

teranova_backend/   # único toque fora deste repositório
└── src/
    ├── middleware/therapistCors.ts
    ├── server.ts
    └── config/env.ts
```

**Structure Decision**: Aplicação única na raiz de `teranova_web`, com o mesmo corte do admin: `app`, `pages`, `features/<área>/{ui,api}`, `entities` e `shared`. Alias `@/`. Porta 5174. O backend não ganha pasta aqui; o CORS entra no repositório do serviço, só nas rotas da terapeuta.

## Complexity Tracking

Nenhuma violação a justificar. A constituição ratificada não existe, e o desenho não acrescenta projeto, papel ou serviço clínico além do que a especificação já fechou.
