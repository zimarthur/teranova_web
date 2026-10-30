import type { SessionPage, SessionSummary } from "@/entities/session/model";
import { http } from "@/shared/api/http";

export type SessionQuery = {
  page: number;
  therapistIds?: string[];
  patientIds?: string[];
  from?: string;
  to?: string;
  path?: "/session" | "/session/last-sessions";
};

const toParams = (query: SessionQuery) => {
  const params = new URLSearchParams({ page: String(query.page), limit: "20" });
  if (query.therapistIds?.length) params.set("therapistIds", query.therapistIds.join(","));
  if (query.patientIds?.length) params.set("patientIds", query.patientIds.join(","));
  if (query.from && query.to) {
    params.set("from", query.from);
    params.set("to", query.to);
  }
  return params;
};

export const listSessions = (query: SessionQuery) =>
  http<SessionPage>(`${query.path ?? "/session"}?${toParams(query).toString()}`);

export const getSession = (id: string) => http<SessionSummary>(`/session/${id}`);

export const createSession = (input: {
  patientId: string;
  note: string;
  start: Date;
  end: Date;
}) => {
  const body = new FormData();
  body.append("start", input.start.toISOString());
  body.append("end", input.end.toISOString());
  body.append("patient", JSON.stringify({ id: input.patientId }));
  body.append("rawTranscribedNotes", input.note.trim());
  return http<SessionSummary>("/session", { method: "POST", body });
};
