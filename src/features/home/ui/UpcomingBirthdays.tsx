import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fullName } from "@/entities/user/model";
import { listUpcomingBirthdays } from "@/features/patients/api/patients";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button } from "@/shared/ui/form";
import { Shimmer } from "@/shared/ui/Shimmer";

const whenLabel = (daysUntil: number, occursOn: string) => {
  if (daysUntil <= 0) return "Hoje";
  if (daysUntil === 1) return "Amanhã";
  const [, month, day] = occursOn.split("-");
  if (!day || !month) return "Data não informada";
  return `${day}/${month}`;
};

export const UpcomingBirthdays = ({ clinicId }: { clinicId: string }) => {
  const query = useQuery({
    queryKey: queryKeys.birthdays(clinicId),
    queryFn: listUpcomingBirthdays,
  });
  const people = query.data ?? [];

  return (
    <section className="sheet overflow-hidden">
      <h2 className="px-4 pt-4 text-base font-semibold">Próximos aniversários</h2>
      {query.isLoading ? (
        <div className="space-y-2 p-4">
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-10 w-full" />
        </div>
      ) : null}
      {query.isError ? (
        <div className="p-4">
          <p className="text-sm text-quiet">Não foi possível carregar os aniversários.</p>
          <Button tone="ghost" onClick={() => void query.refetch()}>Tentar novamente</Button>
        </div>
      ) : null}
      {query.isSuccess && people.length === 0 ? (
        <p className="px-4 py-6 text-sm leading-6 text-quiet">Nenhum aniversário próximo.</p>
      ) : null}
      {query.isSuccess && people.length > 0 ? (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[16rem] text-left text-sm">
            <thead className="text-grey">
              <tr>
                <th className="px-4 py-2 font-medium">Paciente</th>
                <th className="px-4 py-2 font-medium">Quando</th>
                <th className="px-4 py-2 font-medium">Idade</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => {
                const today = person.daysUntil <= 0;
                const name = fullName(person) || person.firstName || "Paciente";
                return (
                  <tr key={person.id} className="border-t border-grey-2 hover:bg-surface">
                    <td className="px-4 py-1 font-medium">
                      <Link to={`/pacientes/${person.id}`} className="inline-flex min-h-11 items-center truncate">
                        {name}
                      </Link>
                    </td>
                    <td className={`px-4 py-3 ${today ? "font-semibold text-brand" : "text-quiet"}`}>
                      {whenLabel(person.daysUntil, person.occursOn)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-quiet">{person.turningAge}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
};
