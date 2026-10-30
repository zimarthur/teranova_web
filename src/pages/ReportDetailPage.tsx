import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getReport } from "@/features/reports/api/reports";
import { ReportDetail } from "@/features/reports/ui/ReportDetail";
import { useClinics } from "@/features/clinic/api/clinics";
import { queryKeys } from "@/shared/api/queryKeys";

export const ReportDetailPage = () => {
  const { id = "" } = useParams();
  const clinics = useClinics();
  const clinicId = clinics.data?.selectedId ?? "";
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.report(clinicId, id),
    queryFn: () => getReport(id),
    enabled: Boolean(clinicId && id),
    refetchInterval: (current) => (current.state.data?.status === "PROCESSING" ? 4000 : false),
  });
  if (!query.data) return <main className="p-8">Carregando…</main>;
  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <ReportDetail report={query.data} onChange={() => void queryClient.invalidateQueries({ queryKey: queryKeys.report(clinicId, id) })} />
    </main>
  );
};
