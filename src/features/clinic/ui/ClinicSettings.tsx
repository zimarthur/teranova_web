import { Link } from "react-router-dom";
import type { Clinic } from "@/entities/clinic/model";

export const ClinicSettings = ({ clinic }: { clinic: Clinic }) => (
  <section className="sheet p-6">
    <h2 className="font-semibold">Clínica</h2>
    <p className="text-sm text-brand">{clinic.name}</p>
    <p className="text-sm">CNPJ: {clinic.cnpj}</p>
    <p className="text-sm">Endereço: {clinic.address}</p>
    <Link to="/configuracoes/terapeutas" className="mt-4 inline-flex min-h-11 items-center text-sm font-medium underline">Gestão de terapeutas</Link>
  </section>
);
