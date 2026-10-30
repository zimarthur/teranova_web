export type ClinicRole =
  | "MANAGE_ROLES"
  | "ADD_PATIENT"
  | "ADD_THERAPIST"
  | "REMOVE_THERAPIST"
  | "MANAGE_CARE_TEAM"
  | "ACCESS_ALL_PATIENTS"
  | "VIEW_ALL_THERAPIST_NOTES";

export const clinicRoles: { code: ClinicRole; label: string; description: string }[] = [
  {
    code: "MANAGE_ROLES",
    label: "Gerenciar permissões",
    description: "Conceder e revogar permissões de outros terapeutas.",
  },
  {
    code: "ADD_PATIENT",
    label: "Adicionar paciente",
    description: "Cadastrar novos pacientes nesta clínica.",
  },
  {
    code: "ADD_THERAPIST",
    label: "Adicionar terapeuta",
    description: "Convidar terapeutas para a clínica.",
  },
  {
    code: "REMOVE_THERAPIST",
    label: "Remover terapeuta",
    description: "Remover terapeutas da clínica.",
  },
  {
    code: "MANAGE_CARE_TEAM",
    label: "Vincular/desvincular paciente a terapeuta",
    description: "Incluir ou retirar terapeutas da equipe de cuidado na ficha do paciente.",
  },
  {
    code: "ACCESS_ALL_PATIENTS",
    label: "Acesso a todos os pacientes",
    description: "Listar e abrir a ficha de qualquer paciente. Não permite atender.",
  },
  {
    code: "VIEW_ALL_THERAPIST_NOTES",
    label: "Ver anotações de colegas na equipe",
    description: "Mostra sessões e anotações de outros terapeutas só nos pacientes que esta pessoa atende.",
  },
];

export type ClinicMember = {
  id: string;
  status: "ACTIVE" | "PENDING" | "DECLINED";
  roles: ClinicRole[];
  isOwner: boolean;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    specialty: string | null;
    avatarUrl: string | null;
  };
};

export type Clinic = {
  id: string;
  type: "PERSONAL" | "SHARED";
  status: string;
  name?: string | null;
  cnpj?: string | null;
  address?: string | null;
  members?: ClinicMember[];
};

export type Invitation = {
  id: string;
  clinic: { id: string; name: string | null };
  invitedBy: { name: string };
};

export const clinicName = (clinic: Clinic | null | undefined) =>
  clinic?.type === "SHARED" ? clinic.name || "Clínica" : "Meu consultório";

export const isShared = (clinic: Clinic | null | undefined) => clinic?.type === "SHARED";

export const rolesOf = (clinic: Clinic | null | undefined, userId: string | undefined) => {
  if (!clinic || clinic.type !== "SHARED" || !userId) return [] as ClinicRole[];
  return clinic.members?.find((member) => member.user.id === userId)?.roles ?? [];
};

export const hasRole = (
  clinic: Clinic | null | undefined,
  userId: string | undefined,
  role: ClinicRole,
) => rolesOf(clinic, userId).includes(role);
