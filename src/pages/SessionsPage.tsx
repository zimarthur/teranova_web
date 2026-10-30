import { useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { formatWhen, presetRange } from "@/entities/session/model";
import { fullName } from "@/entities/user/model";
import { useAccount } from "@/features/auth/api/auth";
import { useClinics } from "@/features/clinic/api/clinics";
import { listSessions } from "@/features/sessions/api/sessions";
import { SessionFilters, type SessionFilterValue } from "@/features/sessions/ui/SessionFilters";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button, Card, Status } from "@/shared/ui/form";
import { PageShimmer } from "@/shared/ui/Shimmer";

export const SessionsPage = () => {
  const account = useAccount();
  const clinics = useClinics();
  const clinicId = clinics.data?.selectedId ?? "";
  const [filters, setFilters] = useState<SessionFilterValue>({
    therapistIds: [],
    patientIds: [],
    preset: null,
    mine: false,
  });
  const [page, setPage] = useState(1);
  const range: { from?: string; to?: string } = filters.preset ? presetRange(filters.preset) : {};
  const therapistIds = filters.mine && account.data ? [account.data.id] : filters.therapistIds;
  const query = useQuery({
    queryKey: queryKeys.sessions(clinicId, JSON.stringify({ ...filters, page, therapistIds })),
    enabled: Boolean(clinicId),
    placeholderData: keepPreviousData,
    queryFn: () => listSessions({
      page,
      therapistIds,
      patientIds: filters.patientIds,
      from: range.from,
      to: range.to,
    }),
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold leading-tight">Sessões</h1>
      <Card className="p-4">
        <SessionFilters value={filters} onChange={(value) => { setFilters(value); setPage(1); }} />
      </Card>
      {query.isLoading && !query.data ? <PageShimmer /> : null}
      {query.isError ? <Status title="Não foi possível carregar as sessões" action={<Button onClick={() => void query.refetch()}>Tentar novamente</Button>} /> : null}
      {query.isSuccess && query.data.items.length === 0 ? <Status title="Nenhuma sessão encontrada" /> : null}
      {query.data && query.data.items.length > 0 ? (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="text-left text-sm text-quiet">
              <tr>
                <th className="px-6 py-3 font-medium">Paciente</th>
                <th className="px-6 py-3 font-medium">Quando</th>
                <th className="px-6 py-3 font-medium">Terapeuta</th>
              </tr>
            </thead>
            <tbody>
              {query.data.items.map((session) => (
                <tr key={session.id} className="border-t border-line hover:bg-blotter">
                  <td className="px-6 py-4 font-medium">
                    <Link to={`/sessoes/${session.id}`} className="hover:text-brand">{session.patient ? fullName(session.patient) : "Paciente"}</Link>
                  </td>
                  <td className="px-6 py-4 text-grey">{formatWhen(session.start)}</td>
                  <td className="px-6 py-4 text-grey">{session.therapist ? fullName(session.therapist) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : null}
      {query.data?.hasMore ? <Button tone="ghost" disabled={query.isFetching} onClick={() => setPage((value) => value + 1)}>{query.isFetching ? "Carregando" : "Carregar mais"}</Button> : null}
    </div>
  );
};
