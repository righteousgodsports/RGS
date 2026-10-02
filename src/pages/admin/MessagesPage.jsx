import { useState } from 'react';
import { messagesService } from '../../services/firebase';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function MessagesPage() {
  const { data: messages, refetch } = useFirestoreCollection(messagesService, 'createdAt', 'desc');
  const { addToast } = useToast();
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewMsg, setViewMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const openView = async (id) => {
    const msg = await messagesService.getById(id);
    if (msg) { setViewMsg(msg); setViewOpen(true); }
  };

  const handleDelete = async () => {
    try { await messagesService.remove(deleteId); addToast('Message deleted'); refetch(); } catch { addToast('Error', 'error'); }
    setConfirmOpen(false);
  };

  const formatDate = (ts) => {
    if (!ts) return 'N/A';
    const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    return d.toLocaleDateString();
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-[#e8e6f0] tracking-tight">Contact Messages</h2>
      </div>

      <div className="bg-[#1c1e28] border border-[#2a2d3a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#111318]">
              <tr>{['Date', 'Name', 'Email', 'Message', 'Actions'].map(h => <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#5a5c6e] border-b border-[#2a2d3a]">{h}</th>)}</tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-[#5a5c6e] text-sm">No messages yet</td></tr>
              ) : messages.map(m => (
                <tr key={m.id} className="hover:bg-[#22253a] transition-colors">
                  <td className="px-5 py-3 border-b border-[#2a2d3a] text-sm text-[#8b8da0]">{formatDate(m.createdAt)}</td>
                  <td className="px-5 py-3 border-b border-[#2a2d3a] text-sm font-semibold text-[#e8e6f0]">{m.name}</td>
                  <td className="px-5 py-3 border-b border-[#2a2d3a] text-sm text-[#8b8da0]">{m.email}</td>
                  <td className="px-5 py-3 border-b border-[#2a2d3a] text-sm text-[#8b8da0] max-w-[300px] truncate">{m.message}</td>
                  <td className="px-5 py-3 border-b border-[#2a2d3a]">
                    <div className="flex gap-1.5">
                      <button onClick={() => openView(m.id)} className="w-8 h-8 flex items-center justify-center border border-[#2a2d3a] rounded-md text-[#8b8da0] hover:border-[#FDDA0D] hover:text-[#FDDA0D] hover:bg-[#FDDA0D]/[0.08] transition-all cursor-pointer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                      <button onClick={() => { setDeleteId(m.id); setConfirmOpen(true); }} className="w-8 h-8 flex items-center justify-center border border-[#2a2d3a] rounded-md text-[#8b8da0] hover:border-red-400 hover:text-red-400 hover:bg-red-500/[0.08] transition-all cursor-pointer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={viewOpen} onClose={() => setViewOpen(false)} title="Message Details" onSave={() => setViewOpen(false)} saveLabel="Close">
        {viewMsg && (
          <div className="space-y-5">
            <div><label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-1">From</label><p className="text-[#e8e6f0] font-semibold">{viewMsg.name}</p></div>
            <div><label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-1">Email</label><p className="text-sm text-[#8b8da0]">{viewMsg.email}</p></div>
            <div><label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-1">Date</label><p className="text-sm text-[#8b8da0]">{formatDate(viewMsg.createdAt)}</p></div>
            <div><label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-1">Message</label><p className="text-sm text-[#e8e6f0] leading-relaxed bg-[#0a0b0e] p-4 rounded-lg">{viewMsg.message}</p></div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Delete Message" message="Delete this message permanently?" />
    </div>
  );
}
