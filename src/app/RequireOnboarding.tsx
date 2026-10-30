import { Navigate, Outlet } from "react-router-dom";
import { accountStage } from "@/entities/user/model";
import { useAccount, useHasSession } from "@/features/auth/api/auth";

export const RequireOnboarding = () => {
  const hasSession = useHasSession();
  const account = useAccount();
  if (!hasSession) return <Navigate to="/entrar" replace />;
  if (account.isPending) return <p className="p-8 text-grey">Verificando acesso…</p>;
  if (accountStage(account.data, true) !== "ready") return <Navigate to="/onboarding" replace />;
  return <Outlet />;
};
