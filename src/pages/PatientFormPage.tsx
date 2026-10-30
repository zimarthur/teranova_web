import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { parseBirthday } from "@/entities/patient/model";
import { PatientForm, type PatientDraft } from "@/features/patients/ui/PatientForm";
import { createPatient, getPatient, updatePatient } from "@/features/patients/api/patients";
import { PlanLimitDialog } from "@/features/billing/ui/PlanLimitDialog";
import { queryClient } from "@/shared/api/queryClient";
import { queryKeys } from "@/shared/api/queryKeys";
import { useClinics } from "@/features/clinic/api/clinics";
import { useState } from "react";

export const PatientFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const clinics = useClinics();
  const clinicId = clinics.data?.selectedId ?? "";
  const existing = useQuery({
    queryKey: queryKeys.patient(clinicId, id ?? "new"),
    queryFn: () => getPatient(id!),
    enabled: Boolean(id && clinicId),
  });
  const [limit, setLimit] = useState<unknown>(null);

  const onSubmit = async (draft: PatientDraft) => {
    const birthday = parseBirthday(draft.birthday);
    if (!birthday) return;
    const body = {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      gender: draft.gender,
      birthday,
      diagnosis: draft.diagnosis,
      additionalConditions: draft.additionalConditions,
    };
    try {
      if (id) {
        await updatePatient(id, { ...body, status: existing.data?.status ?? "ACTIVE" });
        navigate(`/pacientes/${id}`);
        return;
      }
      const saved = await createPatient(body);
      await queryClient.invalidateQueries({ queryKey: queryKeys.patients(clinicId, "") });
      navigate(`/pacientes/${saved.id}`);
    } catch (error) {
      setLimit(error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">{id ? "Editar paciente" : "Novo paciente"}</h1>
      {id && existing.isPending ? <p>Carregando…</p> : <PatientForm initial={existing.data} onSubmit={onSubmit} />}
      <PlanLimitDialog error={limit} onClose={() => setLimit(null)} />
    </div>
  );
};
