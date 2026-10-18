import React from 'react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function DataTable({
  columns = [],
  rows,
  data,
  rowKey = 'id',
  onRowClick,
  cellWrapperClassName = 'text-slate-600',
}) {
  const { t } = useTranslation();
  const tableRows = rows || data || [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-2 pb-2">
        <thead>
          <tr className="text-left text-sm font-semibold text-slate-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`border-b border-[#9F9F9F4D] px-4 py-2 ${column.className ?? ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableRows.map((row) => (
            <tr
              key={row[rowKey]}
              onClick={(e) => {
                if (e.target.closest('button, a, input, select, textarea')) return;
                if (onRowClick) onRowClick(row);
              }}
              className={`group rounded-[12px] border border-white bg-white/20 text-sm text-slate-700 shadow-[inset_0_0_0_1px_rgba(186,230,253,0.4)] transition hover:bg-[#FFFFFFB8] ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((column, index) => (
                <td
                  key={column.key}
                  className={`px-4 py-4 align-middle ${column.className ?? ''} ${index === 0 ? 'rounded-l-2xl' : ''} ${index === columns.length - 1 ? 'rounded-r-2xl' : ''}`}
                >
                  <div className={column.cellClassName ?? cellWrapperClassName}>
                    {column.render ? column.render(row) : (row[column.key] ?? '-')}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
