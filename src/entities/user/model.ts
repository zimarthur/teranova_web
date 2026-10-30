export const specialties = [
  ["PSICOLOGA", "Psicologia"],
  ["PSICOPEDAGOGA", "Psicopedagogia"],
  ["FONOAUDIOLOGA", "Fonoaudiologia"],
  ["NUTRICIONISTA", "Nutrição"],
  ["FISIOTERAPEUTA", "Fisioterapia"],
  ["TERAPEUTA_MUSICAL", "Musicoterapia"],
  ["TERAPEUTA_OCUPACIONAL", "Terapia Ocupacional"],
  ["PSICOMOTRICISTA", "Psicomotricidade"],
  ["EDUCADOR_FISICO", "Educação Física"],
  ["ACOMPANHANTE_TERAPEUTICO", "Acompanhamento Terapêutico"],
  ["SUPERVISOR_CLINICO", "Supervisão Clínica"],
  ["OUTROS", "Outro"],
] as const;

export type Specialty = (typeof specialties)[number][0];

export const specialtyLabel = (value: string | null | undefined) =>
  specialties.find(([code]) => code === value)?.[1] ?? "Especialidade não informada";

export type NewUserSteps = {
  account: boolean;
  patient: boolean;
  session: boolean;
};

export type PlanCode = "BASIC" | "PLUS" | "PRO";

export type Subscription = {
  plan: PlanCode;
  startedAt: string;
  lastPaymentAt: string | null;
  nextPaymentAt: string | null;
  status: string | null;
  billingCycle: "monthly" | "annual" | null;
};

export type Therapist = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  specialty: Specialty | null;
  confirmedAt: string | null;
  createdAt?: string;
  avatarUrl: string | null;
  newUserSteps?: NewUserSteps;
  subscription?: Subscription;
};

export type AccountStage = "anonymous" | "unconfirmed" | "onboarding" | "ready";

export const accountStage = (user: Therapist | null | undefined, hasSession: boolean): AccountStage => {
  if (!hasSession || !user) return "anonymous";
  if (!user.confirmedAt) return "unconfirmed";
  if (!user.firstName?.trim() || !user.lastName?.trim() || !user.specialty) return "onboarding";
  return "ready";
};

export const fullName = (person: { firstName?: string | null; lastName?: string | null }) =>
  [person.firstName, person.lastName].filter(Boolean).join(" ").trim();

export const planOf = (user: Therapist | null | undefined): PlanCode =>
  user?.subscription?.plan ?? "BASIC";

export const greetingFor = (date: Date) => {
  const hour = date.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};
