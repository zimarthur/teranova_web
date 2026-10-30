import { Link, useNavigate } from "react-router-dom";
import { isShared } from "@/entities/clinic/model";
import { planOf } from "@/entities/user/model";
import { logout, useAccount } from "@/features/auth/api/auth";
import { useClinics } from "@/features/clinic/api/clinics";
import { queryClient } from "@/shared/api/queryClient";

const Item = ({ to, title, detail }: { to: string; title: string; detail?: string }) => (
  <Link to={to} className="flex min-h-11 items-center justify-between gap-4 rounded-md px-4 py-2 hover:bg-blotter">
    <span className="font-medium">{title}</span>
    {detail ? <span className="text-sm text-grey">{detail}</span> : null}
  </Link>
);

export const SettingsPage = () => {
  const account = useAccount();
  const clinics = useClinics();
  const navigate = useNavigate();
  const clinic = clinics.data?.clinics.find((item) => item.id === clinics.data?.selectedId) ?? null;
  const pending = clinics.data?.receivedInvitations.length ?? 0;
  const user = account.data;
  if (!user) return null;
  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_1fr]">
      <div>
        <h1 className="text-3xl font-semibold leading-tight">Configurações</h1>
      </div>
      <div className="lg:col-span-2 grid gap-6 lg:grid-cols-2">
        {isShared(clinic) && clinic ? (
          <section className="sheet p-2">
            <h2 className="px-4 pt-3 text-base font-semibold">Clínica</h2>
            <p className="px-4 py-2 text-sm font-medium text-brand">{clinic.name}</p>
            <Item to="/configuracoes/clinica" title="Informações da clínica" />
            <Item to="/configuracoes/terapeutas" title="Gestão de terapeutas" />
          </section>
        ) : (
          <section className="sheet p-2">
            <h2 className="px-4 pt-3 text-base font-semibold">Clínica</h2>
            <Item to="/configuracoes/clinica" title="Nova clínica" detail="Quando o plano permitir" />
          </section>
        )}
        <section className="sheet p-2">
          <h2 className="px-4 pt-3 text-base font-semibold">Minha conta</h2>
          <Item to="/configuracoes/conta" title="Detalhes da conta" />
          <Item to="/configuracoes/plano" title="Plano" detail={planOf(user)} />
          <Item to="/configuracoes/convites" title="Convites recebidos" detail={pending > 0 ? String(pending) : undefined} />
          <button
            type="button"
            className="min-h-11 w-full rounded-md px-4 py-3 text-left font-medium text-danger hover:bg-red-50"
            onClick={() => void logout().then(() => {
              queryClient.clear();
              navigate("/entrar");
            })}
          >
            Sair
          </button>
        </section>
      </div>
    </div>
  );
};
