import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { specialties } from "@/entities/user/model";
import { submitOnboarding } from "@/features/auth/api/auth";
import { queryClient } from "@/shared/api/queryClient";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button, ErrorText, Field, inputClass } from "@/shared/ui/form";

export const OnboardingForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState<string | null>(null);
  const ready = firstName.trim() && lastName.trim() && specialty;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!ready) return;
    try {
      await submitOnboarding({ firstName: firstName.trim(), lastName: lastName.trim(), specialty });
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
      navigate("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível concluir");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Nome"><input className={inputClass} value={firstName} onChange={(event) => setFirstName(event.target.value)} /></Field>
      <Field label="Sobrenome"><input className={inputClass} value={lastName} onChange={(event) => setLastName(event.target.value)} /></Field>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Qual sua especialidade?</legend>
        {specialties.map(([code, label]) => (
          <label key={code} className="flex items-center gap-2 text-sm">
            <input type="radio" name="specialty" checked={specialty === code} onChange={() => setSpecialty(code)} />
            {label}
          </label>
        ))}
      </fieldset>
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button type="submit" disabled={!ready}>Iniciar</Button>
    </form>
  );
};
