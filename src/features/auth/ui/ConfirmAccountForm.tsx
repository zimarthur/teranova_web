import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmAccount, resendConfirmation, useAccount } from "@/features/auth/api/auth";
import { queryClient } from "@/shared/api/queryClient";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button, ErrorText, Field, inputClass } from "@/shared/ui/form";

export const ConfirmAccountForm = () => {
  const navigate = useNavigate();
  const account = useAccount();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await confirmAccount(code.trim());
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
      navigate("/onboarding");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Código inválido ou expirado");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-sm text-grey">Informe o código de segurança enviado ao seu e-mail.</p>
      <Field label="Código">
        <input className={inputClass} value={code} onChange={(event) => setCode(event.target.value)} />
      </Field>
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button type="submit">Confirmar</Button>
      <button
        type="button"
        className="text-sm text-brand"
        onClick={() => account.data?.email && void resendConfirmation(account.data.email)}
      >
        Pedir o código de novo
      </button>
    </form>
  );
};
