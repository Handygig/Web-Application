import React, { useState } from 'react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function MonthlyBookingsChart({
  title = 'Project Analytics',
  defaultActiveIndex = 2, // Tuesday (T) by default, matching the design exactly
}) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  // 7 days data matching the exact visual heights and styles from the reference image
  const days = [
    { day: 'S', height: 75, type: 'striped', value: '55%' },
    { day: 'M', height: 100, type: 'solid-primary', color: '#1e7246', value: '78%' },
    { day: 'T', height: 85, type: 'solid-accent', color: '#4cb683', value: '74%' },
    { day: 'W', height: 124, type: 'solid-dark', color: '#0f4a2d', value: '95%' },
    { day: 'T', height: 110, type: 'striped', value: '85%' },
    { day: 'F', height: 68, type: 'striped', value: '50%' },
    { day: 'S', height: 92, type: 'striped', value: '68%' },
  ];

  const baseY = 132;
  const barWidth = 28;
  const gap = 18;
  const startX = 14;

  const currentActive = days[activeIndex] || days[defaultActiveIndex];
  const activeX = startX + activeIndex * (barWidth + gap) + barWidth / 2;
  const activeY = baseY - currentActive.height;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      {/* Title matching reference design */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          {t(title)}
        </h3>
      </div>

      {/* Pill Bars SVG Chart */}
      <div className="w-full relative select-none">
        <svg
          viewBox="0 0 336 156"
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => setActiveIndex(defaultActiveIndex)}
        >
          <defs>
            {/* Crisp 45-degree diagonal hatched pattern for striped pill bars */}
            <pattern
              id="analyticsHatch"
              width="6"
              height="6"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="#94a3b8"
                strokeWidth="1.8"
                strokeLinecap="square"
              />
            </pattern>
          </defs>

          {/* 7 Vertical Pill Bars */}
          {days.map((item, idx) => {
            const x = startX + idx * (barWidth + gap);
            const y = baseY - item.height;
            const cx = x + barWidth / 2;
            const isActive = activeIndex === idx;

            return (
              <g
                key={idx}
                className="cursor-pointer transition-opacity duration-150"
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {/* Background white mask for striped pills */}
                {item.type === 'striped' && (
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={item.height}
                    rx={barWidth / 2}
                    ry={barWidth / 2}
                    fill="#ffffff"
                  />
                )}

                {/* Pill Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={item.height}
                  rx={barWidth / 2}
                  ry={barWidth / 2}
                  fill={item.type === 'striped' ? 'url(#analyticsHatch)' : item.color}
                  stroke={item.type === 'striped' ? '#cbd5e1' : 'none'}
                  strokeWidth={item.type === 'striped' ? 0.8 : 0}
                  className="transition-all duration-200"
                  opacity={isActive ? 1 : 0.95}
                />

                {/* Day Label underneath */}
                <text
                  x={cx}
                  y="150"
                  textAnchor="middle"
                  className="text-xs font-semibold select-none transition-colors"
                  fill={isActive ? '#334155' : '#94a3b8'}
                >
                  {item.day}
                </text>
              </g>
            );
          })}

          {/* Active Tooltip and Indicator Node on Top of Pill */}
          <g className="transition-all duration-200 pointer-events-none">
            {/* Small white circle ring at the top apex of the pill */}
            <circle
              cx={activeX}
              cy={activeY}
              r="3.5"
              fill="#ffffff"
              stroke={currentActive.color || '#4cb683'}
              strokeWidth="1.8"
            />

            {/* Floating rounded badge */}
            <rect
              x={activeX - 18}
              y={activeY - 23}
              width="36"
              height="18"
              rx="6"
              ry="6"
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth="1"
              className="filter drop-shadow-xs"
            />
            <text
              x={activeX}
              y={activeY - 10}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="#64748b"
            >
              {currentActive.value}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
