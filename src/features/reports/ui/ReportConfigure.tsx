import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fullName } from "@/entities/user/model";
import { reportPeriods, type ReportPeriod } from "@/entities/report/model";
import { listPatients } from "@/features/patients/api/patients";
import { createReport, previewReport } from "@/features/reports/api/reports";
import { PlanLimitDialog } from "@/features/billing/ui/PlanLimitDialog";
import { useClinics } from "@/features/clinic/api/clinics";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button, ErrorText, Field, Status, inputClass } from "@/shared/ui/form";

export const ReportConfigure = () => {
  const navigate = useNavigate();
  const clinics = useClinics();
  const clinicId = clinics.data?.selectedId ?? "";
  const patients = useQuery({
    queryKey: queryKeys.patients(clinicId, "reports"),
    queryFn: () => listPatients(1, ""),
    enabled: Boolean(clinicId),
  });
  const [patientId, setPatientId] = useState("");
  const [period, setPeriod] = useState<ReportPeriod>("LAST_30_DAYS");
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<unknown>(null);
  const preview = useQuery({
    queryKey: queryKeys.preview(clinicId, patientId, period),
    queryFn: () => previewReport({ patientId, periodPreset: period, therapistIds: [] }),
    enabled: Boolean(patientId),
  });

  const generate = async () => {
    if (!patientId) return setError("Selecione um paciente para continuar.");
    if (!preview.data) return setError("Aguarde o carregamento da prévia.");
    if (preview.data.totalEligibleSessions < 1) return setError("Não há sessões elegíveis no período selecionado.");
    if (selected.length === 0) return setError("Selecione ao menos um profissional.");
    try {
      const created = await createReport({ patientId, periodPreset: period, therapistIds: selected });
      navigate(`/relatorios/${created.id}`);
    } catch (caught) {
      setLimit(caught);
      setError(caught instanceof Error ? caught.message : "Não foi possível gerar o relatório");
    }
  };

  if (patients.isSuccess && patients.data.items.length === 0) {
    return <Status title="Nenhum paciente" detail="Cadastre um paciente antes de gerar um relatório de jornada." />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Configurar relatório</h1>
      <Field label="Paciente">
        <select className={inputClass} value={patientId} onChange={(event) => setPatientId(event.target.value)}>
          <option value="">Selecione</option>
          {patients.data?.items.map((patient) => <option key={patient.id} value={patient.id}>{fullName(patient)}</option>)}
        </select>
      </Field>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Período">
        {reportPeriods.map(([code, label]) => (
          <button key={code} type="button" aria-pressed={period === code} className={`min-h-11 rounded-md border px-4 text-sm ${period === code ? "border-soil bg-soil text-sheet" : "border-line bg-sheet"}`} onClick={() => setPeriod(code)}>{label}</button>
        ))}
      </div>
      {preview.data?.therapists.length === 0 ? <p className="text-sm text-grey">Nenhum profissional com sessões no período selecionado.</p> : null}
      <ul className="space-y-1 text-sm">
        {preview.data?.therapists.map((therapist) => (
          <li key={therapist.userId}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(therapist.userId)}
                onChange={() => setSelected((current) => current.includes(therapist.userId) ? current.filter((id) => id !== therapist.userId) : [...current, therapist.userId])}
              /> {therapist.name} · {therapist.sessionCount} sessões
            </label>
          </li>
        ))}
      </ul>
      <p className="text-sm text-grey">Este relatório é um apoio à análise profissional e não substitui o julgamento clínico.</p>
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button onClick={() => void generate()}>Gerar relatório</Button>
      <PlanLimitDialog error={limit} onClose={() => setLimit(null)} />
    </div>
  );
};
