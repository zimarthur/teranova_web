import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Clinic, Invitation } from "@/entities/clinic/model";
import { http } from "@/shared/api/http";
import { queryKeys } from "@/shared/api/queryKeys";
import { sessionStore } from "@/shared/api/sessionStore";

type ClinicList = { clinics: Clinic[]; receivedInvitations: Invitation[] };

export const fetchClinics = async () => {
  const data = await http<ClinicList>("/clinic", { clinic: false });
  const saved = sessionStore.getClinicId();
  const current = data.clinics.find((clinic) => clinic.id === saved) ?? data.clinics[0];
  if (current) sessionStore.setClinicId(current.id);
  return { ...data, selectedId: current?.id ?? null };
};

export const useClinics = () =>
  useQuery({
    queryKey: queryKeys.clinics,
    queryFn: fetchClinics,
  });

export const selectClinic = (id: string, queryClient: ReturnType<typeof useQueryClient>) => {
  sessionStore.setClinicId(id);
  void queryClient.invalidateQueries();
};

export const createClinic = (body: { name: string; cnpj: string; address: string }) =>
  http<Clinic>("/clinic", { method: "POST", clinic: false, body });

export const acceptInvitation = (memberId: string) =>
  http<unknown>(`/clinic/invitations/${memberId}/accept`, { method: "POST", clinic: false, body: {} });

export const declineInvitation = (memberId: string) =>
  http<unknown>(`/clinic/invitations/${memberId}/decline`, { method: "POST", clinic: false, body: {} });
