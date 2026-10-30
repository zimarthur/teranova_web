import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fullName } from "@/entities/user/model";
import {
  combineDateTime,
  keepEndAfterStart,
  noteIsFilled,
  suggestedRange,
  toDateInput,
  toTimeInput,
} from "@/entities/session/model";
import { createSession } from "@/features/sessions/api/sessions";
import { listPatients } from "@/features/patients/api/patients";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button, ErrorText, Field, inputClass } from "@/shared/ui/form";
import { useClinics } from "@/features/clinic/api/clinics";

export const NewSessionFlow = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clinics = useClinics();
  const clinicId = clinics.data?.selectedId ?? "";
  const preset = useMemo(() => suggestedRange(new Date()), []);
  const [patientId, setPatientId] = useState(params.get("paciente") ?? "");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"patient" | "note" | "summary">(params.get("paciente") ? "note" : "patient");
  const [date, setDate] = useState(toDateInput(preset.start));
  const [start, setStart] = useState(toTimeInput(preset.start));
  const [end, setEnd] = useState(toTimeInput(preset.end));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const patients = useQuery({
    queryKey: queryKeys.patients(clinicId, "picker"),
    queryFn: () => listPatients(1, ""),
    enabled: Boolean(clinicId),
  });
  const patient = patients.data?.items.find((item) => item.id === patientId);

  const advanceNote = () => {
    if (!noteIsFilled(note)) {
      setError("A nota precisa ser preenchida");
      return;
    }
    setError(null);
    setStep("summary");
  };

  const changeStart = (value: string) => {
    const next = keepEndAfterStart(value, end, "start");
    setStart(next.start);
    setEnd(next.end);
  };
  const changeEnd = (value: string) => {
    const next = keepEndAfterStart(start, value, "end");
    setStart(next.start);
    setEnd(next.end);
  };

  const save = async () => {
    if (!patientId) return;
    setSaving(true);
    setError(null);
    try {
      const saved = await createSession({
        patientId,
        note,
        start: combineDateTime(date, start),
        end: combineDateTime(date, end),
      });
      await queryClient.invalidateQueries();
      navigate(`/sessoes/${saved.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível salvar. Tente novamente.");
      setSaving(false);
    }
  };

  const steps = [
    ["patient", "Paciente"],
    ["note", "Nota"],
    ["summary", "Resumo"],
  ] as const;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <ol className="flex gap-2 lg:flex-col" aria-label="Etapas da sessão">
        {steps.map(([id, label], index) => (
          <li key={id} className={`flex min-h-11 items-center gap-3 border-l-2 pl-3 text-sm ${step === id ? "border-brass font-semibold text-ink" : "border-transparent text-quiet"}`}>
            <span aria-hidden="true">{index + 1}</span>
            <span>{label}</span>
          </li>
        ))}
      </ol>
      <div className="sheet p-6">
      {step === "patient" ? (
        <>
          <h1 className="text-2xl font-semibold">Escolher paciente</h1>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {patients.data?.items.map((item) => (
              <li key={item.id}>
                <button type="button" className="min-h-11 w-full rounded-md border border-line bg-sheet p-4 text-left hover:border-soil" onClick={() => { setPatientId(item.id); setStep("note"); }}>
                  {fullName(item)}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {step === "note" ? (
        <>
          <h1 className="text-2xl font-semibold">Escrever a nota</h1>
          <p className="mt-1 text-sm text-grey">{patient ? fullName(patient) : "Paciente"}</p>
          <Field label="Nota da sessão">
            <textarea className={`${inputClass} min-h-72 py-3`} value={note} onChange={(event) => setNote(event.target.value)} placeholder="O que aconteceu neste atendimento" />
          </Field>
          {error ? <ErrorText>{error}</ErrorText> : null}
          <div className="mt-4 flex justify-end"><Button onClick={advanceNote}>Próximo</Button></div>
        </>
      ) : null}
      {step === "summary" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div>
            <h1 className="text-2xl font-semibold">Resumo</h1>
            <p className="mt-4 max-w-prose whitespace-pre-wrap text-base leading-7 text-ink">{note.trim()}</p>
            {error ? <ErrorText>{error}</ErrorText> : null}
          </div>
          <aside className="flex flex-col gap-3 sheet p-4 text-sm">
            <p className="font-semibold">{patient ? fullName(patient) : "Paciente"}</p>
            <label>Data <input className={inputClass} type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
            <label>Horário início <input className={inputClass} type="time" value={start} onChange={(event) => changeStart(event.target.value)} /></label>
            <label>Horário fim <input className={inputClass} type="time" value={end} onChange={(event) => changeEnd(event.target.value)} /></label>
            <Button onClick={() => void save()} disabled={saving}>Salvar</Button>
          </aside>
        </div>
      ) : null}
      </div>
    </div>
  );
};
