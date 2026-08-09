import { toTitleCase } from '@/Utils/helper';
import React, { forwardRef, useState } from 'react';
import { Popover } from '@headlessui/react';
import { ChevronDown, Search } from 'lucide-react';

export default forwardRef(function SelectInput(
  {
    label,
    id,
    required = false,
    error,
    children,
    className = '',
    searchable = false,
    onSearchChange,
    loading = false,
    value,
    onChange,
    ...props
  },
  ref
) {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract option elements from children
  const options = React.Children.toArray(children).reduce((acc, child) => {
    if (React.isValidElement(child)) {
      if (child.type === 'option') {
        acc.push({
          value: child.props.value !== undefined ? child.props.value : child.props.children,
          label: child.props.children,
        });
      } else if (child.type === React.Fragment && child.props.children) {
        React.Children.forEach(child.props.children, (subChild) => {
          if (React.isValidElement(subChild) && subChild.type === 'option') {
            acc.push({
              value:
                subChild.props.value !== undefined ? subChild.props.value : subChild.props.children,
              label: subChild.props.children,
            });
          }
        });
      }
    }
    return acc;
  }, []);

  const placeholderOption = options.find((opt) => opt.value === '');
  const selectOptions = options.filter((opt) => opt.value !== '');
  const selectedOption = selectOptions.find(
    (opt) => String(opt.value) === String(value) && value !== ''
  );
  const displayText = selectedOption
    ? selectedOption.label
    : placeholderOption?.label || 'Select...';

  const filteredOptions = searchable
    ? selectOptions.filter((opt) =>
        String(opt.label).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectOptions;

  const handleSelect = (val, close) => {
    if (onChange) {
      onChange({
        target: {
          id,
          name: props.name || id,
          value: val,
        },
      });
    }
    close();
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-700 tracking-wider">
          {toTitleCase(label)}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Popover className="relative w-full">
        {({ open, close }) => (
          <>
            <style
              dangerouslySetInnerHTML={{
                __html: `
              .custom-select-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-select-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-select-scrollbar::-webkit-scrollbar-thumb {
                background-color: rgba(156, 163, 175, 0.4);
                border-radius: 9999px;
              }
              .custom-select-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: rgba(156, 163, 175, 0.6);
              }
            `,
              }}
            />
            <Popover.Button
              ref={ref}
              id={id}
              className={`flex w-full items-center justify-between rounded-[4px] border border-[#7A7E884D] bg-transparent px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-theme-accent focus:bg-white/40 focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all ${
                error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : ''
              }`}
            >
              <span className="truncate">{displayText}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            </Popover.Button>

            <Popover.Panel
              anchor="bottom start"
              transition
              className="z-50 min-w-[var(--button-width)] rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-2xl [--anchor-gap:6px] transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
              onClose={() => {
                setSearchQuery('');
                onSearchChange?.('');
              }}
            >
              {searchable && (
                <div className="relative mb-2 px-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    autoFocus
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      onSearchChange?.(e.target.value);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                  />
                </div>
              )}

              <div className="max-h-[200px] overflow-y-auto custom-select-scrollbar flex flex-col gap-0.5">
                {loading ? (
                  <div className="px-3 py-2 text-sm text-slate-400">Loading...</div>
                ) : filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-slate-400 italic">No options found</div>
                ) : (
                  filteredOptions.map((opt, idx) => {
                    const isSelected = String(opt.value) === String(value);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelect(opt.value, close)}
                        className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                          isSelected
                            ? 'bg-theme-accent text-white font-medium'
                            : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })
                )}
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>

      {error && <span className="text-xs text-red-500 mt-1 font-medium">{error}</span>}
    </div>
  );
});
