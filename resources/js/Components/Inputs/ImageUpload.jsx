import React, { useRef, useState } from 'react';
import { CloudUpload, X, FileText } from 'lucide-react';
import { useTranslation } from '../../Hooks/useTranslation';

export default function ImageUpload({
  label = 'Add Pictures',
  error = '',
  onChange,
  maxFiles = 5,
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleUploadClick = (e) => {
    e.preventDefault();
    if (files.length < maxFiles) {
      fileInputRef.current?.click();
    }
  };

  const processFiles = (newFiles) => {
    const validFiles = [];
    const newPreviews = [];

    const slotsAvailable = maxFiles - files.length;
    const filesToProcess = Array.from(newFiles).slice(0, slotsAvailable);

    filesToProcess.forEach((file) => {
      validFiles.push(file);
      if (file.type.startsWith('image/')) {
        newPreviews.push({
          url: URL.createObjectURL(file),
          type: 'image',
          name: file.name,
        });
      } else {
        newPreviews.push({
          url: null,
          type: 'pdf',
          name: file.name,
        });
      }
    });

    const updatedFiles = [...files, ...validFiles];
    const updatedPreviews = [...previews, ...newPreviews];

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);

    if (onChange) {
      onChange({ files: updatedFiles });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index, e) => {
    e.preventDefault();
    e.stopPropagation();

    // Revoke object URL if it was created
    if (previews[index] && previews[index].url) {
      URL.revokeObjectURL(previews[index].url);
    }

    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);

    if (onChange) {
      onChange({ files: updatedFiles });
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <label className="block text-sm font-semibold text-slate-800">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className="flex flex-wrap gap-4 items-stretch"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Render existing preview cards */}
        {previews.map((preview, index) => (
          <div
            key={index}
            className="relative w-40 h-38 rounded-[9px] overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center group shadow-sm shrink-0"
          >
            {preview.type === 'image' ? (
              <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-slate-500">
                <FileText className="w-8 h-8 text-red-500" />
                <span className="text-[10px] text-center font-medium mt-1 truncate max-w-[120px]">
                  {preview.name}
                </span>
              </div>
            )}

            {/* Remove button */}
            <button
              type="button"
              onClick={(e) => handleRemove(index, e)}
              className="absolute top-1 right-1 w-6 h-6 text-white flex items-center justify-center transition-all shadow-sm"
              aria-label="Remove picture"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Upload trigger zone (only show if under max limit) */}
        {files.length < maxFiles && (
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex-1 min-w-[280px] h-38 rounded-[4px] border border-dashed border-[#7A7E884D] bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors flex flex-col items-center justify-center p-4 text-center cursor-pointer gap-1 focus:outline-none focus:ring-2 focus:ring-theme-accent/20"
          >
            <div className="w-9 h-9 rounded-full bg-slate-200/60 text-slate-600 flex items-center justify-center">
              <CloudUpload className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-sky-500">
              {t('Click or Drag to upload photos')}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              {t('Maximum :count photos', { count: maxFiles })}
            </p>
            <p className="text-[10px] text-slate-400">{t('PNG, JPG OR PDF (max 800*400 px)')}</p>
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-medium mt-1">{error}</p>}
    </div>
  );
}
