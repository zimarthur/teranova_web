import { useState } from "react";
import type { SessionSummary } from "@/entities/session/model";
import { formatClock, formatWhen } from "@/entities/session/model";
import { fullName } from "@/entities/user/model";

const Notes = ({ title, content }: { title: string; content: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <article className="sheet p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-semibold">{title}</h2>
        {content ? (
          <button
            type="button"
            className="min-h-11 rounded-md border border-line px-3 text-sm font-medium"
            onClick={() => {
              void navigator.clipboard.writeText(content);
              setCopied(true);
            }}
          >
            {copied ? "Notas copiadas" : "Copiar notas"}
          </button>
        ) : null}
      </div>
      <p className="mt-4 max-w-prose whitespace-pre-wrap text-base leading-7 text-ink">{content}</p>
    </article>
  );
};

export const SessionDetail = ({ session }: { session: SessionSummary }) => (
  <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
    <aside>
      <p className="font-display text-5xl font-medium leading-none tabular-nums">{formatClock(session.start)}</p>
      <h1 className="mt-4 font-display text-3xl font-medium leading-tight">{session.patient ? fullName(session.patient) : "Paciente"}</h1>
      <p className="mt-3 text-sm text-quiet">{formatWhen(session.start)} até {formatWhen(session.end)}</p>
      {session.therapist ? <p className="mt-4 text-sm">Com {fullName(session.therapist)}</p> : null}
    </aside>
    <div className="flex flex-col gap-4">
      <Notes title="Suas anotações" content={session.notes ?? ""} />
      {session.structuredNotes ? <Notes title="Resumo estruturado" content={session.structuredNotes} /> : null}
    </div>
  </div>
);
