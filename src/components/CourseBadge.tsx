export function CourseBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}
