import { useEffect, useId, useRef, useState } from "react";
import type { Clinic } from "@/entities/clinic/model";
import { clinicName } from "@/entities/clinic/model";

export const ClinicSwitcher = ({
  clinics,
  selectedId,
  onSelect,
}: {
  clinics: Clinic[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = clinics.find((clinic) => clinic.id === selectedId) ?? clinics[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!selected) return null;

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className="flex min-h-11 items-center gap-3 rounded-xl bg-white/15 px-3 text-left text-sm"
        onClick={() => setOpen((value) => !value)}
      >
        <span>
          <span className="block text-xs">Clínica</span>
          <span className="block max-w-40 truncate font-semibold">{clinicName(selected)}</span>
        </span>
        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>
      {open ? (
        <ul id={listId} role="listbox" aria-label="Clínica" className="sheet absolute left-0 top-full z-40 mt-2 min-w-56 p-2 text-ink">
          {clinics.map((clinic) => {
            const current = clinic.id === selected.id;
            return (
              <li key={clinic.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={current}
                  className={`flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm ${current ? "bg-surface font-semibold text-brand" : "hover:bg-surface"}`}
                  onClick={() => {
                    onSelect(clinic.id);
                    setOpen(false);
                  }}
                >
                  {clinicName(clinic)}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};
