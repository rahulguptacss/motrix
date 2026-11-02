'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { PaginationLabels, PaginationProps } from '../../types';

const arrowBtn =
  'flex h-11 w-11 items-center justify-center rounded-[3px] border border-ink/15 text-ink transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-35 cursor-pointer';

/** Shared numbered pagination (used on the Blog grid) */
export default function Pagination({ page, totalPages, totalItems, pageStart, pageCount, onChange, labels, layoutId }: PaginationProps) {
  if (totalPages <= 1) return null;

  const showingText = labels.showing_text
    ?.replace('{from}', String(pageStart + 1))
    .replace('{to}', String(pageStart + pageCount))
    .replace('{total}', String(totalItems));

  return (
    <div className="mt-12 sm:mt-14 flex flex-col items-center gap-5 border-t border-line pt-8 sm:flex-row sm:justify-between">
      {showingText && (
        <p className="text-sm text-muted" aria-live="polite">
          {showingText}
        </p>
      )}

      <nav aria-label={labels.label} className="flex items-center gap-2 sm:gap-3">
        <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label={labels.prev_aria_label} className={arrowBtn}>
          <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </button>

        <ul className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: totalPages }, (_, i) => {
            const n = i + 1;
            const current = n === page;
            return (
              <li key={n}>
                <button
                  type="button"
                  onClick={() => onChange(n)}
                  aria-label={`${labels.page_aria_label} ${n}`}
                  aria-current={current ? 'page' : undefined}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-[3px] font-heading text-sm font-bold transition-colors duration-300 cursor-pointer ${
                    current ? 'text-white' : 'text-ink hover:bg-soft'
                  }`}
                >
                  {current && (
                    <motion.span
                      layoutId={layoutId}
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-[3px] bg-primary shadow-[0_10px_24px_-10px_rgba(242,103,34,0.8)]"
                    />
                  )}
                  <span className="relative">{String(n).padStart(2, '0')}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <button type="button" onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label={labels.next_aria_label} className={arrowBtn}>
          <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </button>
      </nav>
    </div>
  );
}

