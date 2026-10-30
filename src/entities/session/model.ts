export type SessionSummary = {
  id: string;
  start: string;
  end: string;
  status: string;
  notes?: string | null;
  structuredNotes?: string | null;
  patient: { id: string; firstName: string; lastName: string; avatarUrl?: string | null } | null;
  therapist: { id: string; firstName: string | null; lastName: string | null } | null;
  specialty?: string | null;
  chips?: { kind: string; label: string }[];
};

export type SessionPage = {
  items: SessionSummary[];
  hasMore: boolean;
};

export const noteIsFilled = (value: string) => value.trim().length > 0;

export const suggestedRange = (now: Date) => {
  const start = new Date(now);
  const end = new Date(now);
  if (now.getMinutes() > 30) {
    start.setMinutes(0, 0, 0);
    end.setHours(now.getHours() + 1, 0, 0, 0);
  } else {
    start.setHours(now.getHours() - 1, 0, 0, 0);
    end.setHours(now.getHours(), 0, 0, 0);
  }
  return { start, end };
};

export const keepEndAfterStart = (start: string, end: string, edited: "start" | "end") => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  if (endMinutes > startMinutes) return { start, end };
  if (edited === "start") {
    const next = Math.min(startMinutes + 60, 23 * 60 + 59);
    return { start, end: minutesToTime(next) };
  }
  const previous = Math.max(endMinutes - 60, 0);
  return { start: minutesToTime(previous), end };
};

const minutesToTime = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

export const toTimeInput = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

export const toDateInput = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export const combineDateTime = (date: string, time: string) => new Date(`${date}T${time}:00`);

export type DatePreset = "today" | "last7" | "last15" | "last30";

export const datePresetLabel: Record<DatePreset, string> = {
  today: "Hoje",
  last7: "Última semana",
  last15: "Últimos 15 dias",
  last30: "Último mês",
};

export const presetRange = (preset: DatePreset, now = new Date()) => {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const days = preset === "today" ? 0 : preset === "last7" ? 6 : preset === "last15" ? 14 : 29;
  start.setDate(start.getDate() - days);
  return { from: start.toISOString(), to: end.toISOString() };
};

export const formatWhen = (value: string) =>
  new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatClock = (value: string) =>
  new Date(value).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
