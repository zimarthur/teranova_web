import type { ClinicMember, ClinicRole } from "@/entities/clinic/model";
import { http } from "@/shared/api/http";

type MemberList = { items?: ClinicMember[]; members?: ClinicMember[] } | ClinicMember[];

export const fetchMembers = async (clinicId: string) => {
  const data = await http<MemberList>(`/clinic/${clinicId}/members`, { clinic: false });
  if (Array.isArray(data)) return data;
  return data.items ?? data.members ?? [];
};

export const inviteTherapist = (clinicId: string, email: string) =>
  http<unknown>(`/clinic/${clinicId}/members`, { method: "POST", clinic: false, body: { email } });

export const removeTherapist = (clinicId: string, memberId: string) =>
  http<unknown>(`/clinic/${clinicId}/members/${memberId}`, { method: "DELETE", clinic: false });

export const grantRole = (clinicId: string, memberId: string, role: ClinicRole) =>
  http<unknown>(`/clinic/${clinicId}/members/${memberId}/roles`, {
    method: "POST",
    clinic: false,
    body: { role },
  });

export const revokeRole = (clinicId: string, memberId: string, role: ClinicRole) =>
  http<unknown>(`/clinic/${clinicId}/members/${memberId}/roles/${role}`, {
    method: "DELETE",
    clinic: false,
  });

export const searchTherapists = (q: string) =>
  http<{ items?: { id: string; firstName: string; lastName: string }[] }>(
    `/clinic/therapists/search?q=${encodeURIComponent(q)}&limit=10`,
  );

export const addCareTeam = (patientId: string, userId: string) =>
  http<unknown>(`/patient/${patientId}/care-team`, { method: "POST", body: { userId } });

export const removeCareTeam = (patientId: string, userId: string) =>
  http<unknown>(`/patient/${patientId}/care-team/${userId}`, { method: "DELETE" });
