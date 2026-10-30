import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clinicRoles, hasRole, type Clinic, type ClinicRole } from "@/entities/clinic/model";
import { fullName } from "@/entities/user/model";
import { fetchMembers, grantRole, inviteTherapist, removeTherapist, revokeRole } from "@/features/clinic/api/members";
import { useAccount } from "@/features/auth/api/auth";
import { Button, ErrorText, Field, inputClass } from "@/shared/ui/form";

export const TherapistManagement = ({ clinic }: { clinic: Clinic }) => {
  const account = useAccount();
  const queryClient = useQueryClient();
  const userId = account.data?.id;
  const members = useQuery({
    queryKey: ["members", clinic.id],
    queryFn: () => fetchMembers(clinic.id),
  });
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["members", clinic.id] });
  const mine = members.data?.find((member) => member.user.id === userId);
  const can = (role: ClinicRole) =>
    Boolean(mine?.isOwner || mine?.roles.includes(role) || hasRole(clinic, userId, role));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Gestão de terapeutas</h1>
      {can("ADD_THERAPIST") ? (
        <form className="flex flex-wrap items-end gap-2" onSubmit={(event) => {
          event.preventDefault();
          void inviteTherapist(clinic.id, email.trim()).then(() => { setEmail(""); void refresh(); }).catch((caught) => setError(caught instanceof Error ? caught.message : "Você não tem permissão para esta ação nesta clínica."));
        }}>
          <Field label="E-mail">
            <input className={inputClass} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Button type="submit">Convidar</Button>
        </form>
      ) : null}
      <h2 className="font-semibold">Convites pendentes</h2>
      <ul className="space-y-3">
        {members.data?.filter((member) => member.status === "PENDING").map((member) => (
          <li key={member.id} className="sheet p-3 text-sm">{member.user.email}</li>
        ))}
        {members.data?.every((member) => member.status !== "PENDING") ? <li className="text-sm text-grey">Nenhum convite pendente</li> : null}
      </ul>
      <ul className="space-y-3">
        {members.data?.filter((member) => member.status === "ACTIVE").map((member) => (
          <li key={member.id} className="sheet p-4">
            <p className="font-medium">{fullName(member.user)}</p>
            {can("MANAGE_ROLES") && !member.isOwner ? clinicRoles.map((role) => (
              <label key={role.code} className="mt-1 block text-sm">
                <input
                  type="checkbox"
                  checked={member.roles.includes(role.code)}
                  onChange={(event) => {
                    const action = event.target.checked ? grantRole(clinic.id, member.id, role.code) : revokeRole(clinic.id, member.id, role.code);
                    void action.then(refresh).catch((caught) => setError(caught instanceof Error ? caught.message : "Você não tem permissão para esta ação nesta clínica."));
                  }}
                /> {role.label}
                <span className="block text-xs text-grey">{role.description}</span>
              </label>
            )) : member.roles.map((role) => <span key={role} className="mr-2 text-xs">{clinicRoles.find((item) => item.code === role)?.label}</span>)}
            {can("REMOVE_THERAPIST") && !member.isOwner ? (
              <button type="button" className="mt-2 text-sm text-danger" onClick={() => void removeTherapist(clinic.id, member.id).then(refresh)}>Remover terapeuta</button>
            ) : null}
          </li>
        ))}
      </ul>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
};
