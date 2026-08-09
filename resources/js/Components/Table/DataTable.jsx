import React, { useState } from 'react';
import { useTranslation } from '@/Hooks/useTranslation';
import Tooltip from '../Tooltip';

export default function DataTable({
  columns,
  rows,
  rowKey = 'id',
  onRowClick,
  cellWrapperClassName = 'text-slate-600',
  rowTooltip,
}) {
  const { t } = useTranslation();
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, showLeft: false });

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
          {rows.map((row) => {
            const tooltipText = (() => {
              if (rowTooltip === false) {
                return null;
              }
              if (typeof rowTooltip === 'function') {
                return rowTooltip(row);
              }
              if (typeof rowTooltip === 'string') {
                return rowTooltip;
              }
              if (onRowClick) {
                return t('Click to view');
              }
              return null;
            })();

            const isHovered = hoveredRowId === row[rowKey];

            return (
              <Tooltip
                key={row[rowKey]}
                as="tr"
                content={tooltipText}
                tooltipStyle={{
                  left: mousePos.showLeft ? `${mousePos.x - 16}px` : `${mousePos.x + 16}px`,
                  transform: mousePos.showLeft ? 'translateX(-100%)' : 'none',
                  top: `${mousePos.y - 12}px`,
                  bottom: 'auto',
                  margin: 0,
                }}
                tooltipClassName="bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white shadow-md transition-all duration-75"
                onClick={(e) => {
                  if (e.target.closest('button, a, input, select, textarea')) {
                    return;
                  }
                  if (onRowClick) {
                    onRowClick(row);
                  }
                }}
                onMouseEnter={() => setHoveredRowId(row[rowKey])}
                onMouseLeave={() => setHoveredRowId(null)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  setMousePos({
                    x,
                    y,
                    showLeft: x > rect.width - 150,
                  });
                }}
                className={`group relative rounded-[12px] border border-white bg-white/20 text-sm text-slate-700 shadow-[inset_0_0_0_1px_rgba(186,230,253,0.4)] transition hover:bg-[#FFFFFFB8] ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((column, index) => (
                  <td
                    key={column.key}
                    className={`px-4 py-4 align-middle ${column.className ?? ''} ${index === 0 ? 'rounded-l-2xl' : ''} ${
                      index === columns.length - 1 ? 'rounded-r-2xl' : ''
                    }`}
                  >
                    <div className={column.cellClassName ?? cellWrapperClassName}>
                      {column.render ? column.render(row) : (row[column.key] ?? '-')}
                    </div>
                  </td>
                ))}
              </Tooltip>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
