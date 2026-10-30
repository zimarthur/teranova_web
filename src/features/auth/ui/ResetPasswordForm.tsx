import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset, resetPassword, validateResetToken } from "@/features/auth/api/auth";
import { sessionStore } from "@/shared/api/sessionStore";
import { Button, ErrorText, Field, inputClass } from "@/shared/ui/form";

export const ResetPasswordForm = ({ step }: { step: "email" | "code" | "password" }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(sessionStore.getResetEmail() ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      if (step === "email") {
        await requestPasswordReset(email.trim());
        sessionStore.setResetEmail(email.trim());
        navigate("/recuperar-senha/codigo");
        return;
      }
      if (step === "code") {
        const stored = sessionStore.getResetEmail() ?? email;
        await validateResetToken(stored, code.trim());
        navigate("/recuperar-senha/nova");
        return;
      }
      if (password.length < 6) return setError("A senha deve ter no mínimo 6 caracteres");
      if (password !== confirm) return setError("As senhas não coincidem");
      const stored = sessionStore.getResetEmail() ?? "";
      await resetPassword(stored, code.trim() || sessionStorage.getItem("teranova.resetCode") || "", password);
      sessionStore.setResetEmail(null);
      navigate("/entrar");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível continuar");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {step === "email" ? (
        <>
          <p className="text-sm text-grey">Não se preocupe! Insira o e-mail da sua conta e enviaremos um código para redefinir sua senha.</p>
          <Field label="E-mail"><input className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
        </>
      ) : null}
      {step === "code" ? (
        <Field label="Código">
          <input className={inputClass} value={code} onChange={(event) => {
            setCode(event.target.value);
            sessionStorage.setItem("teranova.resetCode", event.target.value);
          }} />
        </Field>
      ) : null}
      {step === "password" ? (
        <>
          <Field label="Nova senha"><input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></Field>
          <Field label="Confirme a senha"><input className={inputClass} type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} /></Field>
        </>
      ) : null}
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button type="submit">{step === "password" ? "Redefinir senha" : "Continuar"}</Button>
    </form>
  );
};
