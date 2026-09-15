import { toTitleCase } from '@/Utils/helper';
import React, { forwardRef, useState } from 'react';
import { Popover } from '@headlessui/react';
import { ChevronDown, Search, Check } from 'lucide-react';

export default forwardRef(function SelectInput(
  {
    label,
    id,
    required = false,
    error,
    children,
    options: optionsProp,
    className = '',
    searchable = false,
    onSearchChange,
    loading = false,
    value,
    onChange,
    placeholder,
    ...props
  },
  ref
) {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract option elements from props or children
  const optionsFromChildren = React.Children.toArray(children).reduce((acc, child) => {
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

  const rawOptions = optionsProp && optionsProp.length > 0 ? optionsProp : optionsFromChildren;
  const selectOptions = rawOptions.map((opt) =>
    typeof opt === 'object' ? opt : { value: opt, label: String(opt) }
  );

  const selectedOption = selectOptions.find(
    (opt) => String(opt.value).toLowerCase() === String(value || '').toLowerCase()
  );

  const displayText = selectedOption
    ? selectedOption.label
    : placeholder || (selectOptions[0] ? selectOptions[0].label : 'Select...');

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
    <div className={`flex flex-col relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
        >
          {toTitleCase(label)}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Popover className="relative w-full">
        {({ open, close }) => (
          <>
            <Popover.Button
              ref={ref}
              id={id}
              type="button"
              className={`flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-2xs focus:border-theme-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all cursor-pointer ${
                error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            >
              <span className="truncate">{displayText}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            </Popover.Button>

            <Popover.Panel className="absolute left-0 right-0 top-full mt-1.5 z-[200] rounded-2xl border border-slate-200 bg-white p-1.5 text-slate-800 shadow-2xl transition duration-100 ease-out">
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

              <div className="max-h-[200px] overflow-y-auto flex flex-col gap-1 p-0.5">
                {loading ? (
                  <div className="px-3 py-2 text-sm text-slate-400">Loading...</div>
                ) : filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-slate-400 italic">No options found</div>
                ) : (
                  filteredOptions.map((opt, idx) => {
                    const isSelected =
                      String(opt.value).toLowerCase() === String(value || '').toLowerCase();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelect(opt.value, close)}
                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-theme-accent text-white font-semibold'
                            : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && <Check className="h-4 w-4 shrink-0 text-white" />}
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
