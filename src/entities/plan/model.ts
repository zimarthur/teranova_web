export type BillingCycle = "monthly" | "annual";

export type PlanOffer = {
  code: "BASIC" | "PLUS" | "PRO";
  name: string;
  audience: string;
  features: string[];
  monthly?: number;
  annualMonthly?: number;
  recommended?: boolean;
};

export const planCatalog: PlanOffer[] = [
  {
    code: "BASIC",
    name: "Basic",
    audience: "Consultório pessoal",
    features: [
      "Até 5 pacientes particulares",
      "5 relatórios de jornada por mês",
      "Gravações ilimitadas",
      "Sem clínicas adicionais",
    ],
  },
  {
    code: "PLUS",
    name: "Plus",
    audience: "Consultório pessoal ilimitado",
    recommended: true,
    monthly: 59,
    annualMonthly: 39,
    features: [
      "Pacientes ilimitados no consultório pessoal",
      "Relatórios de jornada ilimitados",
      "Gravações ilimitadas",
      "Sem clínicas adicionais",
    ],
  },
  {
    code: "PRO",
    name: "Pro",
    audience: "Clínica e equipe",
    monthly: 119,
    annualMonthly: 79,
    features: [
      "Tudo do Plus no consultório pessoal",
      "Cadastro de clínicas adicionais",
      "Pacientes e relatórios ilimitados nas clínicas",
      "O plano da clínica vale para toda a equipe",
    ],
  },
];

export const formatBrl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
