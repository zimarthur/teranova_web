import { OnboardingForm } from "@/features/onboarding/ui/OnboardingForm";
import { AuthFrame } from "@/shared/ui/AuthFrame";

export const OnboardingPage = () => (
  <AuthFrame title="Finalize seu cadastro" subtitle="Nome, sobrenome e especialidade antes de abrir o consultório.">
    <OnboardingForm />
  </AuthFrame>
);
