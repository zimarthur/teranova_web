import { useEffect, useRef } from "react";
import { HttpError } from "@/shared/api/http";
import { planLimitMessage } from "@/shared/api/errors";

export const PlanLimitDialog = ({ error, onClose }: { error: unknown; onClose: () => void }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const open = error instanceof HttpError && error.status === 402;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open]);
  if (!open || !(error instanceof HttpError)) return null;
  const message = planLimitMessage({
    error: error.message,
    code: error.code,
    plan: error.plan,
    action: error.action,
  });
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/50 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="plan-limit-title" className="sheet w-full max-w-md p-6">
        <h2 id="plan-limit-title" className="text-lg font-semibold">Limite do plano</h2>
        <p className="mt-2 max-w-prose text-base leading-7 text-quiet">{message}</p>
        <button ref={closeRef} type="button" className="mt-6 min-h-11 rounded-md bg-soil px-4 text-sm font-semibold text-sheet" onClick={onClose}>
          Entendi
        </button>
      </div>
    </div>
  );
};
