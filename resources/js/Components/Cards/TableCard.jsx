import React from 'react';

export default function TableCard({ className = '', children, style, ...props }) {
  return (
    <div
      className={`flex flex-col gap-6 rounded-[12px] border border-theme-accent-100/80 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm md:p-6 ${className}`}
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(0, 144, 255, 0.04) 100%)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
