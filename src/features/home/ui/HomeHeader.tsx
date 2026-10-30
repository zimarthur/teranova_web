import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { clinicName, type Clinic } from "@/entities/clinic/model";
import { fullName, greetingFor, planOf, type Therapist } from "@/entities/user/model";
import { selectClinic } from "@/features/clinic/api/clinics";

export const HomeHeader = ({
  user,
  clinics,
  selected,
}: {
  user: Therapist;
  clinics: Clinic[];
  selected: Clinic | null;
}) => {
  const queryClient = useQueryClient();
  const greeting = `${greetingFor(new Date())}${user.firstName ? `, ${user.firstName}!` : ""}`;
  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <p className="text-2xl font-semibold">{greeting}</p>
        {selected ? (
          <label className="mt-1 block text-sm text-grey">
            <span className="sr-only">Clínica</span>
            <select
              className="bg-transparent font-medium text-ink"
              value={selected.id}
              onChange={(event) => selectClinic(event.target.value, queryClient)}
            >
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>{clinicName(clinic)}</option>
              ))}
            </select>
          </label>
        ) : null}
        <p className="text-xs text-grey">{fullName(user)} · {planOf(user)}</p>
      </div>
      <Link to="/configuracoes" className="rounded-xl border border-grey-2 bg-white px-3 py-2 text-sm">Configurações</Link>
    </header>
  );
};
