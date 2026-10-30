import { LoginForm } from "@/features/auth/ui/LoginForm";
import { AuthFrame } from "@/shared/ui/AuthFrame";

export const LoginPage = () => (
  <AuthFrame title="Entrar" subtitle="Use a mesma conta do aplicativo Teranova.">
    <LoginForm />
  </AuthFrame>
);
