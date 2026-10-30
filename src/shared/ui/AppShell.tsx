import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { logout, useAccount } from "@/features/auth/api/auth";
import { selectClinic, useClinics } from "@/features/clinic/api/clinics";
import { AccountMenu } from "@/shared/ui/AccountMenu";
import { ClinicSwitcher } from "@/shared/ui/ClinicSwitcher";
import { RouteProgress } from "@/shared/ui/RouteProgress";

const products = [
  { to: "/", label: "Início", end: true },
  { to: "/pacientes", label: "Pacientes", end: false },
  { to: "/sessoes", label: "Sessões", end: false },
  { to: "/relatorios", label: "Relatórios", end: false },
];

export const AppShell = () => {
  const account = useAccount();
  const clinics = useClinics();
  const navigate = useNavigate();
  const client = useQueryClient();
  const user = account.data;
  const selected = clinics.data?.clinics.find((clinic) => clinic.id === clinics.data?.selectedId) ?? null;
  const pending = clinics.data?.receivedInvitations.length ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-40 focus:bg-white focus:px-3 focus:py-2"
      >
        Ir para o conteúdo
      </a>
      <div className="relative sticky top-0 z-30">
        <header className="on-brand flex h-16 items-center gap-3 bg-brand px-4 text-white">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-9 w-9" />
            <p className="text-lg font-semibold">Teranova</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {clinics.data && selected ? (
              <ClinicSwitcher
                clinics={clinics.data.clinics}
                selectedId={selected.id}
                onSelect={(id) => selectClinic(id, client)}
              />
            ) : null}
            {user ? (
              <AccountMenu
                user={user}
                clinic={selected}
                pending={pending}
                onLogout={() =>
                  void logout().then(() => {
                    client.clear();
                    navigate("/entrar");
                  })
                }
              />
            ) : null}
          </div>
        </header>
        <RouteProgress />
      </div>
      <div className="grid flex-1 grid-cols-[220px_minmax(0,1fr)]">
        <aside className="sticky top-16 h-[calc(100vh-4rem)] border-r border-grey-2 bg-white">
          <nav className="flex flex-col gap-1 p-3" aria-label="Produtos">
            {products.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex min-h-11 items-center border-l-2 px-3 text-sm ${
                    isActive
                      ? "border-brand font-semibold text-ink"
                      : "border-transparent text-grey hover:text-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main id="conteudo" className="min-w-0 px-8 py-8 lg:px-12">
          <div className="max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
