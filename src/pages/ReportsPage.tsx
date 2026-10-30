import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listReports } from "@/features/reports/api/reports";
import { ReportList } from "@/features/reports/ui/ReportList";
import { useClinics } from "@/features/clinic/api/clinics";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button, Status, primaryActionClass } from "@/shared/ui/form";
import { PageShimmer } from "@/shared/ui/Shimmer";
import { useState } from "react";

export const ReportsPage = () => {
  const clinics = useClinics();
  const clinicId = clinics.data?.selectedId ?? "";
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: [...queryKeys.reports(clinicId), page],
    enabled: Boolean(clinicId),
    placeholderData: keepPreviousData,
    queryFn: () => listReports(page),
  });
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-end justify-between">
        <h1 className="text-3xl font-semibold leading-tight">Relatórios com IA</h1>
        <Link to="/relatorios/novo" className={primaryActionClass}>Novo relatório</Link>
      </header>
      {query.isLoading && !query.data ? <PageShimmer /> : null}
      {query.isSuccess && query.data.items.length === 0 ? (
        <Status title="Nenhum relatório gerado" detail="Crie o primeiro relatório de jornada. A síntese usa as sessões já escritas do paciente." action={<Link to="/relatorios/novo" className={primaryActionClass}>Novo relatório</Link>} />
      ) : query.isSuccess ? <ReportList items={query.data?.items ?? []} /> : null}
      {query.data?.hasMore ? <Button tone="ghost" disabled={query.isFetching} onClick={() => setPage((value) => value + 1)}>{query.isFetching ? "Carregando" : "Carregar mais"}</Button> : null}
    </div>
  );
};
