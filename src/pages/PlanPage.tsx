import { planOf } from "@/entities/user/model";
import { useAccount } from "@/features/auth/api/auth";
import { PlanCompare } from "@/features/billing/ui/PlanCompare";
import { SubscriptionPanel } from "@/features/billing/ui/SubscriptionPanel";
import { useEffect } from "react";
import { queryClient } from "@/shared/api/queryClient";
import { queryKeys } from "@/shared/api/queryKeys";

export const PlanPage = () => {
  const account = useAccount();
  const user = account.data;
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") {
        void queryClient.invalidateQueries({ queryKey: queryKeys.me });
      }
    };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, []);
  if (!user) return null;
  return <main className="mx-auto max-w-3xl px-6 py-8">{planOf(user) === "BASIC" ? <PlanCompare /> : <SubscriptionPanel user={user} />}</main>;
};
