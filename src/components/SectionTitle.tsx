export function SectionTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-600">{eyebrow}</p> : null}
      <h2 className="mt-3 text-balance text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-pretty text-base leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}
