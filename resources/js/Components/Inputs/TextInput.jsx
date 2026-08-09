import React, { forwardRef } from 'react';
import { toTitleCase } from '@/Utils/helper';

export default forwardRef(function TextInput(
  { label, id, required = false, error, className = '', type, ...props },
  ref
) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-700 tracking-wider">
          {toTitleCase(label)}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        {...props}
        className={`w-full rounded-[4px] border border-[#7A7E884D] bg-transparent px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-theme-accent focus:bg-white/40 focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all ${
          error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : ''
        }`}
      />
      {error && <span className="text-xs text-red-500 mt-1 font-medium">{error}</span>}
    </div>
  );
});
