import React from 'react';

export default function FormCard({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-view-card-gradient rounded-[30px] border border-sky-100/80 p-6 md:p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm flex flex-col gap-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
