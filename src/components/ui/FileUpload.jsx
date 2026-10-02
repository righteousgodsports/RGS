import { useState } from 'react';

export default function FileUpload({ id, onChange, previewUrl, accept = 'image/*', label = 'Drop image or click to upload' }) {
  const [preview, setPreview] = useState(previewUrl || '');

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
      if (onChange) onChange(file);
    }
  };

  return (
    <div className="relative border-2 border-dashed border-[#2a2d3a] rounded-lg p-8 text-center cursor-pointer hover:border-[#FDDA0D] hover:bg-[#FDDA0D]/[0.02] transition-all overflow-hidden group">
      <input
        type="file"
        id={id}
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-2 pointer-events-none">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-[#5a5c6e] group-hover:text-[#FDDA0D] transition-colors">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span className="text-xs text-[#5a5c6e]">{label}</span>
      </div>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-3 max-w-[200px] max-h-[150px] object-cover rounded-md mx-auto"
        />
      )}
    </div>
  );
}
