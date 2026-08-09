import React, { useRef, useState } from 'react';
import { CloudUpload, X, FileText } from 'lucide-react';
import { useTranslation } from '../../Hooks/useTranslation';

export default function DocumentUpload({
  label = 'Investigation Documents',
  required = true,
  error = '',
  onChange,
  value = null,
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUploadClick = (e) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (onChange) {
        onChange(file);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (onChange) {
        onChange(file);
      }
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange(null);
    }
  };

  const fileName = selectedFile
    ? selectedFile.name
    : typeof value === 'string'
      ? value.split('/').pop()
      : '';

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
        {t(label)}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleUploadClick}
        className={`group relative flex flex-col rounded-[4px] border border-dashed border-slate-300 bg-white/40 p-6 cursor-pointer transition hover:bg-white/60 min-h-[140px] justify-center ${
          fileName ? 'items-start' : 'items-center text-center'
        }`}
      >
        {fileName ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
              <FileText className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-800 truncate max-w-[300px]">
              {fileName}
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="mt-1 flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="h-3 w-3" />
              {t('Remove')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/60 text-slate-400">
              <CloudUpload className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-sky-500">{t('Choose Files to Upload')}</p>
            <p className="text-xs text-slate-400 font-medium">
              {t('PDF & Docx Files Only. 10MB is the maximum size allowed.')}
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-medium mt-1">{error}</p>}
    </div>
  );
}
