export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Are you sure?', message = 'This action cannot be undone.' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[2000] flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-[#1c1e28] border border-[#2a2d3a] rounded-2xl p-9 text-center max-w-[380px] w-full shadow-2xl animate-scale-in">
        <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center bg-red-500/10 rounded-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-red-400">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#e8e6f0] mb-2">{title}</h3>
        <p className="text-sm text-[#8b8da0] mb-7">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0a0b0e] border border-[#2a2d3a] rounded-lg text-[#8b8da0] text-sm font-medium hover:border-[#5a5c6e] hover:text-[#e8e6f0] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-[#ff4d6a] border-none rounded-lg text-white text-sm font-bold hover:bg-[#e6354e] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/30 transition-all cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
