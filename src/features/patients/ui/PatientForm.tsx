import type { FormEvent } from "react";
import { useState } from "react";
import {
  birthdayError,
  conditions,
  diagnoses,
  genders,
  type Patient,
} from "@/entities/patient/model";
import { Button, ErrorText, Field, inputClass } from "@/shared/ui/form";

export type PatientDraft = {
  firstName: string;
  lastName: string;
  gender: string;
  birthday: string;
  diagnosis: string;
  additionalConditions: string[];
};

const empty: PatientDraft = {
  firstName: "",
  lastName: "",
  gender: "FEMININE",
  birthday: "",
  diagnosis: "NOT_INFORMED",
  additionalConditions: [],
};

export const PatientForm = ({
  initial,
  onSubmit,
}: {
  initial?: Patient;
  onSubmit: (draft: PatientDraft) => Promise<void>;
}) => {
  const [draft, setDraft] = useState<PatientDraft>(
    initial
      ? {
          ...empty,
          firstName: initial.firstName,
          lastName: initial.lastName,
          gender: initial.gender,
          birthday: new Date(initial.birthday).toLocaleDateString("pt-BR"),
          diagnosis: initial.diagnosis,
          additionalConditions: initial.additionalConditions,
        }
      : empty,
  );
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.firstName.trim()) return setError("Informe o nome");
    if (!draft.lastName.trim()) return setError("Informe o sobrenome");
    const dateError = birthdayError(draft.birthday);
    if (dateError) return setError(dateError);
    if (!draft.diagnosis) return setError("Informe o diagnóstico");
    setError(null);
    await onSubmit(draft);
  };

  return (
    <form onSubmit={submit} className="sheet grid gap-4 p-6 md:grid-cols-2">
      <Field label="Nome"><input className={inputClass} value={draft.firstName} onChange={(event) => setDraft({ ...draft, firstName: event.target.value })} /></Field>
      <Field label="Sobrenome"><input className={inputClass} value={draft.lastName} onChange={(event) => setDraft({ ...draft, lastName: event.target.value })} /></Field>
      <Field label="Data de nascimento"><input className={inputClass} placeholder="dd/MM/aaaa" value={draft.birthday} onChange={(event) => setDraft({ ...draft, birthday: event.target.value })} /></Field>
      <Field label="Gênero">
        <select className={inputClass} value={draft.gender} onChange={(event) => setDraft({ ...draft, gender: event.target.value })}>
          {genders.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
        </select>
      </Field>
      <Field label="Diagnóstico">
        <select className={inputClass} value={draft.diagnosis} onChange={(event) => setDraft({ ...draft, diagnosis: event.target.value })}>
          {diagnoses.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
        </select>
      </Field>
      <fieldset className="md:col-span-2">
        <legend className="text-sm font-medium">Condições adicionais</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {conditions.map(([code, label]) => (
            <label key={code} className="flex min-h-11 items-start gap-3 text-sm leading-6">
              <input
                type="checkbox"
                className="mt-1 size-4 shrink-0"
                checked={draft.additionalConditions.includes(code)}
                onChange={() => {
                  const has = draft.additionalConditions.includes(code);
                  setDraft({
                    ...draft,
                    additionalConditions: has
                      ? draft.additionalConditions.filter((item) => item !== code)
                      : [...draft.additionalConditions, code],
                  });
                }}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {error ? <div className="md:col-span-2"><ErrorText>{error}</ErrorText></div> : null}
      <div className="md:col-span-2 flex justify-end"><Button type="submit">Salvar</Button></div>
    </form>
  );
};
