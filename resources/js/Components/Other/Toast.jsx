import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../Hooks/useTranslation';
import { CircleCheckBig, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  const { t } = useTranslation();
  const [isExiting, setIsExiting] = useState(false);

  const prevMessageRef = useRef(null);

  useEffect(() => {
    if (message !== prevMessageRef.current) {
      prevMessageRef.current = message;
      setIsExiting(false);
    }

    const timer = setTimeout(() => {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(exitTimer);
    }, 4200);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!message) return null;

  // Extract title and description
  let displayTitle = '';
  let displayMessage = '';

  if (typeof message === 'object' && message !== null) {
    displayTitle = message.title || '';
    displayMessage = message.description || '';
  } else {
    displayMessage = message;
    if (type === 'success') {
      displayTitle = t('Success!');
    } else if (type === 'error') {
      displayTitle = t('Error occurred');
    } else {
      displayTitle = t('Info!');
    }
  }

  // Style configurations based on type
  const config = {
    success: {
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-100',
      barClass: 'border-l-emerald-500',
      iconColorClass: 'text-emerald-500',
      titleColorClass: 'text-emerald-700 font-semibold',
      descColorClass: 'text-emerald-600',
      closeButtonClass: 'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
      icon: <CircleCheckBig className={`w-4 h-4`} />,
    },
    error: {
      bgClass: 'bg-rose-50',
      borderClass: 'border-rose-100',
      barClass: 'border-l-rose-500',
      iconColorClass: 'text-rose-500',
      titleColorClass: 'text-rose-700 font-semibold',
      descColorClass: 'text-rose-600',
      closeButtonClass: 'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
      icon: <Info className={`w-4 h-4`} />,
    },
    info: {
      bgClass: 'bg-white',
      borderClass: 'border-slate-100',
      barClass: 'border-l-theme-accent',
      iconColorClass: 'text-theme-accent',
      titleColorClass: 'text-sky-700 font-semibold',
      descColorClass: 'text-sky-600',
      closeButtonClass: 'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
      icon: <Info className={`w-4 h-4`} />,
    },
  };

  const currentConfig = config[type] || config.info;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3.5 overflow-hidden rounded-xl border border-l-4 p-4 shadow-xl backdrop-blur-md transition-all duration-300 ease-in-out ${isExiting
          ? 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          : 'opacity-100 translate-y-0 scale-100 animate-fade-in-up'
        } ${currentConfig.bgClass} ${currentConfig.borderClass} ${currentConfig.barClass}`}
      role="alert"
    >
      {/* Icon */}
      <div className={`mt-0.5 shrink-0 ${currentConfig.iconColorClass}`}>{currentConfig.icon}</div>

      {/* Message and Title */}
      <div className="flex-1 pr-2">
        <h4 className={`text-md font-bold leading-tight ${currentConfig.titleColorClass}`}>
          {displayTitle}
        </h4>
        <p className={`mt-1 text-sm font-normal leading-relaxed ${currentConfig.descColorClass}`}>
          {displayMessage}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className={`-mt-1 -mr-1 p-1 rounded-lg transition-colors ${currentConfig.closeButtonClass}`}
        aria-label={t('Close') || 'Close'}
      >
        <svg
          className="h-4.5 w-4.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
