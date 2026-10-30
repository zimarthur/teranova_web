import { reportStatusLabel, type ReportDetail as Detail } from "@/entities/report/model";
import { retryReport } from "@/features/reports/api/reports";
import { Button } from "@/shared/ui/form";

export const ReportDetail = ({ report, onChange }: { report: Detail; onChange: () => void }) => (
  <article className="flex flex-col gap-4">
    <h1 className="text-2xl font-semibold">{report.patientName || "Relatório de jornada"}</h1>
    <p className="text-sm text-grey">{reportStatusLabel(report.status)}</p>
    {report.status === "FAILED" ? (
      <>
        <p>{report.failureMessage || "Não foi possível gerar o relatório"}</p>
        <Button onClick={() => void retryReport(report.id).then(onChange)}>Tentar novamente</Button>
      </>
    ) : null}
    <h2 className="font-semibold">Seções do relatório</h2>
    {(report.sections ?? []).map((section) => (
      <section key={section.key} className="sheet p-5">
        <h3 className="font-medium">{section.title}</h3>
        <p className="mt-2 max-w-prose whitespace-pre-wrap text-base leading-7">{section.body || "Em geração"}</p>
      </section>
    ))}
  </article>
);
