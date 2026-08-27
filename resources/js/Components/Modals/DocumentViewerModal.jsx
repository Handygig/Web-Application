import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function DocumentViewerModal({ open = false, document = null, onClose }) {
  const { t } = useTranslation();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setZoomLevel(1);
    }
  }, [open]);

  useEffect(() => {
    if (!onClose || !open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open || !document || !mounted || typeof window === 'undefined' || !window.document?.body) {
    return null;
  }

  const isImage =
    document.fileType?.toLowerCase().includes('image') ||
    document.fileType === 'PNG' ||
    document.fileType === 'JPG' ||
    document.fileType === 'JPEG' ||
    document.name?.toLowerCase().endsWith('.png') ||
    document.name?.toLowerCase().endsWith('.jpg') ||
    document.name?.toLowerCase().endsWith('.jpeg') ||
    document.name?.toLowerCase().endsWith('.webp');

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const modalContent = (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-md overflow-hidden"
      onMouseDown={() => onClose && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[110] flex flex-col h-[90vh] w-full max-w-5xl overflow-hidden rounded-[24px] bg-slate-900 text-white shadow-[0_32px_96px_rgba(0,0,0,0.5)] border border-slate-800"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-accent/20 text-theme-accent border border-theme-accent/30">
              {isImage ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate">{document.name}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{document.fileType || 'PDF Document'}</span>
                <span>•</span>
                <span>{document.fileSize || '1.8 MB'}</span>
                <span>•</span>
                <span>{document.uploadDate || 'Aug 14, 2026'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toolbar Controls */}
            {isImage && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 rounded-xl p-1 border border-slate-700/60 mr-2">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
                  title={t('Zoom Out')}
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-xs font-mono text-slate-300 px-2">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
                  title={t('Zoom In')}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
                  title={t('Reset Zoom')}
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Download Button */}
            <a
              href={document.url || '#'}
              download={document.name}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-theme-accent-hover transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('Download')}</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              aria-label="Close document viewer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Document Display Body */}
        <div className="flex-1 overflow-auto bg-slate-950 p-6 flex items-center justify-center relative">
          {isImage ? (
            <div className="overflow-auto max-h-full max-w-full flex items-center justify-center">
              <img
                src={
                  document.url ||
                  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200'
                }
                alt={document.name}
                style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
                className="max-h-[70vh] rounded-xl object-contain shadow-2xl ring-1 ring-slate-800"
              />
            </div>
          ) : document.url ? (
            <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col">
              <iframe
                src={document.url}
                title={document.name}
                className="w-full h-full min-h-[500px] border-0 rounded-xl bg-white"
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900/60 rounded-2xl border border-slate-800 max-w-2xl">
              <div className="h-20 w-20 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 ring-1 ring-indigo-500/20">
                <FileText className="h-10 w-10" />
              </div>
              <h4 className="text-xl font-bold text-white mb-1">{document.name}</h4>
              <p className="text-sm text-slate-400 mb-6 max-w-md">
                {t('Official verification file submitted for review.')} ({document.fileType || 'PDF'}, {document.fileSize || '2.4 MB'})
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={document.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition ring-1 ring-slate-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t('Open in Larger Viewer')}
                </a>
                <a
                  href={document.url || '#'}
                  download={document.name}
                  className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-5 py-2.5 text-xs font-semibold text-white hover:bg-theme-accent-hover transition"
                >
                  <Download className="h-4 w-4" />
                  {t('Download Document')}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Meta Info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              {t('Verified Authentic Source')}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {t('Uploaded')}: {document.uploadDate || 'Aug 14, 2026'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            {t('Close')}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, window.document.body);
}
