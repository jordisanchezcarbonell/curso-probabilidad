import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { getLectureBySlug, getLectureNavigation, lectures } from "@/lib/course";

export function generateStaticParams() {
  return lectures.map((lecture) => ({ slug: lecture.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const lecture = getLectureBySlug(params.slug);

  if (!lecture) {
    return {
      title: "Clase no encontrada",
    };
  }

  return {
    title: `${lecture.num}. ${lecture.title} | Curso de Probabilidad`,
    description: lecture.goal,
  };
}

export default function LecturePage({ params }: { params: { slug: string } }) {
  const lecture = getLectureBySlug(params.slug);

  if (!lecture) notFound();

  const navigation = getLectureNavigation(params.slug);
  const label = lecture.num === "Bonus" ? "Bonus" : `Clase ${lecture.num}`;

  return (
    <main id="main">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div aria-hidden="true" className="absolute inset-0 bg-course-grid bg-[length:42px_42px] opacity-20" />
        <div aria-hidden="true" className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div aria-hidden="true" className="absolute right-0 top-0 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden="true">←</span> Volver al curso
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-amber-300 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-slate-950">{label}</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80">{lecture.block}</span>
          </div>

          <h1 className="mt-6 text-balance text-4xl font-black tracking-tight sm:text-5xl">{lecture.title}</h1>
          <p className="mt-5 max-w-3xl text-pretty text-lg leading-8 text-slate-300">{lecture.goal}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-6 lg:self-start" aria-label="Tabla de contenidos">
          <div className="rounded-[1.75rem] border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur">
            <p className="px-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Contenido</p>
            <nav aria-label="Secciones de la clase" className="mt-3 space-y-1 text-sm font-bold text-slate-600">
              {[
                ["#resumen", "Resumen"],
                ["#conceptos", "Conceptos"],
                ["#formulas", "Fórmulas"],
                ["#ejemplo", "Ejemplo"],
                ["#errores", "Errores típicos"],
                ["#ejercicios", "Ejercicios"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="block rounded-xl px-3 py-2 transition-colors hover:bg-amber-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="space-y-8">
          <ContentCard id="resumen" icon="book" title="Resumen fácil">
            <p>{lecture.summary}</p>
          </ContentCard>

          <ContentCard id="conceptos" icon="target" title="Conceptos clave">
            <ul className="space-y-3">
              {lecture.concepts.map((concept) => (
                <li key={concept} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700">
                  <span aria-hidden="true" className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </ContentCard>

          <ContentCard id="formulas" icon="formula" title="Fórmulas importantes">
            <div className="grid gap-3 md:grid-cols-2">
              {lecture.formulas.map((formula) => (
                <div
                  key={formula}
                  className="formula-card overflow-x-auto rounded-2xl p-4 font-mono text-sm leading-6 text-amber-100 shadow-lg [overscroll-behavior-x:contain]"
                >
                  {formula}
                </div>
              ))}
            </div>
          </ContentCard>

          <ContentCard id="ejemplo" icon="spark" title="Ejemplo explicado">
            <div className="rounded-3xl bg-amber-50 p-5 text-slate-800 ring-1 ring-amber-200/70">
              <p>{lecture.example}</p>
            </div>
          </ContentCard>

          <ContentCard id="errores" icon="warning" title="Errores típicos">
            <div className="space-y-3">
              {lecture.mistakes.map((mistake) => (
                <div key={mistake} className="flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-900">
                  <Icon name="warning" className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </ContentCard>

          <ContentCard id="ejercicios" icon="list" title="Mini ejercicios">
            {lecture.exercises.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                Esta clase aún no tiene ejercicios asignados.
              </p>
            ) : (
              <div className="space-y-4">
                {lecture.exercises.map(([question, answer], index) => (
                  <details
                    key={question}
                    className="group rounded-2xl border border-slate-200 bg-white p-4 open:bg-slate-50"
                  >
                    <summary className="flex cursor-pointer list-none items-start gap-3 font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:rounded-lg">
                      <span
                        aria-hidden="true"
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs tabular-nums text-white"
                      >
                        {index + 1}
                      </span>
                      <span className="flex-1 text-pretty">{question}</span>
                      <span className="ml-auto shrink-0 text-sm text-slate-400 group-open:hidden">Ver respuesta</span>
                      <span className="ml-auto hidden shrink-0 text-sm text-slate-400 group-open:inline">Ocultar</span>
                    </summary>
                    <p className="mt-4 border-t border-slate-200 pt-4 text-pretty text-slate-700">{answer}</p>
                  </details>
                ))}
              </div>
            )}
          </ContentCard>

          <div className="grid gap-4 md:grid-cols-2">
            {navigation.previous ? (
              <Link
                href={`/clase/${navigation.previous.slug}`}
                className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-sm transition-shadow motion-safe:transition motion-safe:hover:-translate-y-1 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
              >
                <p className="text-sm font-bold text-slate-400">Anterior</p>
                <p className="mt-2 text-pretty font-black text-slate-950">
                  <span aria-hidden="true">←</span> {navigation.previous.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {navigation.next ? (
              <Link
                href={`/clase/${navigation.next.slug}`}
                className="rounded-[1.5rem] border border-white/80 bg-slate-950 p-5 text-white shadow-sm transition-shadow motion-safe:transition motion-safe:hover:-translate-y-1 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <p className="text-sm font-bold text-white/50">Siguiente</p>
                <p className="mt-2 text-pretty font-black">
                  {navigation.next.title} <span aria-hidden="true">→</span>
                </p>
              </Link>
            ) : null}
          </div>
        </article>
      </section>
    </main>
  );
}

function ContentCard({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: "book" | "target" | "formula" | "spark" | "warning" | "list";
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-sm backdrop-blur md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-amber-300">
          <Icon name={icon} className="h-5 w-5" />
        </div>
        <h2 className="text-balance text-2xl font-black text-slate-950">{title}</h2>
      </div>
      <div className="prose-course text-base leading-8">{children}</div>
    </section>
  );
}
