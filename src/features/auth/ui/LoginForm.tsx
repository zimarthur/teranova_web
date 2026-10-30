import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/features/auth/api/auth";
import { queryClient } from "@/shared/api/queryClient";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button, ErrorText, Field, inputClass } from "@/shared/ui/form";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!email.trim()) return setError("Informe o email");
    if (!password) return setError("Informe a senha");
    setPending(true);
    try {
      await login(email.trim(), password);
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
      navigate("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Credenciais inválidas");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="E-mail">
        <input className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} />
      </Field>
      <Field label="Senha">
        <input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </Field>
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button type="submit" disabled={pending}>Entrar</Button>
      <div className="flex justify-between text-sm">
        <Link to="/criar-conta" className="text-brand">Criar conta</Link>
        <Link to="/recuperar-senha" className="text-brand">Esqueceu sua senha?</Link>
      </div>
    </form>
  );
};
