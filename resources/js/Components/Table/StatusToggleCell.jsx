import React from 'react';

export default function StatusToggleCell({
  active,
  onToggle,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          active ? 'bg-theme-accent' : 'bg-slate-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            active ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${active ? 'text-theme-accent' : 'text-slate-400'}`}>
        {active ? activeLabel : inactiveLabel}
      </span>
    </div>
  );
}
