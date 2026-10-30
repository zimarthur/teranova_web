import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "@/features/auth/api/auth";
import { Button, ErrorText, Field, inputClass } from "@/shared/ui/form";

export const SignupForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !email.includes("@")) return setError("Email inválido");
    if (password.length < 6) return setError("A senha deve ter no mínimo 6 caracteres");
    if (password !== confirm) return setError("As senhas não coincidem");
    try {
      await signup(email.trim(), password);
      navigate("/confirmar-conta");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível criar a conta");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="E-mail"><input className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
      <Field label="Senha"><input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></Field>
      <Field label="Confirme a senha"><input className={inputClass} type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} /></Field>
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button type="submit">Criar conta</Button>
      <Link to="/entrar" className="text-sm text-brand">Já tenho conta</Link>
    </form>
  );
};
