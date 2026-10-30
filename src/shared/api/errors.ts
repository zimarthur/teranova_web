export type PlanLimitAction = "CREATE_PATIENT" | "CREATE_JOURNEY_REPORT" | "CREATE_CLINIC";

export type ApiErrorBody = {
  error?: string;
  code?: string;
  plan?: string;
  action?: string;
};

const planName = (plan: string | undefined) => {
  if (plan === "PLUS") return "Plus";
  if (plan === "PRO") return "Pro";
  return "Basic";
};

export const planLimitMessage = (body: ApiErrorBody) => {
  const name = planName(body.plan);
  if (body.action === "CREATE_PATIENT") {
    return `Você chegou ao limite do plano ${name}. Para adicionar mais que 5 pacientes, contrate um novo plano.`;
  }
  if (body.action === "CREATE_JOURNEY_REPORT") {
    return `Você chegou ao limite do plano ${name}. Para gerar mais que 5 relatórios por mês, contrate um novo plano.`;
  }
  if (body.action === "CREATE_CLINIC") {
    return `O plano ${name} não inclui o cadastro de clínicas adicionais. Para criar clínicas, contrate um novo plano.`;
  }
  return body.error || `Você chegou ao limite do plano ${name} para esta ação.`;
};

export const userFacingError = (path: string, status: number, body: ApiErrorBody) => {
  if (path.endsWith("/auth/login") && status === 401) return "Credenciais inválidas";
  if (path.endsWith("/auth/signup") && status === 400) return "Este usuário já possui uma conta.";
  if (path.endsWith("/auth/confirm-account") && status === 401) return "Código inválido ou expirado";
  if (
    (path.endsWith("/auth/validate-reset-token") || path.endsWith("/auth/reset-password")) &&
    status === 401
  ) {
    return "Código de recuperação inválido ou expirado";
  }
  if (status === 402 || body.code === "PLAN_LIMIT_REACHED") return planLimitMessage(body);
  if (body.code === "SESSION_ACCESS_DENIED") return "Você não tem acesso a esta sessão.";
  if (body.code === "PATIENT_ACCESS_DENIED") return "Você não tem acesso a este paciente.";
  if (body.error) return body.error;
  return "Não foi possível concluir. Tente novamente.";
};

export const shouldAdvancePasswordReset = (status: number) => status === 200;
