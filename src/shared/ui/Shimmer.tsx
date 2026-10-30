export const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-brand-soft ${className}`} />
);

export const PageShimmer = () => (
  <div className="flex flex-col gap-3" role="status" aria-live="polite" aria-label="Carregando">
    <Shimmer className="h-8 w-56" />
    <Shimmer className="h-14 w-full" />
    <Shimmer className="h-14 w-full" />
    <Shimmer className="h-14 w-full" />
    <Shimmer className="h-14 w-5/6" />
  </div>
);
