import { useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { formatBirthday, labelOf, diagnoses } from "@/entities/patient/model";
import { fullName } from "@/entities/user/model";
import { hasRole, isShared } from "@/entities/clinic/model";
import { useAccount } from "@/features/auth/api/auth";
import { useClinics } from "@/features/clinic/api/clinics";
import { listPatients } from "@/features/patients/api/patients";
import { PatientAvatar } from "@/features/patients/ui/PatientAvatar";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button, Card, Field, Status, inputClass, primaryActionClass } from "@/shared/ui/form";
import { PageShimmer } from "@/shared/ui/Shimmer";

export const PatientsPage = () => {
  const account = useAccount();
  const clinics = useClinics();
  const clinic = clinics.data?.clinics.find((item) => item.id === clinics.data?.selectedId) ?? null;
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const clinicId = clinic?.id ?? "";
  const query = useQuery({
    queryKey: queryKeys.patients(clinicId, `${q}:${page}`),
    enabled: Boolean(clinicId),
    placeholderData: keepPreviousData,
    queryFn: () => listPatients(page, q),
  });
  const canAdd = !isShared(clinic) || hasRole(clinic, account.data?.id, "ADD_PATIENT");
  const failure = query.error instanceof Error ? query.error.message : "";
  const denied = failure.toLowerCase().includes("acesso");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold leading-tight">Pacientes</h1>
        {canAdd ? <Link to="/pacientes/novo" className={primaryActionClass}>Novo paciente</Link> : null}
      </header>
      <Field label="Buscar">
        <input className={`${inputClass} max-w-sm`} placeholder="Nome do paciente" value={q} onChange={(event) => { setQ(event.target.value); setPage(1); }} />
      </Field>
      {query.isLoading && !query.data ? <PageShimmer /> : null}
      {query.isError ? (
        <Status
          title={denied ? "Você não tem acesso a estes pacientes" : "Não foi possível carregar os pacientes"}
          detail={denied ? "Peça para um colega vincular você à equipe de cuidado." : "Verifique sua conexão e tente novamente."}
          action={<Button onClick={() => void query.refetch()}>Tentar novamente</Button>}
        />
      ) : null}
      {query.isSuccess && query.data.items.length === 0 ? (
        <Status
          title={q ? "Nenhum paciente encontrado" : isShared(clinic) ? "Nenhum paciente na sua equipe" : "Nenhum paciente adicionado"}
          detail={q ? "Tente outro nome ou limpe a busca." : isShared(clinic) ? "Os pacientes em que você está na equipe de cuidado aparecem aqui." : "Adicione seu primeiro paciente para registrar suas sessões"}
        />
      ) : null}
      {query.data && query.data.items.length > 0 ? (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="text-left text-sm text-quiet">
              <tr>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Nascimento</th>
                <th className="px-6 py-3 font-medium">Diagnóstico</th>
                <th className="px-6 py-3 font-medium">Situação</th>
              </tr>
            </thead>
            <tbody>
              {query.data.items.map((patient) => (
                <tr key={patient.id} className="border-t border-line hover:bg-blotter">
                  <td className="px-6 py-2 font-medium">
                    <Link to={`/pacientes/${patient.id}`} className="inline-flex min-h-11 items-center gap-3">
                      <PatientAvatar firstName={patient.firstName} lastName={patient.lastName} avatarUrl={patient.avatarUrl} />
                      <span>{fullName(patient)}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-grey">{formatBirthday(patient.birthday)}</td>
                  <td className="px-6 py-4 text-grey">{labelOf(diagnoses, patient.diagnosis)}</td>
                  <td className="px-6 py-4">
                    <span className={patient.status === "ACTIVE" ? "font-medium text-ink" : "text-quiet"}>
                      {patient.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    </span>
                  </td>
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
