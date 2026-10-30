import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { documentTypes, labelOf } from "@/entities/patient/model";
import { deleteDocument, listDocuments, openDocument, uploadDocument } from "@/features/patients/api/documents";
import { queryKeys } from "@/shared/api/queryKeys";
import { Button, ErrorText, Field, inputClass } from "@/shared/ui/form";
import { useClinics } from "@/features/clinic/api/clinics";

export const PatientDocuments = ({ patientId, canMutate }: { patientId: string; canMutate: boolean }) => {
  const clinics = useClinics();
  const clinicId = clinics.data?.selectedId ?? "";
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.documents(clinicId, patientId),
    queryFn: () => listDocuments(patientId),
  });
  const [type, setType] = useState("ANAMNESIS");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    if (!file) return setError("Envie um arquivo.");
    if (!type) return setError("Escolha o tipo do documento.");
    if (name.trim().length > 120) return setError("Informe um nome de até 120 caracteres.");
    try {
      await uploadDocument(patientId, file, type, name.trim());
      setName("");
      setFile(null);
      setError(null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.documents(clinicId, patientId) });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível salvar o documento. Tente novamente.");
    }
  };

  const open = async (documentId: string) => {
    try {
      const opened = await openDocument(patientId, documentId);
      window.open(opened.viewUrl, "_blank", "noopener");
    } catch {
      setError("Não foi possível abrir o documento. Tente novamente.");
    }
  };

  return (
    <section className="sheet p-6">
      <h2 className="font-semibold">Documentos</h2>
      {query.isError ? <p className="text-sm text-grey">Não foi possível carregar os documentos. Tente novamente.</p> : null}
      {query.isSuccess && query.data.length === 0 ? <p className="text-sm text-grey">Nenhum documento</p> : null}
      <ul className="mt-2 space-y-2">
        {query.data?.map((document) => (
          <li key={document.id} className="flex items-center justify-between text-sm">
            <button type="button" className="min-h-11 text-left" onClick={() => void open(document.id)}>
              <span className="block font-medium">{document.fileName}</span>
              <span className="block text-quiet">{labelOf(documentTypes, document.type)}</span>
            </button>
            {canMutate ? (
              <button type="button" className="min-h-11 text-danger" onClick={() => void deleteDocument(patientId, document.id).then(() => query.refetch())}>Remover</button>
            ) : null}
          </li>
        ))}
      </ul>
      {canMutate ? (
        <div className="mt-4 grid max-w-md gap-3">
          <Field label="Nome do documento">
            <input className={inputClass} maxLength={120} value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Tipo">
            <select className={inputClass} value={type} onChange={(event) => setType(event.target.value)}>
              {documentTypes.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
            </select>
          </Field>
          <Field label="Arquivo">
            <input className="text-sm" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          </Field>
          <Button onClick={() => void send()}>Enviar</Button>
        </div>
      ) : null}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </section>
  );
};
