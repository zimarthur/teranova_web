import { useLocation } from "react-router-dom";
import { ResetPasswordForm } from "@/features/auth/ui/ResetPasswordForm";
import { AuthFrame } from "@/shared/ui/AuthFrame";

export const ResetPasswordPage = () => {
  const { pathname } = useLocation();
  const step = pathname.endsWith("/codigo") ? "code" : pathname.endsWith("/nova") ? "password" : "email";
  return (
    <AuthFrame title="Esqueceu sua senha?" subtitle="Vamos trocar a senha sem sair do computador.">
      <ResetPasswordForm step={step} />
    </AuthFrame>
  );
};
