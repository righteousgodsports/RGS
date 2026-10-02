import { useState } from 'react';

export default function Modal({ isOpen, onClose, title, children, onSave, saveLabel = 'Save' }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[1000] overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div
          className="bg-[#1c1e28] border border-[#2a2d3a] rounded-2xl w-full max-w-[560px] flex flex-col shadow-2xl animate-scale-in my-auto"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-[#2a2d3a]">
          <h3 className="text-lg font-bold text-[#e8e6f0]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-[#8b8da0] hover:bg-[#0a0b0e] hover:text-[#e8e6f0] transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-7 pt-4 pb-6 border-t border-[#2a2d3a]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0a0b0e] border border-[#2a2d3a] rounded-lg text-[#8b8da0] text-sm font-medium hover:border-[#5a5c6e] hover:text-[#e8e6f0] transition-all cursor-pointer"
          >
            Cancel
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="px-6 py-2.5 bg-gradient-to-br from-[#FDDA0D] to-[#ff8800] text-[#0a0a0a] rounded-lg text-sm font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FDDA0D]/30 transition-all cursor-pointer"
            >
              {saveLabel}
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
