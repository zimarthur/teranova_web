export const queryKeys = {
  me: ["me"] as const,
  clinics: ["clinics"] as const,
  patients: (clinicId: string, q: string) => ["patients", clinicId, q] as const,
  patient: (clinicId: string, id: string) => ["patient", clinicId, id] as const,
  insights: (clinicId: string, id: string) => ["insights", clinicId, id] as const,
  documents: (clinicId: string, id: string) => ["documents", clinicId, id] as const,
  patientSessions: (clinicId: string, id: string) => ["patient-sessions", clinicId, id] as const,
  today: (clinicId: string) => ["today-sessions", clinicId] as const,
  lastSessions: (clinicId: string) => ["last-sessions", clinicId] as const,
  birthdays: (clinicId: string) => ["birthdays", clinicId] as const,
  sessions: (clinicId: string, filter: string) => ["sessions", clinicId, filter] as const,
  session: (clinicId: string, id: string) => ["session", clinicId, id] as const,
  reports: (clinicId: string) => ["reports", clinicId] as const,
  report: (clinicId: string, id: string) => ["report", clinicId, id] as const,
  preview: (clinicId: string, patientId: string, period: string) =>
    ["report-preview", clinicId, patientId, period] as const,
};
