import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fullName, specialtyLabel } from "@/entities/user/model";
import { formatBirthday, labelOf, diagnoses, genders, conditions, type Patient } from "@/entities/patient/model";
import { getInsights, updatePatient, uploadPatientAvatar } from "@/features/patients/api/patients";
import { listSessions } from "@/features/sessions/api/sessions";
import { formatClock, type SessionSummary } from "@/entities/session/model";
import { queryKeys } from "@/shared/api/queryKeys";
import { PatientDocuments } from "@/features/patients/ui/PatientDocuments";
import { CareTeam } from "@/features/patients/ui/CareTeam";
import { Button, ErrorText, secondaryActionClass, primaryActionClass } from "@/shared/ui/form";
import { PatientAvatar } from "@/features/patients/ui/PatientAvatar";
import { Shimmer } from "@/shared/ui/Shimmer";
import { useQueryClient } from "@tanstack/react-query";

const sessionStatusLabel = (status: string) => {
  if (status === "DONE") return "Concluída";
  if (status === "PENDING") return "Não enviada";
  if (status === "ERROR") return "Erro";
  if (status === "RECORD_RECEIVED" || status === "TRANSCRIBED" || status === "RUNNING_AI_PIPELINE") return "Processando";
  return "Em andamento";
};

const PatientSessions = ({
  loading,
  fetching,
  error,
  onRetry,
  items,
  hasMore,
  onMore,
  canWrite,
  patientId,
}: {
  loading: boolean;
  fetching: boolean;
  error: string | null;
  onRetry: () => void;
  items: SessionSummary[];
  hasMore: boolean;
  onMore: () => void;
  canWrite: boolean;
  patientId: string;
}) => (
  <section className="sheet overflow-hidden">
    {loading ? (
      <div className="space-y-2 p-6">
        <Shimmer className="h-11 w-full" />
        <Shimmer className="h-11 w-full" />
        <Shimmer className="h-11 w-full" />
      </div>
    ) : null}
    {error ? (
      <div className="p-6">
        <p className="text-sm text-quiet">{error}</p>
        <div className="mt-3"><Button tone="ghost" onClick={onRetry}>Tentar novamente</Button></div>
      </div>
    ) : null}
    {!loading && !error && items.length === 0 ? (
      <div className="px-6 py-8">
        <p className="max-w-prose text-base leading-7 text-quiet">Nenhuma sessão deste paciente.</p>
        {canWrite ? <Link to={`/sessoes/nova?paciente=${patientId}`} className={`${primaryActionClass} mt-4`}>Nova sessão</Link> : null}
      </div>
    ) : null}
    {items.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="text-grey">
            <tr>
                <th className="px-6 py-3 font-medium">Quando</th>
                <th className="px-6 py-3 font-medium">Especialidade</th>
                <th className="px-6 py-3 font-medium">Terapeuta</th>
                <th className="px-6 py-3 font-medium">Atividades</th>
                <th className="px-6 py-3 font-medium">Situação</th>
            </tr>
          </thead>
          <tbody>
            {items.map((session) => (
              <tr key={session.id} className="border-t border-grey-2 hover:bg-surface">
                <td className="px-6 py-1">
                  <Link to={`/sessoes/${session.id}`} className="inline-flex min-h-11 flex-col items-start justify-center tabular-nums">
                    <span className="font-medium text-ink">{new Date(session.start).toLocaleDateString("pt-BR")}</span>
                    <span className="text-quiet">{formatClock(session.start)} – {formatClock(session.end)}</span>
                  </Link>
                </td>
                <td className="px-6 py-3 text-quiet">{specialtyLabel(session.specialty)}</td>
                <td className="px-6 py-3 text-quiet">{session.therapist ? fullName(session.therapist) || "Não informado" : "Não informado"}</td>
                <td className="px-6 py-3">
                  {(session.chips ?? []).filter((chip) => chip.label.trim()).length > 0 ? (
                    <ul className="flex min-w-40 max-w-xs flex-wrap gap-2">
                      {session.chips?.filter((chip) => chip.label.trim()).map((chip) => (
                        <li key={chip.label} className="whitespace-nowrap rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">
                          {chip.label}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-quiet">Nenhuma</span>
                  )}
                </td>
                <td className={`px-6 py-3 ${session.status === "ERROR" ? "text-danger" : "text-quiet"}`}>{sessionStatusLabel(session.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {fetching ? (
          <div className="border-t border-grey-2 px-6 py-3">
            <Shimmer className="h-11 w-full" />
          </div>
        ) : null}
        {hasMore ? (
          <div className="border-t border-grey-2 px-6 py-4">
            <Button tone="ghost" disabled={fetching} onClick={onMore}>{fetching ? "Carregando" : "Carregar mais"}</Button>
          </div>
        ) : null}
      </div>
    ) : null}
  </section>
);

export const PatientChart = ({
  patient,
  clinicId,
  personal,
  onCareTeam,
  canManageCareTeam,
  canReactivate,
}: {
  patient: Patient;
  clinicId: string;
  personal: boolean;
  onCareTeam: boolean;
  canManageCareTeam: boolean;
  canReactivate: boolean;
}) => {
  const queryClient = useQueryClient();
  const active = patient.status === "ACTIVE";
  const canWrite = (personal || onCareTeam) && active;
  const insights = useQuery({
    queryKey: queryKeys.insights(clinicId, patient.id),
    queryFn: () => getInsights(patient.id),
  });
  const [sessionPage, setSessionPage] = useState(1);
  const sessions = useQuery({
    queryKey: [...queryKeys.patientSessions(clinicId, patient.id), sessionPage],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const first = await listSessions({ page: 1, patientIds: [patient.id] });
      if (sessionPage === 1) return first;
      const pages = await Promise.all(
        Array.from({ length: sessionPage }, (_, index) => listSessions({ page: index + 1, patientIds: [patient.id] })),
      );
      return {
        items: pages.flatMap((entry) => entry.items),
        hasMore: pages.at(-1)?.hasMore ?? false,
      };
    },
  });

  const tabs = [
    "Dados",
    ...(!personal ? ["Equipe"] : []),
    "Sessões",
    ...(personal || onCareTeam ? ["Documentos"] : []),
  ];
  const [tab, setTab] = useState("Dados");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  const refreshPatient = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.patient(clinicId, patient.id) }),
      queryClient.invalidateQueries({ queryKey: ["patients", clinicId] }),
    ]);

  const changePhoto = async (file: File | null) => {
    if (!file) return;
    setPhotoBusy(true);
    setPhotoError(null);
    try {
      await uploadPatientAvatar(patient.id, file);
      await refreshPatient();
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "A foto deve ser JPEG, PNG ou WebP de até 5 MB.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const toggleStatus = async () => {
    await updatePatient(patient.id, {
      firstName: patient.firstName,
      lastName: patient.lastName,
      gender: patient.gender,
      birthday: patient.birthday,
      diagnosis: patient.diagnosis,
      additionalConditions: patient.additionalConditions,
      status: active ? "INACTIVE" : "ACTIVE",
    });
    await queryClient.invalidateQueries({ queryKey: queryKeys.patient(clinicId, patient.id) });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="relative w-fit">
            <PatientAvatar firstName={patient.firstName} lastName={patient.lastName} avatarUrl={patient.avatarUrl} size="lg" />
            {canWrite ? (
              <label className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-grey-2 bg-white text-brand">
                <span className="sr-only">{patient.avatarUrl ? "Trocar foto" : "Adicionar foto"}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M13.5 6.5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={photoBusy}
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    event.target.value = "";
                    void changePhoto(file);
                  }}
                />
              </label>
            ) : null}
          </div>
          {photoError ? <div className="mt-2"><ErrorText>{photoError}</ErrorText></div> : null}
          <h1 className="mt-3 font-display text-4xl font-medium leading-tight">{patient.firstName} {patient.lastName}</h1>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-quiet">Gênero</dt>
              <dd className="font-medium">{labelOf(genders, patient.gender)}</dd>
            </div>
            <div>
              <dt className="text-quiet">Nascimento</dt>
              <dd className="font-medium">{formatBirthday(patient.birthday)}</dd>
            </div>
            <div>
              <dt className="text-quiet">Situação</dt>
              <dd className="font-medium">{active ? "Ativo" : "Inativo"}</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-wrap gap-2">
          {canWrite ? <Link to={`/pacientes/${patient.id}/editar`} className={secondaryActionClass}>Editar paciente</Link> : null}
          {canWrite ? <Link to={`/sessoes/nova?paciente=${patient.id}`} className={primaryActionClass}>Nova sessão</Link> : null}
        </div>
      </header>
      <div className="flex gap-1 border-b border-line" role="tablist" aria-label="Ficha do paciente">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={`min-h-11 border-b-2 px-4 text-sm font-medium ${tab === item ? "border-brass text-ink" : "border-transparent text-quiet"}`}
          >
            {item === "Equipe" ? "Equipe de cuidado" : item}
          </button>
        ))}
      </div>
      {tab === "Dados" ? (
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="sheet p-6">
            <h2 className="font-semibold">Dados</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-quiet">Diagnóstico</dt><dd className="mt-1 font-medium">{labelOf(diagnoses, patient.diagnosis)}</dd></div>
              <div><dt className="text-quiet">Condições</dt><dd className="mt-1 font-medium">{patient.additionalConditions.map((item) => labelOf(conditions, item)).join(", ") || "Nenhuma"}</dd></div>
            </dl>
            {canReactivate || canWrite ? (
              <div className="mt-6"><Button tone="ghost" onClick={() => void toggleStatus()}>{active ? "Inativar" : "Reativar"}</Button></div>
            ) : null}
          </div>
          <div className="sheet p-6">
            <h2 className="font-semibold">Panorama das sessões</h2>
            <p className="mt-3 text-base">{insights.data ? `${insights.data.totalSessions} sessões registradas` : "Carregando o panorama"}</p>
            <ul className="mt-3 space-y-1 text-sm text-quiet">
              {insights.data?.bySpecialty.map((item) => (
                <li key={item.specialty ?? "none"}>{specialtyLabel(item.specialty)}, {item.count} {item.count === 1 ? "sessão" : "sessões"}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
      {tab === "Equipe" && !personal ? <CareTeam patient={patient} canManage={canManageCareTeam} /> : null}
      {tab === "Sessões" ? (
        <PatientSessions
          loading={sessions.isPending && !sessions.data}
          fetching={sessions.isFetching}
          error={sessions.isError ? (sessions.error instanceof Error ? sessions.error.message : "Não foi possível carregar as sessões") : null}
          onRetry={() => void sessions.refetch()}
          items={sessions.data?.items ?? []}
          hasMore={sessions.data?.hasMore ?? false}
          onMore={() => setSessionPage((value) => value + 1)}
          canWrite={canWrite}
          patientId={patient.id}
        />
      ) : null}
      {tab === "Documentos" && (personal || onCareTeam) ? <PatientDocuments patientId={patient.id} canMutate={canWrite} /> : null}
    </div>
  );
};
