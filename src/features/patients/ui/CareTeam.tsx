import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { specialtyLabel, fullName } from "@/entities/user/model";
import type { Patient } from "@/entities/patient/model";
import { fetchMembers, addCareTeam, removeCareTeam } from "@/features/clinic/api/members";
import { useClinics } from "@/features/clinic/api/clinics";
import { PatientAvatar } from "@/features/patients/ui/PatientAvatar";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button, ErrorText, Field, inputClass } from "@/shared/ui/form";
import { Shimmer } from "@/shared/ui/Shimmer";

const addedOn = (value: string | null | undefined) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("pt-BR");
};

export const CareTeam = ({ patient, canManage }: { patient: Patient; canManage: boolean }) => {
  const clinics = useClinics();
  const queryClient = useQueryClient();
  const clinicId = clinics.data?.selectedId ?? "";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const members = patient.careTeam ?? [];
  const roster = useQuery({
    queryKey: ["members", clinicId],
    queryFn: () => fetchMembers(clinicId),
    enabled: open && Boolean(clinicId),
  });

  const available = useMemo(() => {
    const onTeam = new Set(members.map((member) => member.userId));
    const term = query.trim().toLowerCase();
    return (roster.data ?? [])
      .filter((member) => member.status === "ACTIVE" && !onTeam.has(member.user.id))
      .filter((member) => {
        if (!term) return true;
        const name = fullName(member.user).toLowerCase();
        const specialty = specialtyLabel(member.user.specialty).toLowerCase();
        return name.includes(term) || specialty.includes(term);
      });
  }, [members, query, roster.data]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.patient(clinicId, patient.id) });

  const remove = async (userId: string) => {
    setRemovingId(userId);
    setMessage(null);
    try {
      await removeCareTeam(patient.id, userId);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível desvincular este terapeuta.");
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    searchRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open]);

  const add = async (userId: string) => {
    setAddingId(userId);
    setMessage(null);
    try {
      await addCareTeam(patient.id, userId);
      await refresh();
      setOpen(false);
      setQuery("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Você não tem permissão para esta ação nesta clínica.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section>
      {canManage ? (
        <div className="flex justify-end">
          <Button onClick={() => { setMessage(null); setOpen(true); }}>Adicionar terapeuta</Button>
        </div>
      ) : null}
      {members.length === 0 ? (
        <p className={`${canManage ? "mt-4" : ""} max-w-prose text-sm leading-6 text-quiet`}>Nenhum terapeuta vinculado a este paciente.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {members.map((member) => {
            const since = addedOn(member.createdAt);
            return (
              <li key={member.userId} className="sheet flex items-center gap-4 p-4">
                <PatientAvatar firstName={member.firstName ?? ""} lastName={member.lastName ?? ""} avatarUrl={member.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{fullName(member) || "Terapeuta"}</p>
                  <p className="mt-1 text-sm text-quiet">{specialtyLabel(member.specialty)}</p>
                  {since ? <p className="mt-1 text-sm text-quiet">Na equipe desde {since}</p> : null}
                </div>
                {canManage ? (
                  <button
                    type="button"
                    className="min-h-11 shrink-0 text-sm font-medium text-danger disabled:opacity-50"
                    disabled={removingId !== null}
                    onClick={() => void remove(member.userId)}
                  >
                    {removingId === member.userId ? "Desvinculando" : "Desvincular"}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
      {message && !open ? <div className="mt-3"><ErrorText>{message}</ErrorText></div> : null}
      {open ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/50 p-4" onMouseDown={() => setOpen(false)}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="sheet max-h-[80vh] w-full max-w-lg overflow-y-auto p-6"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id={titleId} className="text-lg font-semibold">Adicionar terapeuta</h2>
            <p className="mt-2 max-w-prose text-sm leading-6 text-quiet">Escolha um terapeuta ativo desta clínica.</p>
            <div className="mt-4">
              <Field label="Buscar">
                <input ref={searchRef} className={inputClass} value={query} onChange={(event) => setQuery(event.target.value)} />
              </Field>
            </div>
            {roster.isLoading ? (
              <div className="mt-4 space-y-2">
                <Shimmer className="h-14 w-full" />
                <Shimmer className="h-14 w-full" />
              </div>
            ) : null}
            {roster.isError ? (
              <div className="mt-4">
                <ErrorText>Não foi possível carregar os terapeutas.</ErrorText>
                <Button tone="ghost" onClick={() => void roster.refetch()}>Tentar novamente</Button>
              </div>
            ) : null}
            {roster.isSuccess && available.length === 0 ? (
              <p className="mt-4 text-sm leading-6 text-quiet">
                {query.trim() ? "Nenhum terapeuta encontrado." : "Todos os terapeutas ativos já estão nesta equipe."}
              </p>
            ) : null}
            {available.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-2">
                {available.map((member) => (
                  <li key={member.id}>
                    <button
                      type="button"
                      className="flex min-h-11 w-full items-center gap-3 rounded-xl px-2 text-left hover:bg-surface disabled:opacity-50"
                      disabled={addingId !== null}
                      onClick={() => void add(member.user.id)}
                    >
                      <PatientAvatar firstName={member.user.firstName ?? ""} lastName={member.user.lastName ?? ""} avatarUrl={member.user.avatarUrl} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{fullName(member.user) || member.user.email || "Terapeuta"}</span>
                        <span className="block truncate text-sm text-quiet">{specialtyLabel(member.user.specialty)}</span>
                      </span>
                      <span className="ml-auto shrink-0 text-sm font-semibold text-brand">{addingId === member.user.id ? "Vinculando" : "Vincular"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {message ? <div className="mt-3"><ErrorText>{message}</ErrorText></div> : null}
            <div className="mt-6 flex justify-end">
              <Button tone="ghost" onClick={() => setOpen(false)}>Fechar</Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};
