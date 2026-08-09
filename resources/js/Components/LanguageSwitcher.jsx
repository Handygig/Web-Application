import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, availableLocales } = usePage().props;

  function changeLocale(newLocale) {
    router.post(
      route('locale.change'),
      { locale: newLocale },
      {
        preserveScroll: true,
      }
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-slate-500" />
      <select
        value={locale}
        onChange={(event) => changeLocale(event.target.value)}
        className="bg-transparent border-0 text-slate-700 text-sm focus:ring-0 focus:outline-none cursor-pointer py-1 pl-1 pr-8 rounded hover:bg-slate-50 transition-colors"
      >
        {Object.entries(availableLocales || {}).map(([code, name]) => (
          <option key={code} value={code} className="bg-white text-slate-800">
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
