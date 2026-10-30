import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { canWritePatient, onCareTeam } from "@/entities/patient/model";
import { hasRole, isShared } from "@/entities/clinic/model";
import { useAccount } from "@/features/auth/api/auth";
import { useClinics } from "@/features/clinic/api/clinics";
import { getPatient } from "@/features/patients/api/patients";
import { PatientChart } from "@/features/patients/ui/PatientChart";
import { queryKeys } from "@/shared/api/queryKeys";
import { Status } from "@/shared/ui/form";
import { PageShimmer } from "@/shared/ui/Shimmer";

export const PatientChartPage = () => {
  const { id = "" } = useParams();
  const account = useAccount();
  const clinics = useClinics();
  const clinic = clinics.data?.clinics.find((item) => item.id === clinics.data?.selectedId) ?? null;
  const clinicId = clinic?.id ?? "";
  const query = useQuery({
    queryKey: queryKeys.patient(clinicId, id),
    queryFn: () => getPatient(id),
    enabled: Boolean(clinicId && id),
  });
  if (query.isError) {
    return <main className="p-8"><Status title={query.error instanceof Error ? query.error.message : "Você não tem acesso a este paciente."} /></main>;
  }
  if (!query.data || !clinic || !account.data) return <PageShimmer />;
  const personal = !isShared(clinic);
  const member = onCareTeam(query.data, account.data.id, personal);
  const active = query.data.status === "ACTIVE";
  return (
    <div>
      <PatientChart
        patient={query.data}
        clinicId={clinicId}
        personal={personal}
        onCareTeam={member}
        canManageCareTeam={hasRole(clinic, account.data.id, "MANAGE_CARE_TEAM")}
        canReactivate={member && !active}
      />
      <p className="sr-only">{canWritePatient({ personal, onCareTeam: member, active }) ? "pode escrever" : "somente leitura"}</p>
    </div>
  );
};
