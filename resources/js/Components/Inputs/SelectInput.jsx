import React from 'react';

export default function SelectInput({
    label,
    error,
    options = [],
    className = '',
    placeholder = 'Select an option',
    ...props
}) {
    return (
        <div className={`flex flex-col gap-1 w-full ${className}`}>
            {label && (
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}
            <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm cursor-pointer"
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-xs text-rose-500 font-medium mt-0.5">
                    {error}
                </p>
            )}
        </div>
    );
}
