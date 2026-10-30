import { FirstSteps } from "@/features/home/ui/FirstSteps";
import { HomeShortcuts } from "@/features/home/ui/HomeShortcuts";
import { RecentSessions } from "@/features/home/ui/RecentSessions";
import { UpcomingBirthdays } from "@/features/home/ui/UpcomingBirthdays";
import { useAccount } from "@/features/auth/api/auth";
import { useClinics } from "@/features/clinic/api/clinics";
import { PageShimmer } from "@/shared/ui/Shimmer";
import { Status } from "@/shared/ui/form";

export const HomePage = () => {
  const account = useAccount();
  const clinics = useClinics();
  const user = account.data;
  const selected = clinics.data?.clinics.find((clinic) => clinic.id === clinics.data?.selectedId) ?? null;

  if (account.isPending || clinics.isPending) return <PageShimmer />;
  if (!user) return <Status title="Não foi possível carregar o início" detail="Atualize a página para tentar de novo." />;

  return (
    <div className="flex flex-col gap-8">
      <HomeShortcuts />
      <FirstSteps steps={user.newUserSteps} />
      {selected ? (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <RecentSessions userId={user.id} clinicId={selected.id} />
          <UpcomingBirthdays clinicId={selected.id} />
        </div>
      ) : (
        <Status title="Nenhuma clínica selecionada" detail="Escolha uma clínica na barra superior para ver as sessões e os aniversários." />
      )}
    </div>
  );
};
