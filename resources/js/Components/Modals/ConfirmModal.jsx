import React, { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from '../../Hooks/useTranslation';

function ModalActionButton({ variant = 'neutral', onClick, disabled, children, className = '' }) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-xl font-semibold text-sm transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses =
    {
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 active:scale-95',
      warning:
        'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 active:scale-95',
      primary: 'bg-theme-accent hover:bg-theme-accent-hover text-white shadow-md active:scale-95',
      neutral: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    }[variant] || 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
}

export default function ConfirmModal({
  open = false,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  processing = false,
  variant = 'danger',
  icon: Icon = AlertTriangle,
}) {
  const { t } = useTranslation();
  const titleId = useId();

  useEffect(() => {
    if (!onCancel || !open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel, open]);

  if (!open) {
    return null;
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm"
      onMouseDown={() => {
        if (onCancel) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[100] w-full max-w-md overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
            {Icon ? <Icon className="h-6 w-6" /> : null}
          </div>

          <div className="flex-1">
            <h3 id={titleId} className="text-lg font-semibold text-slate-900">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">{message}</p>
          </div>

          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {onCancel ? (
            <ModalActionButton variant="neutral" onClick={onCancel} className="h-10 px-4">
              {cancelLabel || t('Cancel')}
            </ModalActionButton>
          ) : null}

          <ModalActionButton
            variant={variant}
            onClick={onConfirm}
            className="h-10 px-4"
            disabled={processing}
          >
            {confirmLabel || t('Confirm')}
          </ModalActionButton>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
