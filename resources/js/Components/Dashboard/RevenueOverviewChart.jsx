import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useTranslation } from '@/Hooks/useTranslation';

// Minimalist, modern floating tooltip
const CustomTooltip = ({ active, payload, label, t }) => {
  if (active && payload && payload.length) {
    const currentVal = payload.find((p) => p.dataKey === 'current')?.value ?? 0;
    const prevVal = payload.find((p) => p.dataKey === 'previous')?.value ?? 0;
    const diff = currentVal - prevVal;
    const percentDiff = prevVal > 0 ? ((diff / prevVal) * 100).toFixed(1) : null;

    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-xl py-2 px-3 shadow-xl border border-slate-800 text-xs select-none min-w-[150px]">
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[11px] text-slate-400">
          <span>{label}</span>
          {percentDiff !== null && (
            <span className={diff >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {diff >= 0 ? `+${percentDiff}%` : `${percentDiff}%`}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t('Current')}:
            </span>
            <span className="font-bold text-white text-xs">
              ${currentVal.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="w-2 h-0.5 bg-slate-500 rounded-full" />
              {t('Previous')}:
            </span>
            <span className="text-slate-400 text-xs font-medium">
              ${prevVal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Subtle active dot
const CustomActiveDot = ({ cx, cy }) => (
  <g>
    <circle cx={cx} cy={cy} r={7} fill="#0f4a2d" fillOpacity={0.15} />
    <circle
      cx={cx}
      cy={cy}
      r={4.5}
      fill="#0f4a2d"
      stroke="#ffffff"
      strokeWidth={2}
    />
  </g>
);

const TIMEFRAMES = ['This Month', 'Last Month', 'This Year'];

export default function RevenueOverviewChart({ initialTimeframe = 'This Month' }) {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState(initialTimeframe);

  // Datasets for different timeframes
  const datasets = useMemo(
    () => ({
      'This Month': [
        { date: '1 Apr', current: 3600, previous: 2800 },
        { date: '4 Apr', current: 9200, previous: 4400 },
        { date: '6 Apr', current: 13500, previous: 4600 },
        { date: '8 Apr', current: 14200, previous: 4300 },
        { date: '11 Apr', current: 16800, previous: 6200 },
        { date: '13 Apr', current: 15400, previous: 7600 },
        { date: '15 Apr', current: 20100, previous: 6100 },
        { date: '16 Apr', current: 18900, previous: 6400 },
        { date: '18 Apr', current: 25400, previous: 6700 },
        { date: '21 Apr', current: 24560, previous: 7200 },
        { date: '23 Apr', current: 18800, previous: 4100 },
        { date: '25 Apr', current: 17200, previous: 6500 },
        { date: '26 Apr', current: 21500, previous: 8800 },
        { date: '28 Apr', current: 27100, previous: 8200 },
        { date: '29 Apr', current: 17400, previous: 13200 },
        { date: '30 Apr', current: 28900, previous: 9800 },
      ],
      'Last Month': [
        { date: '1 Mar', current: 2800, previous: 2100 },
        { date: '5 Mar', current: 5200, previous: 4100 },
        { date: '10 Mar', current: 7800, previous: 5900 },
        { date: '15 Mar', current: 12400, previous: 9200 },
        { date: '20 Mar', current: 16100, previous: 11400 },
        { date: '25 Mar', current: 19800, previous: 14300 },
        { date: '31 Mar', current: 23400, previous: 16500 },
      ],
      'This Year': [
        { date: 'Jan', current: 28400, previous: 19500 },
        { date: 'Feb', current: 32100, previous: 22400 },
        { date: 'Mar', current: 39500, previous: 27100 },
        { date: 'Apr', current: 48250, previous: 31000 },
        { date: 'May', current: 42100, previous: 33500 },
        { date: 'Jun', current: 46800, previous: 36200 },
        { date: 'Jul', current: 51200, previous: 39800 },
        { date: 'Aug', current: 53900, previous: 41000 },
        { date: 'Sep', current: 49800, previous: 40500 },
        { date: 'Oct', current: 55400, previous: 43200 },
        { date: 'Nov', current: 58200, previous: 45100 },
        { date: 'Dec', current: 64500, previous: 48900 },
      ],
    }),
    []
  );

  const activeData = datasets[timeframe] || datasets['This Month'];

  // Current display metric
  const displayRevenue = useMemo(() => {
    if (timeframe === 'This Month') return '$24,560';
    if (timeframe === 'Last Month') return '$23,400';
    return '$527,150';
  }, [timeframe]);

  const formatYAxis = (val) => {
    if (val === 0) return '$0';
    if (val >= 1000) return `$${Math.round(val / 1000)}K`;
    return `$${val}`;
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
      {/* Clean Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Headline Metric */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            {t('Revenue Overview')}
          </h3>
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              {displayRevenue}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              +18.4%
            </span>
          </div>
        </div>

        {/* Minimal Segmented Filter & Subtle Legend */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Subtle Legend */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0f4a2d]" />
              <span className="text-slate-700 font-medium">{t('Current')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-slate-400" />
              <span className="text-slate-400">{t('Previous')}</span>
            </div>
          </div>

          {/* Segmented Control */}
          <div className="inline-flex p-1 bg-slate-100/80 rounded-xl">
            {TIMEFRAMES.map((tab) => {
              const active = timeframe === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTimeframe(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t(tab)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modern Area & Line Chart */}
      <div className="w-full h-56 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={activeData}
            margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="minimalRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f4a2d" stopOpacity={0.14} />
                <stop offset="90%" stopColor="#0f4a2d" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f8fafc"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
              dy={6}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
              tickFormatter={formatYAxis}
              domain={[0, 'dataMax + 3000']}
            />

            <Tooltip
              content={<CustomTooltip t={t} />}
              cursor={{
                stroke: '#e2e8f0',
                strokeWidth: 1,
                strokeDasharray: '2 2',
              }}
            />

            {/* Previous Period comparison line */}
            <Line
              type="monotone"
              dataKey="previous"
              stroke="#cbd5e1"
              strokeWidth={1.75}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, fill: '#94a3b8', stroke: '#ffffff', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={500}
            />

            {/* Current Period line & subtle gradient */}
            <Area
              type="monotone"
              dataKey="current"
              stroke="#0f4a2d"
              strokeWidth={2.5}
              fill="url(#minimalRevenueGradient)"
              activeDot={<CustomActiveDot />}
              isAnimationActive={true}
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
