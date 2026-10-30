import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const RouteProgress = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let sawFetch = false;
    const started = Date.now();
    setVisible(true);
    setWidth(12);
    const timer = window.setInterval(() => {
      const pending = queryClient.isFetching();
      if (pending > 0) sawFetch = true;
      const elapsed = Date.now() - started;
      if (elapsed > 280 && pending === 0 && (sawFetch || elapsed > 420)) {
        setWidth(100);
        window.clearInterval(timer);
        window.setTimeout(() => {
          if (!cancelled) setVisible(false);
        }, 180);
        return;
      }
      setWidth((value) => Math.min(value + (pending > 0 ? 7 : 16), pending > 0 ? 88 : 96));
    }, 90);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [location.pathname, queryClient]);

  if (!visible) return null;
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/25"
      role="progressbar"
      aria-label="Carregando a página"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
    >
      <div className="route-progress h-full bg-white" style={{ width: `${width}%` }} />
    </div>
  );
};
