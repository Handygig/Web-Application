import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function normalizeLabel(label) {
  return String(label)
    .replace(/&laquo;\s?/g, '')
    .replace(/\s?&raquo;/g, '')
    .replace('Previous', '')
    .replace('Next', '')
    .trim();
}

export default function Paginator({ links, pagination }) {
  const resolvedLinks = links || pagination?.meta?.links || pagination?.links || [];

  if (!resolvedLinks.length) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-end gap-3 text-slate-700">
      {resolvedLinks.map((link, index) => {

        const label = normalizeLabel(link.label);
        const isArrow = label === '';
        const isPrevious = index === 0;
        const isNext = index === links.length - 1;

        const content = isArrow ? (
          <>
            {isPrevious ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </>
        ) : (
          label
        );

        if (!link.url) {
          return (
            <span
              key={`${label}-${index}`}
              className="flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-medium text-slate-300"
            >
              {content}
            </span>
          );
        }

        return (
          <Link
            key={`${label}-${index}`}
            href={link.url}
            preserveScroll
            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-semibold transition ${
              link.active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
