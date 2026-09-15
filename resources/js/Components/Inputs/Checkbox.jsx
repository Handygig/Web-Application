import React from 'react';

export default function Checkbox({ label, className = '', ...props }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        {...props}
        type="checkbox"
        className={
          'rounded border-slate-300 text-theme-accent focus:ring-0 focus:ring-offset-0 focus:outline-none accent-[#5E6933] cursor-pointer ' +
          className
        }
      />
      {label && <span className="text-xs font-medium text-slate-600">{label}</span>}
    </label>
  );
}
