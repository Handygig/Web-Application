import React, { useRef, useState, useEffect } from 'react';

export default function TabSwitch({ tabs, activeTab, onChange }) {
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current) {
        const activeEl = containerRef.current.querySelector('[data-active="true"]');
        if (activeEl) {
          setIndicatorStyle({
            left: activeEl.offsetLeft,
            width: activeEl.offsetWidth,
          });
        }
      }
    };

    updatePosition();

    // Small timeout to ensure styling is applied and widths are calculated correctly
    const timer = setTimeout(updatePosition, 50);

    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(timer);
    };
  }, [activeTab, tabs]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex rounded-[12px] bg-white p-1 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-slate-100"
    >
      <div
        className="absolute bottom-1 top-1 left-0 rounded-[8px] bg-theme-accent transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0px_4px_4px_0px_#0000000D]"
        style={{
          transform: `translateX(${indicatorStyle.left}px)`,
          width: `${indicatorStyle.width}px`,
        }}
      />
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <button
            key={tab.key}
            type="button"
            data-active={isActive ? 'true' : 'false'}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onChange(tab.key)}
            className={`relative z-10 rounded-[8px] px-5 py-2 text-sm font-medium transition-colors duration-300 ease-in-out whitespace-nowrap ${
              isActive ? 'text-white' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
