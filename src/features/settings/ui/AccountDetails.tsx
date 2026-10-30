import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { specialtyLabel } from "@/entities/user/model";
import { deleteAccount, deleteMyAvatar, logout, uploadMyAvatar, useAccount } from "@/features/auth/api/auth";
import { queryClient } from "@/shared/api/queryClient";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button, ErrorText } from "@/shared/ui/form";

export const AccountDetails = () => {
  const account = useAccount();
  const navigate = useNavigate();
  const user = account.data;
  const [error, setError] = useState<string | null>(null);
  if (!user) return null;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Detalhes da conta</h1>
      <section className="sheet p-6 text-base leading-7">
        <p>Nome: {[user.firstName, user.lastName].filter(Boolean).join(" ")}</p>
        <p>E-mail: {user.email}</p>
        <p>Especialidade: {specialtyLabel(user.specialty)}</p>
        <p>Conta criada em: {user.confirmedAt ? new Date(user.confirmedAt).toLocaleDateString("pt-BR") : "—"}</p>
      </section>
      <label className="text-sm">
        Foto
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          void uploadMyAvatar(file).then(() => queryClient.invalidateQueries({ queryKey: queryKeys.me })).catch((caught) => setError(caught instanceof Error ? caught.message : "A foto deve ser JPEG, PNG ou WebP de até 5 MB."));
        }} />
      </label>
      {user.avatarUrl ? <Button tone="ghost" onClick={() => void deleteMyAvatar().then(() => queryClient.invalidateQueries({ queryKey: queryKeys.me }))}>Remover foto</Button> : null}
      <Button tone="danger" onClick={() => {
        const confirmed = window.confirm("Ao excluir sua conta, você perderá acesso permanente a todos os dados associados. Essa ação é irreversível.");
        if (!confirmed) return;
        void deleteAccount().then(async () => {
          await logout();
          navigate("/entrar");
        });
      }}>Excluir conta</Button>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
};
