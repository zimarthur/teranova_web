import { SignupForm } from "@/features/auth/ui/SignupForm";
import { AuthFrame } from "@/shared/ui/AuthFrame";

export const SignupPage = () => (
  <AuthFrame title="Criar conta" subtitle="O cadastro vale no aplicativo e neste consultório.">
    <SignupForm />
  </AuthFrame>
);
