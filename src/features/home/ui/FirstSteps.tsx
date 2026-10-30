import { Link } from "react-router-dom";
import type { NewUserSteps } from "@/entities/user/model";

const items = (steps: NewUserSteps) => [
  { title: "Criar conta", done: steps.account, hint: null, to: null },
  { title: "Adicionar paciente", done: steps.patient, hint: "Cadastre a primeira pessoa", to: "/pacientes/novo" },
  { title: "Criar nova sessão", done: steps.session, hint: "Grave o primeiro atendimento", to: "/sessoes/nova" },
];

export const FirstSteps = ({ steps }: { steps: NewUserSteps | undefined }) => {
  if (!steps || (steps.account && steps.patient && steps.session)) return null;
  const list = items(steps);
  const completed = [steps.account, steps.patient, steps.session].filter(Boolean).length;
  const current = !steps.account ? 0 : !steps.patient ? 1 : 2;
  return (
    <section className="sheet px-5 py-4">
      <h2 className="text-base font-semibold">Primeiros passos, {completed} de 3</h2>
      <ol className="mt-4">
        {list.map((item, index) => {
          const active = index === current && !item.done;
          const body = (
            <>
              <span className="w-6 shrink-0 text-quiet" aria-hidden="true">
                {index + 1}
              </span>
              <span className={item.done ? "text-quiet line-through" : "font-medium text-ink"}>{item.title}</span>
              {active && item.hint ? <span className="text-quiet">{item.hint}</span> : null}
            </>
          );
          return (
            <li key={item.title} className={active ? "border-l-2 border-brass" : "border-l-2 border-transparent"}>
              {item.to && !item.done ? (
                <Link to={item.to} className="flex min-h-11 flex-wrap items-baseline gap-x-4 gap-y-1 py-2 pl-4">
                  {body}
                </Link>
              ) : (
                <div className="flex min-h-11 flex-wrap items-baseline gap-x-4 py-2 pl-4">{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
};
