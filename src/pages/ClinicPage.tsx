import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isShared } from "@/entities/clinic/model";
import { createClinic } from "@/features/clinic/api/clinics";
import { ClinicSettings } from "@/features/clinic/ui/ClinicSettings";
import { PlanLimitDialog } from "@/features/billing/ui/PlanLimitDialog";
import { useClinics } from "@/features/clinic/api/clinics";
import { queryClient } from "@/shared/api/queryClient";
import { Button, Field, inputClass } from "@/shared/ui/form";

export const ClinicPage = () => {
  const clinics = useClinics();
  const navigate = useNavigate();
  const clinic = clinics.data?.clinics.find((item) => item.id === clinics.data?.selectedId) ?? null;
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");
  const [limit, setLimit] = useState<unknown>(null);
  if (!clinic) return null;
  if (!isShared(clinic)) {
    return (
      <main className="mx-auto max-w-xl px-6 py-8">
        <h1 className="text-2xl font-semibold">Nova clínica</h1>
        <form className="mt-4 flex flex-col gap-3" onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim() || !cnpj.trim() || !address.trim()) return;
          void createClinic({ name: name.trim(), cnpj: cnpj.trim(), address: address.trim() })
            .then(async () => {
              await queryClient.invalidateQueries();
              navigate("/configuracoes");
            })
            .catch((error) => setLimit(error));
        }}>
          <Field label="Nome da clínica">
            <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="CNPJ">
            <input className={inputClass} value={cnpj} onChange={(event) => setCnpj(event.target.value)} />
          </Field>
          <Field label="Endereço">
            <input className={inputClass} value={address} onChange={(event) => setAddress(event.target.value)} />
          </Field>
          <Button type="submit">Criar</Button>
        </form>
        <PlanLimitDialog error={limit} onClose={() => setLimit(null)} />
      </main>
    );
  }
  return <main className="mx-auto max-w-xl px-6 py-8"><ClinicSettings clinic={clinic} /></main>;
};
