import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";

const WIDE_MIN_PX = 768;

const isWideViewport = (width: number) => width >= WIDE_MIN_PX;

const subscribe = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};

const width = () => window.innerWidth;

export const ViewportGate = ({ children }: { children: ReactNode }) => {
  const current = useSyncExternalStore(subscribe, width, () => WIDE_MIN_PX);
  if (!isWideViewport(current)) {
    return (
      <main className="flex min-h-screen items-center bg-blotter px-6 py-16">
        <section className="mx-auto w-full max-w-md">
          <img src="/logo.png" alt="" className="h-12 w-12" />
          <h1 className="mt-6 text-3xl font-semibold leading-tight text-ink">Use o aplicativo Teranova</h1>
          <p className="mt-3 max-w-prose text-base leading-7 text-quiet">
            Esta plataforma é para computador e tablet. No celular, continue pelo aplicativo Teranova.
          </p>
        </section>
      </main>
    );
  }
  return children;
};
