import type { Patient, PatientInsights } from "@/entities/patient/model";
import { http } from "@/shared/api/http";

export type PatientInput = {
  firstName: string;
  lastName: string;
  gender: string;
  birthday: string;
  diagnosis: string;
  additionalConditions: string[];
  status?: "ACTIVE" | "INACTIVE";
};

type PatientList = { items: Patient[]; hasMore: boolean; total: number };

export const listPatients = (page: number, q: string) => {
  const params = new URLSearchParams({ page: String(page), limit: "20", q });
  return http<PatientList>(`/patient?${params.toString()}`);
};

export const getPatient = (id: string) => http<Patient>(`/patient/${id}`);

export const createPatient = (body: PatientInput) =>
  http<Patient>("/patient", { method: "POST", body });

export const updatePatient = (id: string, body: PatientInput & { status: "ACTIVE" | "INACTIVE" }) =>
  http<Patient>(`/patient/${id}`, { method: "PUT", body });

export const uploadPatientAvatar = (id: string, file: File) => {
  const body = new FormData();
  body.append("avatar", file);
  return http<unknown>(`/patient/${id}/avatar`, { method: "PUT", body });
};

export const deletePatientAvatar = (id: string) =>
  http<unknown>(`/patient/${id}/avatar`, { method: "DELETE" });

export const getInsights = (id: string) => http<PatientInsights>(`/patient/${id}/session-insights`);

export type UpcomingBirthday = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  occursOn: string;
  daysUntil: number;
  turningAge: number;
};

export const listUpcomingBirthdays = async () => {
  const data = await http<{ items?: UpcomingBirthday[] }>("/patient/upcoming-birthdays");
  return data.items ?? [];
};
