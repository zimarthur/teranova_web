import { http } from "@/shared/api/http";

export type PatientDocument = {
  id: string;
  type: string;
  fileName: string;
  createdAt: string;
  createdBy: { firstName: string | null; lastName: string | null } | null;
};

export const listDocuments = (patientId: string) =>
  http<PatientDocument[]>(`/patient/${patientId}/documents`);

export const uploadDocument = (patientId: string, file: File, type: string, fileName: string) => {
  const body = new FormData();
  body.append("file", file);
  body.append("type", type);
  body.append("fileName", fileName);
  return http<PatientDocument>(`/patient/${patientId}/documents`, { method: "POST", body });
};

export const openDocument = (patientId: string, documentId: string) =>
  http<{ viewUrl: string }>(`/patient/${patientId}/documents/${documentId}`);

export const deleteDocument = (patientId: string, documentId: string) =>
  http<unknown>(`/patient/${patientId}/documents/${documentId}`, { method: "DELETE" });
