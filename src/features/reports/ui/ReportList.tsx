import { Link } from "react-router-dom";
import { reportStatusLabel, type ReportListItem } from "@/entities/report/model";

export const ReportList = ({ items }: { items: ReportListItem[] }) => (
  <ul className="grid gap-3 md:grid-cols-2">
    {items.map((item) => (
      <li key={item.id}>
        <Link to={`/relatorios/${item.id}`} className="sheet block min-h-11 p-5 hover:border-soil">
          <p className="font-semibold">{item.patientName || "Paciente"}</p>
          <p className="mt-1 text-sm text-grey">{reportStatusLabel(item.status)}</p>
        </Link>
      </li>
    ))}
  </ul>
);
