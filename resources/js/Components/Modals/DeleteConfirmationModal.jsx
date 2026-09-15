import React, { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function DeleteConfirmationModal({
  isOpen = false,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
}) {
  const { t } = useTranslation();
  const titleId = useId();

  useEffect(() => {
    if (!onClose || !isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, isOpen, isLoading]);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm animate-in fade-in duration-200"
      onMouseDown={() => {
        if (onClose && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[100] w-full max-w-md overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] animate-in zoom-in-95 duration-200"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Top-Right Close Button */}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40"
            aria-label={t('Close modal')}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}

        {/* Modal Body: Centered Icon, Title, Description */}
        <div className="flex flex-col items-center text-center pt-2">
          {/* Top-Center Warning Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4 border border-red-100 shadow-2xs">
            <AlertTriangle className="h-7 w-7" />
          </div>

          {/* Title */}
          <h3 id={titleId} className="text-xl font-bold text-slate-900">
            {title || t('Delete Booking?')}
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xs">
            {description ||
              t('Are you sure you want to delete this booking? This action cannot be undone.')}
          </p>
        </div>

        {/* Button Footer Layout: Split Left (Cancel) & Right (Confirm Delete) */}
        <div className="mt-6 flex items-center justify-between gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-xl font-semibold text-sm h-11 px-5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
          >
            {t('Cancel')}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm h-11 px-5 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 active:scale-95 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>{t('Confirm Delete')}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
