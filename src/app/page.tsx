import Link from "next/link";
import { Suspense } from "react";
import { CourseBadge } from "@/components/CourseBadge";
import { CourseExplorer } from "@/components/CourseExplorer";
import { SectionTitle } from "@/components/SectionTitle";
import { blocks, course, getBlockStats, lectures } from "@/lib/course";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <DataStrip />
        <Roadmap />
        <Suspense fallback={<CourseExplorerFallback />}>
          <CourseExplorer />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-3 text-sm">
          <span className="font-serif text-base font-semibold tracking-tight">Stat 110</span>
          <span className="text-faint" aria-hidden="true">·</span>
          <span className="text-muted">Probabilidad, en español</span>
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-6 text-sm text-muted">
          <a href="#clases" className="transition-colors hover:text-ink">Clases</a>
          <a href="#mapa" className="transition-colors hover:text-ink">Mapa</a>
          <a href={course.official_url} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
            Fuente oficial
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <CourseBadge>Curso · {lectures.length} lecciones · Harvard Stat 110</CourseBadge>
        <h1 className="mt-6 max-w-4xl text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Probabilidad, explicada como un curso<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-7 text-muted">
          Adaptación al español de Statistics 110 (Harvard). Fundamentos,
          condicionamiento, variables aleatorias, distribuciones, teorema central
          del límite y cadenas de Markov.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="#clases"
            className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            Empezar curso <span aria-hidden="true">→</span>
          </Link>
          <a
            href={course.official_url}
            target="_blank"
            rel="noreferrer"
            aria-label="Fuente oficial (se abre en pestaña nueva)"
            className="text-sm font-medium text-ink underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            Fuente oficial ↗
          </a>
        </div>

        <dl className="mt-16 grid max-w-2xl grid-cols-2 gap-x-10 gap-y-5 text-sm sm:grid-cols-3">
          {[
            ["Autor original", "Joe Blitzstein"],
            ["Institución", "Harvard University"],
            ["Idioma", "Español"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                {label}
              </dt>
              <dd className="mt-1 font-serif text-base font-medium text-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function DataStrip() {
  const totalExercises = lectures.reduce((acc, l) => acc + l.exercises.length, 0);
  const items = [
    { value: String(lectures.length), label: "Lecciones" },
    { value: String(blocks.length), label: "Bloques" },
    { value: String(totalExercises), label: "Ejercicios" },
    { value: "0→1", label: "Nivel" },
  ];

  return (
    <section aria-label="Datos del curso" className="border-b border-rule">
      <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
        {items.map(({ value, label }, idx) => (
          <div
            key={label}
            className={`px-6 py-8 ${idx > 0 ? "border-l border-rule" : ""} ${
              idx === 2 ? "sm:border-l" : ""
            }`}
          >
            <p className="font-serif text-3xl font-medium tabular-nums text-ink">{value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-faint">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section id="mapa" className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          <div>
            <SectionTitle
              eyebrow="Mapa del curso"
              title="De intuición a Markov"
              description="No memorizar fórmulas: construir una forma correcta de razonar bajo incertidumbre."
              align="left"
            />
          </div>
          <ol>
            {blocks.map((block, index) => {
              const stats = getBlockStats(block);
              const isLast = index === blocks.length - 1;
              return (
                <li
                  key={block}
                  className={`grid grid-cols-[3rem_1fr_auto] items-baseline gap-6 py-5 ${
                    !isLast ? "border-b border-rule" : ""
                  }`}
                >
                  <span className="font-mono text-xs tabular-nums text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-ink">{block}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      Desde {stats.first?.num} hasta {stats.last?.num}: {stats.first?.title} → {stats.last?.title}.
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] tabular-nums text-faint">
                    {stats.count} clases
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function CourseExplorerFallback() {
  return (
    <section
      id="clases"
      aria-busy="true"
      className="mx-auto max-w-6xl px-6 py-20"
    >
      <div className="h-40 animate-pulse rounded-md border border-rule bg-white/30" />
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted md:flex-row md:items-baseline md:justify-between">
        <p>
          Curso de probabilidad en español basado en material público de Stat 110.
        </p>
        <div className="flex gap-6">
          <a
            href={course.playlist_url}
            target="_blank"
            rel="noreferrer"
            aria-label="Playlist (se abre en pestaña nueva)"
            className="text-ink underline-offset-4 hover:underline"
          >
            Playlist ↗
          </a>
          <a
            href={course.official_url}
            target="_blank"
            rel="noreferrer"
            aria-label="Página oficial (se abre en pestaña nueva)"
            className="text-ink underline-offset-4 hover:underline"
          >
            Página oficial ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
