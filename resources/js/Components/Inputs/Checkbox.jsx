import React from 'react';

export default function Checkbox({
    label,
    error,
    className = '',
    ...props
}) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer"
                    {...props}
                />
                {label && (
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {label}
                    </span>
                )}
            </label>
            {error && (
                <p className="text-xs text-rose-500 font-medium mt-0.5">
                    {error}
                </p>
            )}
        </div>
    );
}
