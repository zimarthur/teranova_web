import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Clinic } from "@/entities/clinic/model";
import { isShared } from "@/entities/clinic/model";
import { fullName, type Therapist } from "@/entities/user/model";

const initialsOf = (user: Therapist) => {
  const letters = [user.firstName, user.lastName].filter(Boolean).map((part) => part!.trim()[0]?.toUpperCase());
  return letters.join("") || user.email.slice(0, 1).toUpperCase();
};

export const AccountMenu = ({
  user,
  clinic,
  pending,
  onLogout,
}: {
  user: Therapist;
  clinic: Clinic | null;
  pending: number;
  onLogout: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const location = useLocation();
  const name = user.firstName?.trim() || fullName(user) || user.email;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

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

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="flex min-h-11 items-center gap-3 rounded-xl px-2 text-left"
        onClick={() => setOpen((value) => !value)}
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand">
            {initialsOf(user)}
          </span>
        )}
        <span className="text-sm font-semibold">Olá, {name}</span>
      </button>
      {open ? (
        <div id={menuId} role="menu" className="sheet absolute right-0 top-full z-40 mt-2 w-64 p-2 text-ink">
          <Link role="menuitem" to="/configuracoes/plano" className="flex min-h-11 items-center rounded-xl px-3 text-sm hover:bg-surface">
            Plano
          </Link>
          <Link role="menuitem" to="/configuracoes/conta" className="flex min-h-11 items-center rounded-xl px-3 text-sm hover:bg-surface">
            Conta
          </Link>
          {isShared(clinic) ? (
            <Link role="menuitem" to="/configuracoes/clinica" className="flex min-h-11 items-center rounded-xl px-3 text-sm hover:bg-surface">
              Gestão da clínica
            </Link>
          ) : null}
          <Link role="menuitem" to="/configuracoes/convites" className="flex min-h-11 items-center justify-between rounded-xl px-3 text-sm hover:bg-surface">
            Convites
            {pending > 0 ? <span className="font-semibold text-brand">{pending}</span> : null}
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm text-danger hover:bg-red-50"
            onClick={onLogout}
          >
            Sair
          </button>
        </div>
      ) : null}
    </div>
  );
};
