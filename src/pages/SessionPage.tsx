import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/features/sessions/api/sessions";
import { SessionDetail } from "@/features/sessions/ui/SessionDetail";
import { useClinics } from "@/features/clinic/api/clinics";
import { queryKeys } from "@/shared/api/queryKeys";
import { Status } from "@/shared/ui/form";
import { PageShimmer } from "@/shared/ui/Shimmer";

export const SessionPage = () => {
  const { id = "" } = useParams();
  const clinics = useClinics();
  const clinicId = clinics.data?.selectedId ?? "";
  const query = useQuery({
    queryKey: queryKeys.session(clinicId, id),
    queryFn: () => getSession(id),
    enabled: Boolean(clinicId && id),
  });
  if (query.isError) {
    const message = query.error instanceof Error ? query.error.message : "Você não tem acesso a esta sessão.";
    return <main className="p-8"><Status title={message} /></main>;
  }
  if (!query.data) return <PageShimmer />;
  return <SessionDetail session={query.data} />;
};
