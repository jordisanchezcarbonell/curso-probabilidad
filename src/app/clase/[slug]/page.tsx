import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { getLectureBySlug, getLectureNavigation, lectures } from "@/lib/course";

export function generateStaticParams() {
  return lectures.map((lecture) => ({ slug: lecture.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const lecture = getLectureBySlug(params.slug);
  if (!lecture) return { title: "Clase no encontrada" };

  return {
    title: `${lecture.num}. ${lecture.title} — Stat 110`,
    description: lecture.goal,
  };
}

export default function LecturePage({ params }: { params: { slug: string } }) {
  const lecture = getLectureBySlug(params.slug);
  if (!lecture) notFound();

  const navigation = getLectureNavigation(params.slug);
  const label = lecture.num === "Bonus" ? "Bonus" : `Clase ${lecture.num}`;

  return (
    <>
      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-baseline gap-3 text-sm">
            <span className="font-serif text-base font-semibold tracking-tight">Stat 110</span>
            <span className="text-faint" aria-hidden="true">·</span>
            <span className="text-muted">Probabilidad, en español</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-ink underline-offset-4 hover:underline"
          >
            ← Índice
          </Link>
        </div>
      </header>

      <main id="main">
        <article>
          <header className="border-b border-rule">
            <div className="mx-auto max-w-4xl px-6 py-16 lg:py-20">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.18em]">
                <span className="text-accent">{label}</span>
                <span className="text-faint" aria-hidden="true">·</span>
                <span className="text-muted">{lecture.block}</span>
              </div>
              <h1 className="mt-6 text-balance font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
                {lecture.title}
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-7 text-muted">
                {lecture.goal}
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-16 lg:grid-cols-[200px_1fr]">
              <aside aria-label="Tabla de contenidos" className="lg:sticky lg:top-6 lg:self-start">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                  Contenido
                </p>
                <nav aria-label="Secciones de la clase" className="mt-4">
                  <ol className="space-y-2 text-sm">
                    {[
                      ["#resumen", "Resumen"],
                      ["#conceptos", "Conceptos clave"],
                      ["#formulas", "Fórmulas"],
                      ["#ejemplo", "Ejemplo"],
                      ["#errores", "Errores típicos"],
                      ["#ejercicios", "Ejercicios"],
                    ].map(([href, title], idx) => (
                      <li key={href} className="grid grid-cols-[2rem_1fr] gap-2">
                        <span className="font-mono text-xs tabular-nums text-faint">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <a
                          href={href}
                          className="text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:underline"
                        >
                          {title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>

              <div className="max-w-2xl space-y-16">
                <Section id="resumen" eyebrow="01" title="Resumen">
                  <p>{lecture.summary}</p>
                </Section>

                <Section id="conceptos" eyebrow="02" title="Conceptos clave">
                  <ol>
                    {lecture.concepts.map((concept, idx) => {
                      const isLast = idx === lecture.concepts.length - 1;
                      return (
                        <li
                          key={concept}
                          className={`grid grid-cols-[2rem_1fr] items-baseline gap-4 py-4 ${
                            !isLast ? "border-b border-rule" : ""
                          }`}
                        >
                          <span className="font-mono text-xs tabular-nums text-accent">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="text-pretty text-base leading-7 text-ink">
                            {concept}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </Section>

                <Section id="formulas" eyebrow="03" title="Fórmulas importantes">
                  <ol>
                    {lecture.formulas.map((raw, idx) => {
                      const { label, expr, note } = parseFormula(raw);
                      const isLast = idx === lecture.formulas.length - 1;
                      return (
                        <li
                          key={raw}
                          className={`grid grid-cols-[2rem_1fr] gap-4 py-5 ${
                            !isLast ? "border-b border-rule" : ""
                          }`}
                        >
                          <span className="pt-1 font-mono text-xs tabular-nums text-accent">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div>
                            {label ? (
                              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-faint">
                                {label}
                              </p>
                            ) : null}
                            <div className="mt-1 font-mono text-base leading-7 text-ink [overflow-wrap:anywhere]">
                              {expr}
                            </div>
                            {note ? (
                              <p className="mt-2 font-serif text-sm italic leading-6 text-muted">
                                {note}
                              </p>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </Section>

                <Section id="ejemplo" eyebrow="04" title="Ejemplo explicado">
                  <div className="border-l-2 border-accent pl-5">
                    <p className="font-serif text-lg italic leading-8 text-ink">
                      {lecture.example}
                    </p>
                  </div>
                </Section>

                <Section id="errores" eyebrow="05" title="Errores típicos">
                  <ol>
                    {lecture.mistakes.map((mistake, idx) => {
                      const isLast = idx === lecture.mistakes.length - 1;
                      return (
                        <li
                          key={mistake}
                          className={`grid grid-cols-[2rem_1fr] items-baseline gap-4 py-4 ${
                            !isLast ? "border-b border-rule" : ""
                          }`}
                        >
                          <span className="font-mono text-xs tabular-nums text-accent">
                            ✗
                          </span>
                          <span className="text-pretty text-base leading-7 text-ink">
                            {mistake}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </Section>

                <Section id="ejercicios" eyebrow="06" title="Ejercicios">
                  {lecture.exercises.length === 0 ? (
                    <p className="text-sm text-muted">
                      Esta clase aún no tiene ejercicios asignados.
                    </p>
                  ) : (
                    <ol>
                      {lecture.exercises.map(([question, answer], idx) => {
                        const isLast = idx === lecture.exercises.length - 1;
                        return (
                          <li
                            key={question}
                            className={`py-5 ${!isLast ? "border-b border-rule" : ""}`}
                          >
                            <details className="group">
                              <summary className="grid cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-baseline gap-4 focus-visible:outline-none">
                                <span className="font-mono text-xs tabular-nums text-faint">
                                  {String(idx + 1).padStart(2, "0")}
                                </span>
                                <span className="text-pretty font-serif text-base font-medium leading-7 text-ink group-focus-visible:underline">
                                  {question}
                                </span>
                                <span className="shrink-0 text-xs uppercase tracking-[0.14em] text-faint group-open:hidden">
                                  Ver
                                </span>
                                <span className="hidden shrink-0 text-xs uppercase tracking-[0.14em] text-faint group-open:inline">
                                  Ocultar
                                </span>
                              </summary>
                              <div className="mt-4 grid grid-cols-[2rem_1fr] gap-4">
                                <span aria-hidden="true" />
                                <p className="border-l-2 border-rule pl-4 text-base leading-7 text-muted">
                                  {answer}
                                </p>
                              </div>
                            </details>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </Section>
              </div>
            </div>
          </div>

          <nav
            aria-label="Navegación entre clases"
            className="border-t border-rule"
          >
            <div className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2">
              {navigation.previous ? (
                <Link
                  href={`/clase/${navigation.previous.slug}`}
                  className="group block px-6 py-8 sm:border-r sm:border-rule"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                    ← Anterior
                  </span>
                  <p className="mt-2 text-pretty font-serif text-lg font-medium text-ink underline-offset-4 group-hover:underline">
                    {navigation.previous.title}
                  </p>
                </Link>
              ) : (
                <div className="hidden sm:block sm:border-r sm:border-rule" />
              )}
              {navigation.next ? (
                <Link
                  href={`/clase/${navigation.next.slug}`}
                  className="group block px-6 py-8 text-right"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                    Siguiente →
                  </span>
                  <p className="mt-2 text-pretty font-serif text-lg font-medium text-ink underline-offset-4 group-hover:underline">
                    {navigation.next.title}
                  </p>
                </Link>
              ) : null}
            </div>
          </nav>
        </article>
      </main>
    </>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <header className="mb-6 flex items-baseline gap-4">
        <span className="font-mono text-xs tabular-nums text-faint">{eyebrow}</span>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink">
          {title}
        </h2>
      </header>
      <div className="article">{children}</div>
    </section>
  );
}

function parseFormula(raw: string): { label?: string; expr: string; note?: string } {
  const cleaned = raw.replace(/\.\s*$/, "").trim();

  const colonIdx = cleaned.indexOf(": ");
  if (colonIdx > 0 && colonIdx < 40) {
    const possibleLabel = cleaned.slice(0, colonIdx).trim();
    if (/^[A-Za-zÀ-ÿ\s]+$/.test(possibleLabel)) {
      return { label: possibleLabel, expr: cleaned.slice(colonIdx + 2).trim() };
    }
  }

  const noteMatch = cleaned.match(
    /^(.+?)\s+(cuando|donde|para todo|para cada)\s+(.+)$/i,
  );
  if (noteMatch) {
    return { expr: noteMatch[1].trim(), note: `${noteMatch[2]} ${noteMatch[3]}`.trim() };
  }

  return { expr: cleaned };
}
