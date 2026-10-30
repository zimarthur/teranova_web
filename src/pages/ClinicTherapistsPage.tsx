import { isShared } from "@/entities/clinic/model";
import { TherapistManagement } from "@/features/clinic/ui/TherapistManagement";
import { useClinics } from "@/features/clinic/api/clinics";
import { Navigate } from "react-router-dom";

export const ClinicTherapistsPage = () => {
  const clinics = useClinics();
  const clinic = clinics.data?.clinics.find((item) => item.id === clinics.data?.selectedId) ?? null;
  if (!clinic) return null;
  if (!isShared(clinic)) return <Navigate to="/configuracoes" replace />;
  return <main className="mx-auto max-w-3xl px-6 py-8"><TherapistManagement clinic={clinic} /></main>;
};
