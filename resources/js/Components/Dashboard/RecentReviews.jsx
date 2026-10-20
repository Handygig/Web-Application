import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function RecentReviews({ reviews = [], avgRating = 4.9 }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 h-full flex flex-col">
      {/* Clean Header matching Revenue Overview Tile */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            {t('Recent Customer Reviews')}
          </h3>
        </div>

        <span className="inline-flex items-center text-2xl font-extrabold tracking-tight text-slate-900">
          {avgRating}
          <Star className="w-5 h-5 fill-amber-400 text-amber-400 ml-1" />
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-3 flex-1">
        {reviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            {t('No customer reviews yet')}
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-3 -mx-3 rounded-2xl hover:bg-slate-50/80 transition-colors space-y-1.5"
            >
              {/* Customer Row Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-100 shrink-0 mt-0.5"
                  />
                  <div className="min-w-0">
                    <h5 className="text-s font-semibold text-slate-900 truncate">
                      {rev.name}
                    </h5>
                    {/* Stars moved under the person's name */}
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-200 text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap mt-0.5">
                  {rev.date}
                </span>
              </div>

              {/* Review Comment */}
              <p className="text-xs text-slate-600 leading-relaxed pl-10.5 line-clamp-2">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
