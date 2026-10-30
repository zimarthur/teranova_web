import { planOf, type Therapist } from "@/entities/user/model";
import { startPortal } from "@/features/billing/api/billing";
import { Button, ErrorText } from "@/shared/ui/form";
import { useState } from "react";

export const SubscriptionPanel = ({ user }: { user: Therapist }) => {
  const [error, setError] = useState<string | null>(null);
  const plan = planOf(user);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Assinatura</h1>
      <p className="mt-2">Plano: {plan}</p>
      <p className="text-sm text-grey">Ciclo: {user.subscription?.billingCycle === "annual" ? "Anual" : "Mensal"}</p>
      <Button onClick={() => void startPortal().then((result) => {
        if (result.portalUrl) window.location.assign(result.portalUrl);
        else setError("Não foi possível abrir o portal de assinatura");
      }).catch(() => setError("Não foi possível abrir o portal de assinatura"))}>Gerenciar assinatura</Button>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
};
