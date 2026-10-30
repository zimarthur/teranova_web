import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { formatWhen } from "@/entities/session/model";
import { fullName } from "@/entities/user/model";
import { fetchLastSessions } from "@/features/home/api/todaySessions";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button, Status, primaryActionClass } from "@/shared/ui/form";
import { Shimmer } from "@/shared/ui/Shimmer";
import { useState } from "react";

export const RecentSessions = ({ userId, clinicId }: { userId: string; clinicId: string }) => {
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: [...queryKeys.lastSessions(clinicId), page],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const first = await fetchLastSessions(userId, 1);
      if (page === 1) return first;
      const pages = await Promise.all(Array.from({ length: page }, (_, index) => fetchLastSessions(userId, index + 1)));
      return {
        items: pages.flatMap((entry) => entry.items),
        hasMore: pages.at(-1)?.hasMore ?? false,
      };
    },
  });
  const items = query.data?.items ?? [];

  return (
    <section className="sheet overflow-hidden">
      <h2 className="px-6 pt-5 text-base font-semibold">Últimas sessões</h2>
      {query.isPending && items.length === 0 ? (
        <div className="space-y-2 p-6">
          <Shimmer className="h-11 w-full" />
          <Shimmer className="h-11 w-full" />
          <Shimmer className="h-11 w-full" />
          <Shimmer className="h-11 w-4/5" />
        </div>
      ) : null}
      {query.isError ? (
        <div className="p-6">
          <Status title="Não foi possível carregar as sessões" action={<Button onClick={() => void query.refetch()}>Tentar novamente</Button>} />
        </div>
      ) : null}
      {query.isSuccess && items.length === 0 ? (
        <div className="px-6 py-8">
          <p className="max-w-prose text-base leading-7 text-quiet">Nenhuma sessão ainda.</p>
          <Link to="/sessoes/nova" className={`${primaryActionClass} mt-4`}>Nova sessão</Link>
        </div>
      ) : null}
      {query.isSuccess && items.length > 0 ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="text-grey">
              <tr>
                <th className="px-6 py-3 font-medium">Quando</th>
                <th className="px-6 py-3 font-medium">Paciente</th>
                <th className="px-6 py-3 font-medium">Terapeuta</th>
              </tr>
            </thead>
            <tbody>
              {items.map((session) => {
                const name = session.patient ? fullName(session.patient) : "Paciente";
                return (
                  <tr key={session.id} className="border-t border-grey-2 hover:bg-surface">
                    <td className="whitespace-nowrap px-6 py-3 tabular-nums text-quiet">{formatWhen(session.start)}</td>
                    <td className="px-6 py-1 font-medium">
                      <Link to={`/sessoes/${session.id}`} className="inline-flex min-h-11 max-w-xs items-center truncate">
                        {name}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-quiet">{session.therapist ? fullName(session.therapist) : "Não informado"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {query.isFetching && items.length > 0 ? (
            <div className="border-t border-grey-2 px-6 py-3">
              <Shimmer className="h-11 w-full" />
            </div>
          ) : null}
          {query.data?.hasMore ? (
            <div className="border-t border-grey-2 px-6 py-4">
              <Button tone="ghost" disabled={query.isFetching} onClick={() => setPage((value) => value + 1)}>
                {query.isFetching ? "Carregando" : "Carregar mais"}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};
