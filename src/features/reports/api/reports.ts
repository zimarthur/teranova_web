import type { ReportDetail, ReportListItem, ReportPeriod, ReportPreview } from "@/entities/report/model";
import { http } from "@/shared/api/http";

type ReportList = { items: ReportListItem[]; hasMore: boolean };

export const listReports = (page: number) =>
  http<ReportList>(`/report?page=${page}&limit=20`);

export const previewReport = (body: {
  patientId: string;
  periodPreset: ReportPeriod;
  therapistIds: string[];
}) => http<ReportPreview>("/report/preview", { method: "POST", body });

export const createReport = (body: {
  patientId: string;
  periodPreset: ReportPeriod;
  therapistIds: string[];
}) => http<ReportDetail>("/report", { method: "POST", body });

export const getReport = (id: string) => http<ReportDetail>(`/report/${id}`);

export const retryReport = (id: string) => http<ReportDetail>(`/report/${id}/retry`, { method: "POST", body: {} });
