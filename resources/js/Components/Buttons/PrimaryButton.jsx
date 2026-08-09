import React from 'react';
import { Link } from '@inertiajs/react';

export default function PrimaryButton({
  href,
  as,
  children,
  icon: Icon,
  native = false,
  loading = false,
  className = '',
  ...props
}) {
  const baseClassName = `bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center justify-center gap-2 rounded-[9px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98] ${className}`;

  if (as === 'button' || !href) {
    return (
      <button className={baseClassName} {...props}>
        {Icon ? <Icon className="h-4 w-4" /> : null}
        <span>{children}</span>
      </button>
    );
  }

  if (native) {
    return (
      <a href={href} className={baseClassName} {...props}>
        {Icon ? <Icon className="h-4 w-4" /> : null}
        <span>{children}</span>
      </a>
    );
  }

  return (
    <Link href={href} className={baseClassName} {...props}>
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <span>{children}</span>
    </Link>
  );
}
