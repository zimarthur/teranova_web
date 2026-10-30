export const reportPeriods = [
  ["LAST_30_DAYS", "Últimos 30 dias"],
  ["LAST_90_DAYS", "Últimos 90 dias"],
  ["ALL_TIME", "Todo o período"],
] as const;

export type ReportPeriod = (typeof reportPeriods)[number][0];

export type ReportListItem = {
  id: string;
  patientId: string;
  patientName: string;
  periodPreset: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED" | string;
  sessionsUsed: number;
  createdAt: string;
};

export type ReportSection = {
  key: string;
  title: string;
  status: string;
  body: string | null;
};

export type ReportDetail = ReportListItem & {
  failureMessage: string | null;
  sections: ReportSection[];
};

export type ReportTherapist = {
  userId: string;
  name: string;
  specialty: string | null;
  sessionCount: number;
};

export type ReportPreview = {
  totalEligibleSessions: number;
  therapists: ReportTherapist[];
};

export const reportStatusLabel = (status: string) => {
  if (status === "COMPLETED") return "Concluído";
  if (status === "FAILED") return "Não foi possível gerar o relatório";
  return "Em geração";
};
