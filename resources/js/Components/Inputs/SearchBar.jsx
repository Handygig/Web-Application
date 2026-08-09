import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search', className = '' }) {
    return (
        <div className={`relative w-full ${className}`}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-theme-accent" />
            </div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-[12px] border-2 border-[#7A7E884D] pl-10 pr-4 text-[16px] bg-transparent text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
            />
        </div>
    );
}
