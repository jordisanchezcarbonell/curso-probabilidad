'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { blocks, lectures, type LectureWithSlug } from '@/lib/course';
import { Icon } from '@/components/Icon';

const storageKey = 'stat110-progress-v1';

type ProgressMap = Record<string, boolean>;

function readProgress(): ProgressMap {
  if (typeof window === 'undefined') return {};

  try {
    return JSON.parse(
      window.localStorage.getItem(storageKey) || '{}',
    ) as ProgressMap;
  } catch {
    return {};
  }
}

function writeProgress(progress: ProgressMap) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(progress));
}

export function CourseExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputId = useId();

  const activeBlock = searchParams.get('block') ?? 'Todas';

  const [query, setQuery] = useState('');
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  const completed = Object.values(progress).filter(Boolean).length;
  const percentage = Math.round((completed / lectures.length) * 100);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return lectures.filter((lecture) => {
      const byBlock = activeBlock === 'Todas' || lecture.block === activeBlock;
      const searchable = [
        lecture.title,
        lecture.block,
        lecture.goal,
        lecture.summary,
        lecture.concepts.join(' '),
        lecture.formulas.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return (
        byBlock && (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [activeBlock, query]);

  const setActiveBlock = useCallback(
    (block: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (block === 'Todas') {
        params.delete('block');
      } else {
        params.set('block', block);
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
    <section
      id='clases'
      className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'
    >
      <div className='rounded-[2rem] border border-white/80 bg-white/75 p-4 shadow-soft backdrop-blur md:p-6'>
        <div className='grid gap-4 lg:grid-cols-[1fr_280px]'>
          <div>
            <label htmlFor={searchInputId} className='sr-only'>
              Buscar clases por concepto
            </label>
            <div className='flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition-colors focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-200/70'>
              <Icon
                name='search'
                className='h-5 w-5 shrink-0 text-slate-400'
              />
              <input
                id={searchInputId}
                name='q'
                type='search'
                inputMode='search'
                autoComplete='off'
                spellCheck={false}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder='Buscar por Bayes, Poisson, CLT, Markov…'
                className='h-full w-full min-w-0 border-0 bg-transparent text-base font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none'
              />
            </div>
          </div>

          <div className='rounded-2xl bg-slate-950 p-4 text-white'>
            <div className='flex items-center justify-between text-sm'>
              <span className='font-semibold'>Progreso</span>
              <span className='font-black tabular-nums'>{percentage}%</span>
            </div>
            <div
              role='progressbar'
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label='Progreso del curso'
              className='mt-3 h-2 rounded-full bg-white/15'
            >
              <div
                className='h-2 rounded-full bg-amber-400 motion-safe:transition-[width]'
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p
              aria-live='polite'
              className='mt-2 text-xs tabular-nums text-white/65'
            >
              {completed} de {lectures.length} clases marcadas como estudiadas.
            </p>
          </div>
        </div>

        <div
          role='group'
          aria-label='Filtrar por bloque'
          className='mt-5 flex flex-wrap gap-2'
        >
          {['Todas', ...blocks].map((block) => {
            const isActive = activeBlock === block;
            return (
              <button
                key={block}
                type='button'
                onClick={() => setActiveBlock(block)}
                aria-pressed={isActive}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-lg'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                {block}
              </button>
            );
          })}
        </div>
      </div>

      <div className='mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
        {filtered.map((lecture) => (
          <LectureCard
            key={lecture.slug}
            lecture={lecture}
            checked={Boolean(progress[lecture.slug])}
            onToggle={toggleProgress}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className='mt-10 rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center'>
          <p className='text-lg font-bold text-slate-900'>
            No he encontrado clases con ese filtro.
          </p>
          <p className='mt-2 text-pretty text-slate-600'>
            Prueba con &ldquo;Bayes&rdquo;, &ldquo;normal&rdquo;,
            &ldquo;esperanza&rdquo;, &ldquo;Markov&rdquo; o elimina el filtro de
            bloque.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function LectureCard({
  lecture,
  checked,
  onToggle,
}: {
  lecture: LectureWithSlug;
  checked: boolean;
  onToggle: (slug: string) => void;
}) {
  const number = lecture.num === 'Bonus' ? 'Bonus' : `Clase ${lecture.num}`;

  return (
    <article className='group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white p-5 shadow-sm transition-shadow duration-300 motion-safe:transition motion-safe:hover:-translate-y-1 hover:shadow-soft'>
      <div
        aria-hidden='true'
        className='absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-gradient-to-br from-amber-200/60 to-sky-200/50'
      />
      <div className='relative flex items-start justify-between gap-4'>
        <div>
          <span className='inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-800'>
            {number}
          </span>
          <p className='mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>
            {lecture.block}
          </p>
        </div>
        <button
          type='button'
          onClick={() => onToggle(lecture.slug)}
          aria-pressed={checked}
          aria-label={
            checked
              ? `Marcar "${lecture.title}" como pendiente`
              : `Marcar "${lecture.title}" como estudiada`
          }
          className={`grid h-10 w-10 place-items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
            checked
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-slate-200 bg-white text-slate-300 hover:border-emerald-400 hover:text-emerald-500'
          }`}
        >
          <Icon name='check' className='h-5 w-5' />
        </button>
      </div>

      <h3 className='relative mt-5 line-clamp-2 text-balance text-xl font-black tracking-tight text-slate-950'>
        {lecture.title}
      </h3>
      <p className='relative mt-3 line-clamp-4 text-pretty text-sm leading-6 text-slate-600'>
        {lecture.goal}
      </p>

      <div className='relative mt-5 flex items-center justify-between gap-3'>
        <Link
          href={`/clase/${lecture.slug}`}
          className='inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2'
        >
          Estudiar clase{' '}
          <Icon name='arrow' className='h-4 w-4' aria-hidden='true' />
        </Link>
        <span className='text-xs font-semibold tabular-nums text-slate-400'>
          {lecture.exercises.length} ejercicios
        </span>
      </div>
    </article>
  );
}
