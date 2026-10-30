import { useState } from "react";
import { formatBrl, planCatalog, type BillingCycle } from "@/entities/plan/model";
import { startCheckout } from "@/features/billing/api/billing";
import { Button, ErrorText } from "@/shared/ui/form";

export const PlanCompare = () => {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Planos</h1>
      <div className="flex gap-2 text-sm">
        <button type="button" aria-pressed={cycle === "monthly"} className={`min-h-11 rounded-md px-4 ${cycle === "monthly" ? "bg-soil text-sheet" : "border border-line bg-sheet"}`} onClick={() => setCycle("monthly")}>Mensal</button>
        <button type="button" aria-pressed={cycle === "annual"} className={`min-h-11 rounded-md px-4 ${cycle === "annual" ? "bg-soil text-sheet" : "border border-line bg-sheet"}`} onClick={() => setCycle("annual")}>Anual</button>
      </div>
      {planCatalog.map((plan) => {
        const price = cycle === "monthly" ? plan.monthly : plan.annualMonthly;
        return (
          <article key={plan.code} className="sheet p-6">
            <h2 className="font-semibold">{plan.name}</h2>
            <p className="text-sm text-grey">{plan.audience}</p>
            {price ? <p className="mt-2">{formatBrl(price)} / mês</p> : null}
            <ul className="mt-2 list-disc pl-5 text-sm">{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            {plan.code !== "BASIC" ? (
              <Button onClick={() => void startCheckout(plan.code, cycle).then((result) => {
                if (result.checkoutUrl) window.location.assign(result.checkoutUrl);
              }).catch((caught) => setError(caught instanceof Error ? caught.message : "Não foi possível abrir o checkout"))}>Contratar {plan.name}</Button>
            ) : null}
          </article>
        );
      })}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
};
