import type { BillingCycle, PlanOffer } from "@/entities/plan/model";
import { http } from "@/shared/api/http";

export const startCheckout = (planCode: PlanOffer["code"], billingCycle: BillingCycle) =>
  http<{ updated?: boolean; checkoutUrl?: string | null }>("/billing/checkout-session", {
    method: "POST",
    clinic: false,
    body: { planCode, billingCycle },
  });

export const startPortal = () =>
  http<{ portalUrl?: string }>("/billing/portal-session", {
    method: "POST",
    clinic: false,
    body: {},
  });
