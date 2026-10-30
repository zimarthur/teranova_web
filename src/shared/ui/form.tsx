import type { ReactNode } from "react";

export const primaryActionClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-deep";

export const secondaryActionClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-grey-2 bg-white px-4 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-surface";

export const Page = ({
  title,
  eyebrow,
  children,
  action,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  action?: ReactNode;
}) => (
  <section className="flex w-full flex-col gap-8">
    <header className="flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-sm text-quiet">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold leading-tight text-ink">{title}</h1>
      </div>
      {action}
    </header>
    {children}
  </section>
);

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`sheet ${className}`}>{children}</div>
);

export const Button = ({
  children,
  type = "button",
  onClick,
  disabled,
  tone = "primary",
}: {
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  tone?: "primary" | "ghost" | "danger";
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`min-h-11 rounded-xl px-4 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
      tone === "primary"
        ? "bg-brand text-white hover:bg-brand-deep"
        : tone === "danger"
          ? "border border-danger text-danger hover:bg-red-50"
          : "border border-grey-2 bg-white text-ink hover:bg-surface"
    }`}
  >
    {children}
  </button>
);

export const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <label className="flex flex-col gap-2 text-sm">
    <span className="font-medium text-ink">{label}</span>
    {children}
  </label>
);

export const inputClass =
  "min-h-11 w-full rounded-xl border border-grey-2 bg-white px-3 py-2 text-base text-ink transition-colors duration-150 focus:border-brand";

export const Status = ({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) => (
  <Card className="p-8">
    <p className="text-lg font-medium text-ink">{title}</p>
    {detail ? <p className="mt-2 max-w-prose text-base leading-7 text-quiet">{detail}</p> : null}
    {action ? <div className="mt-6">{action}</div> : null}
  </Card>
);

export const ErrorText = ({ children }: { children: ReactNode }) => (
  <p className="text-sm text-danger" role="alert">
    {children}
  </p>
);
