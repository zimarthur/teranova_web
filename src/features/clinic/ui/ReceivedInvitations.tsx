import { useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptInvitation, declineInvitation, fetchClinics } from "@/features/clinic/api/clinics";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button } from "@/shared/ui/form";

export const ReceivedInvitations = () => {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: queryKeys.clinics, queryFn: fetchClinics });
  const items = query.data?.receivedInvitations ?? [];
  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.clinics });
  return (
    <div>
      <h1 className="text-2xl font-semibold">Convites recebidos</h1>
      {items.length === 0 ? <p className="mt-3 text-sm text-grey">Nenhum convite pendente</p> : null}
      <ul className="mt-4 space-y-3">
        {items.map((invitation) => (
          <li key={invitation.id} className="sheet p-4">
            <p className="font-medium">{invitation.clinic.name}</p>
            <p className="text-sm text-grey">Convidado por {invitation.invitedBy.name}</p>
            <div className="mt-2 flex gap-2">
              <Button onClick={() => void acceptInvitation(invitation.id).then(refresh)}>Aceitar</Button>
              <Button tone="ghost" onClick={() => void declineInvitation(invitation.id).then(refresh)}>Recusar</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
