import { Navigate, Outlet, useLocation } from "react-router-dom";
import { accountStage } from "@/entities/user/model";
import { useAccount, useHasSession } from "@/features/auth/api/auth";

export const RequireAuth = () => {
  const location = useLocation();
  const hasSession = useHasSession();
  const account = useAccount();

  if (!hasSession) return <Navigate to="/entrar" replace />;
  if (account.isPending) return <p className="p-8 text-grey">Verificando acesso…</p>;
  if (account.isError || !account.data) return <Navigate to="/entrar" replace />;

  const stage = accountStage(account.data, true);
  if (stage === "unconfirmed" && location.pathname !== "/confirmar-conta") {
    return <Navigate to="/confirmar-conta" replace />;
  }
  if (stage === "onboarding" && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
  if (stage === "ready" && (location.pathname === "/confirmar-conta" || location.pathname === "/onboarding")) {
    return <Navigate to="/" replace />;
  }
  if (stage !== "ready" && location.pathname !== "/confirmar-conta" && location.pathname !== "/onboarding") {
    return <Navigate to={stage === "unconfirmed" ? "/confirmar-conta" : "/onboarding"} replace />;
  }
  return <Outlet />;
};
