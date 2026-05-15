"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { blocks, lectures, type LectureWithSlug } from "@/lib/course";
import { Icon } from "@/components/Icon";

const storageKey = "stat110-progress-v1";

type ProgressMap = Record<string, boolean>;

function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || "{}") as ProgressMap;
  } catch {
    return {};
  }
}

function writeProgress(progress: ProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(progress));
}

export function CourseExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputId = useId();

  const activeBlock = searchParams.get("block") ?? "Todas";

  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  const completed = Object.values(progress).filter(Boolean).length;
  const percentage = Math.round((completed / lectures.length) * 100);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return lectures.filter((lecture) => {
      const byBlock = activeBlock === "Todas" || lecture.block === activeBlock;
      const searchable = [
        lecture.title,
        lecture.block,
        lecture.goal,
        lecture.summary,
        lecture.whyItMatters,
        lecture.concepts.join(" "),
        lecture.formulas
          .map((f) => [f.label, f.expr, f.note].filter(Boolean).join(" "))
          .join(" "),
        lecture.connections.join(" "),
        lecture.studyChecklist.join(" "),
        lecture.stats.map((stat) => `${stat.label} ${stat.value}`).join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return byBlock && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [activeBlock, query]);

  const setActiveBlock = useCallback(
    (block: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (block === "Todas") {
        params.delete("block");
      } else {
        params.set("block", block);
      }
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  function toggleProgress(slug: string) {
    setProgress((current) => {
      const next = { ...current, [slug]: !current[slug] };
      writeProgress(next);
      return next;
    });
  }

  return (
    <section id="clases" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Índice completo
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
            Las {lectures.length} clases
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Filtra por bloque o busca por concepto. Tu progreso queda guardado
            localmente.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor={searchInputId} className="sr-only">
                Buscar clases por concepto
              </label>
              <div className="flex h-11 items-center gap-3 border-b border-rule transition-colors focus-within:border-ink">
                <Icon name="search" className="h-4 w-4 shrink-0 text-faint" />
                <input
                  id={searchInputId}
                  name="q"
                  type="search"
                  inputMode="search"
                  autoComplete="off"
                  spellCheck={false}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Bayes, Poisson, CLT…"
                  className="h-full w-full min-w-0 border-0 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-faint focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                Progreso
              </p>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-serif text-2xl font-medium tabular-nums">
                  {percentage}%
                </span>
                <span className="text-xs tabular-nums text-muted">
                  {completed} / {lectures.length}
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progreso del curso"
                className="mt-2 h-px w-full bg-rule"
              >
                <div
                  className="h-px bg-ink motion-safe:transition-[width]"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            role="group"
            aria-label="Filtrar por bloque"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-rule pb-4 text-sm"
          >
            {["Todas", ...blocks].map((block) => {
              const isActive = activeBlock === block;
              return (
                <button
                  key={block}
                  type="button"
                  onClick={() => setActiveBlock(block)}
                  aria-pressed={isActive}
                  className={`relative -mb-px whitespace-nowrap pb-3 transition-colors focus-visible:outline-none focus-visible:text-ink ${
                    isActive
                      ? "font-semibold text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {block}
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-px bg-ink"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <ol>
            {filtered.map((lecture, index) => (
              <LectureRow
                key={lecture.slug}
                lecture={lecture}
                checked={Boolean(progress[lecture.slug])}
                onToggle={toggleProgress}
                isFirst={index === 0}
              />
            ))}
          </ol>

          {filtered.length === 0 ? (
            <div className="border-t border-rule py-12 text-center">
              <p className="font-serif text-lg text-ink">
                Sin resultados para ese filtro.
              </p>
              <p className="mt-2 text-sm text-muted">
                Prueba con &ldquo;Bayes&rdquo;, &ldquo;normal&rdquo;,
                &ldquo;esperanza&rdquo; o &ldquo;Markov&rdquo;.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function LectureRow({
  lecture,
  checked,
  onToggle,
  isFirst,
}: {
  lecture: LectureWithSlug;
  checked: boolean;
  onToggle: (slug: string) => void;
  isFirst: boolean;
}) {
  const number = lecture.num === "Bonus" ? "B" : String(lecture.num).padStart(2, "0");

  return (
    <li
      className={`group grid grid-cols-[3rem_1fr_auto] items-baseline gap-6 py-5 ${
        isFirst ? "" : "border-t border-rule"
      }`}
    >
      <span className="font-mono text-xs tabular-nums text-faint">{number}</span>
      <div className="min-w-0">
        <Link
          href={`/clase/${lecture.slug}`}
          className="font-serif text-lg font-medium leading-snug text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:underline"
        >
          {lecture.title}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">
          {lecture.goal}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-faint">
          <span className="uppercase tracking-[0.14em]">{lecture.block}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{lecture.exercises.length} ejercicios</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onToggle(lecture.slug)}
        aria-pressed={checked}
        aria-label={
          checked
            ? `Marcar "${lecture.title}" como pendiente`
            : `Marcar "${lecture.title}" como estudiada`
        }
        className={`grid h-7 w-7 place-items-center rounded-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
          checked
            ? "border-ink bg-ink text-paper"
            : "border-rule bg-transparent text-transparent hover:border-ink hover:text-faint"
        }`}
      >
        <Icon name="check" className="h-4 w-4" />
      </button>
    </li>
  );
}
