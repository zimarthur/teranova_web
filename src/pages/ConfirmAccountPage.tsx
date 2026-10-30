import { ConfirmAccountForm } from "@/features/auth/ui/ConfirmAccountForm";
import { AuthFrame } from "@/shared/ui/AuthFrame";

export const ConfirmAccountPage = () => (
  <AuthFrame title="Confirmar conta" subtitle="Informe o código de segurança enviado ao seu e-mail.">
    <ConfirmAccountForm />
  </AuthFrame>
);
