export const genders = [
  ["MASCULINE", "masculino"],
  ["FEMININE", "feminino"],
  ["OTHER", "outro"],
] as const;

export const diagnoses = [
  ["TEA_LEVEL_1", "TEA Nível 1"],
  ["TEA_LEVEL_2", "TEA Nível 2"],
  ["TEA_LEVEL_3", "TEA Nível 3"],
  ["SUSPECTED_TEA", "Suspeita de TEA"],
  ["UNDER_INVESTIGATION", "Em investigação"],
  ["NEUROTYPICAL", "Neurotípico"],
  ["OTHER_DISORDER", "Outro transtorno"],
  ["NOT_INFORMED", "Não informado"],
] as const;

export const conditions = [
  ["ADHD", "TDAH"],
  ["ANXIETY", "Ansiedade"],
  ["DEPRESSION", "Depressão"],
  ["INTELLECTUAL_DISABILITY", "Deficiência Intelectual"],
  ["LANGUAGE_DISORDER", "Transtorno de Linguagem"],
  ["DEVELOPMENTAL_DELAY", "Atraso no Desenvolvimento"],
  ["EPILEPSY", "Epilepsia"],
  ["SLEEP_DISORDER", "Distúrbio do Sono"],
  ["SENSORY_PROCESSING_DISORDER", "Transtorno do Processamento Sensorial"],
  ["MOTOR_DIFFICULTIES", "Dificuldades Motoras"],
  ["AGGRESSIVE_BEHAVIOR", "Comportamento Agressivo"],
  ["FOOD_SELECTIVITY", "Seletividade Alimentar"],
  ["ODD", "TOD (Transtorno Opositivo-Desafiador)"],
] as const;

export const documentTypes = [
  ["ANAMNESIS", "Anamnese"],
  ["CLINICAL_REPORT", "Laudo"],
  ["TECHNICAL_OPINION", "Parecer técnico"],
  ["EXTERNAL_REPORT", "Relatório"],
  ["REFERRAL", "Encaminhamento"],
  ["EXAM", "Exame"],
  ["CONSENT", "Termo e autorização"],
  ["OTHER", "Outro"],
] as const;

export type CareTeamMember = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  specialty: string | null;
  avatarUrl: string | null;
  createdAt?: string | null;
};

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  diagnosis: string;
  additionalConditions: string[];
  birthday: string;
  status: "ACTIVE" | "INACTIVE";
  avatarUrl: string | null;
  lastSessionAt?: string | null;
  careTeam?: CareTeamMember[];
};

export type PatientInsights = {
  totalSessions: number;
  bySpecialty: { specialty: string | null; count: number }[];
};

export const patientInitials = (person: { firstName?: string | null; lastName?: string | null }) => {
  const letters = `${person.firstName?.trim().charAt(0) ?? ""}${person.lastName?.trim().charAt(0) ?? ""}`.toUpperCase();
  return letters || "?";
};

export const labelOf = (pairs: readonly (readonly [string, string])[], value: string | null | undefined) =>
  pairs.find(([code]) => code === value)?.[1] ?? value ?? "";

export const canWritePatient = (input: {
  personal: boolean;
  onCareTeam: boolean;
  active: boolean;
}) => (input.personal || input.onCareTeam) && input.active;

export const onCareTeam = (patient: Patient, userId: string | undefined, personal: boolean) =>
  personal || Boolean(userId && patient.careTeam?.some((member) => member.userId === userId));

export const parseBirthday = (value: string): string | null => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  const now = new Date();
  if (date > now) return null;
  let age = now.getFullYear() - year;
  if (now.getMonth() < month - 1 || (now.getMonth() === month - 1 && now.getDate() < day)) age -= 1;
  if (age > 120) return null;
  return date.toISOString();
};

export const formatBirthday = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
};

export const birthdayError = (value: string) => {
  if (!value.trim()) return "Informe a data de nascimento";
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value.trim())) return "Formato inválido (dd/MM/aaaa)";
  if (!parseBirthday(value)) return "Data inválida";
  return null;
};
