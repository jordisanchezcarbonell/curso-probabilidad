import Link from "next/link";
import { Suspense } from "react";
import { CourseBadge } from "@/components/CourseBadge";
import { CourseExplorer } from "@/components/CourseExplorer";
import { Icon } from "@/components/Icon";
import { SectionTitle } from "@/components/SectionTitle";
import { blocks, course, getBlockStats, lectures } from "@/lib/course";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <Stats />
      <Roadmap />
      <Suspense fallback={<CourseExplorerFallback />}>
        <CourseExplorer />
      </Suspense>
      <Footer />
    </main>
  );
}

function CourseExplorerFallback() {
  return (
    <section
      id="clases"
      aria-busy="true"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="h-40 animate-pulse rounded-[2rem] border border-white/80 bg-white/60" />
    </section>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-course-grid bg-[length:40px_40px] opacity-25" />
      <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-40 top-20 -z-10 h-[28rem] w-[28rem] rounded-full bg-sky-400/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-24">
        <div>
          <CourseBadge>Statistics 110 en español</CourseBadge>
          <h1 className="mt-6 max-w-4xl text-balance text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Probabilidad desde cero, explicado como curso práctico.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-300">
            Una versión visual y estudiable de la playlist de Harvard: conceptos, fórmulas, ejemplos, errores típicos y ejercicios por clase.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#clases"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-base font-black text-slate-950 shadow-lg shadow-amber-400/20 transition-transform motion-safe:hover:-translate-y-0.5 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200/80"
            >
              Empezar curso <Icon name="play" className="h-5 w-5" />
            </Link>
            <a
              href={course.official_url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Fuente oficial (se abre en pestaña nueva)`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-base font-bold text-white backdrop-blur transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Fuente oficial <Icon name="arrow" className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-white p-5 text-slate-950">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">Ruta</span>
                <span className="text-sm font-bold tabular-nums text-slate-500">
                  {lectures.length}{" "}vídeos
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  ["01", "Contar bien antes de calcular", "Fundamentos"],
                  ["02", "Condicionar sin engañarte", "Bayes & total probability"],
                  ["03", "Variables aleatorias", "Esperanza y distribuciones"],
                  ["04", "Normal, CLT y Markov", "Teoremas y procesos"],
                ].map(([step, title, label]) => (
                  <div key={step} className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-300 text-sm font-black tabular-nums text-slate-950">{step}</div>
                    <div>
                      <p className="font-black text-slate-950">{title}</p>
                      <p className="mt-1 text-sm text-slate-500">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats: Array<[value: string | number, label: string]> = [
    [lectures.length, "clases"],
    [blocks.length, "bloques"],
    [lectures.reduce((acc, lecture) => acc + lecture.exercises.length, 0), "ejercicios"],
    ["0→1", "nivel"],
  ];

  return (
    <section className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 rounded-[2rem] border border-white/80 bg-white/85 p-4 shadow-soft backdrop-blur md:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="rounded-[1.5rem] bg-slate-50 p-6 text-center">
            <p className="text-3xl font-black tabular-nums text-slate-950">{value}</p>
            <p className="mt-1 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Mapa del curso"
        title="De intuición básica a cadenas de Markov"
        description="La idea no es memorizar fórmulas: es construir una forma correcta de razonar con incertidumbre."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blocks.map((block, index) => {
          const stats = getBlockStats(block);
          return (
            <div
              key={block}
              className="rounded-[1.75rem] border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur transition-shadow motion-safe:transition motion-safe:hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-sm font-black tabular-nums text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black tabular-nums text-amber-800">
                  {stats.count}{" "}clases
                </span>
              </div>
              <h3 className="mt-5 text-balance text-xl font-black text-slate-950">{block}</h3>
              <p className="mt-3 text-pretty text-sm leading-6 text-slate-600">
                Desde {stats.first?.num} hasta {stats.last?.num}: {stats.first?.title} → {stats.last?.title}.
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>Curso de probabilidad en español basado en material público de Stat 110.</p>
        <div className="flex gap-4">
          <a
            href={course.playlist_url}
            target="_blank"
            rel="noreferrer"
            aria-label="Playlist (se abre en pestaña nueva)"
            className="rounded font-bold text-slate-700 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Playlist
          </a>
          <a
            href={course.official_url}
            target="_blank"
            rel="noreferrer"
            aria-label="Página oficial (se abre en pestaña nueva)"
            className="rounded font-bold text-slate-700 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Página oficial
          </a>
        </div>
      </div>
    </footer>
  );
}
