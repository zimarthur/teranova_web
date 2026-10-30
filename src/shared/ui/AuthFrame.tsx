import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export const AuthFrame = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) => (
  <div className="grid min-h-screen bg-blotter md:grid-cols-[minmax(280px,0.8fr)_1.2fr]">
    <aside className="on-brand hidden flex-col justify-between bg-brand px-12 py-12 text-white md:flex">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="" className="h-10 w-10" />
        <span className="text-xl font-semibold">Teranova</span>
      </div>
      <div className="max-w-sm">
        <p className="font-display text-4xl font-medium leading-tight">O consultório, na mesa.</p>
        <p className="mt-4 max-w-prose text-base leading-7">
          Escreva o atendimento, reveja a jornada e cuide da clínica com a mesma conta do aplicativo.
        </p>
      </div>
      <p className="text-sm">Para computador e tablet.</p>
    </aside>
    <main className="flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/entrar" className="mb-8 flex min-h-11 items-center gap-2 md:hidden">
          <img src="/logo.png" alt="" className="h-8 w-8" />
          <span className="font-semibold text-ink">Teranova</span>
        </Link>
        <h1 className="text-3xl font-semibold leading-tight text-ink">{title}</h1>
        <p className="mt-2 max-w-prose text-base leading-7 text-quiet">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  </div>
);
