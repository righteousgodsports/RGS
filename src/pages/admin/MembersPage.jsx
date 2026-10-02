import { useState } from 'react';
import { membersService } from '../../services/firebase';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function MembersPage() {
  const { data: members, refetch } = useFirestoreCollection(membersService, 'name', 'asc');
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [name, setName] = useState('');

  const openAdd = () => { setEditId(null); setName(''); setModalOpen(true); };

  const openEdit = async (id) => {
    const member = await membersService.getById(id);
    if (member) { setEditId(id); setName(member.name || ''); setModalOpen(true); }
  };

  const handleSave = async () => {
    if (!name.trim()) { addToast('Please enter a name', 'warning'); return; }
    try {
      if (editId) { await membersService.update(editId, { name: name.toUpperCase() }); addToast('Member updated!'); }
      else { await membersService.create({ name: name.toUpperCase() }); addToast('Member added!'); }
      setModalOpen(false); refetch();
    } catch { addToast('Error saving', 'error'); }
  };

  const handleDelete = async () => {
    try { await membersService.remove(deleteTarget.id); addToast('Member removed'); refetch(); } catch { addToast('Error', 'error'); }
    setConfirmOpen(false);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <h2 className="text-2xl font-extrabold text-[#e8e6f0] tracking-tight">Marquee Team Members</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-[#FDDA0D] to-[#ff8800] text-[#0a0a0a] rounded-lg text-xs font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FDDA0D]/30 transition-all cursor-pointer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {members.length === 0 ? (
          <div className="col-span-full text-center py-12 text-[#5a5c6e] text-sm">No team members added yet</div>
        ) : members.map(m => (
          <div key={m.id} className="flex items-center justify-between px-5 py-4 bg-[#1c1e28] border border-[#2a2d3a] rounded-lg hover:border-[#353848] transition-colors">
            <span className="text-sm font-semibold text-[#e8e6f0] truncate">{m.name}</span>
            <div className="flex gap-1 ml-3 shrink-0">
              <button onClick={() => openEdit(m.id)} className="w-7 h-7 flex items-center justify-center border border-[#2a2d3a] rounded text-[#8b8da0] hover:border-[#FDDA0D] hover:text-[#FDDA0D] transition-all cursor-pointer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
              <button onClick={() => { setDeleteTarget(m); setConfirmOpen(true); }} className="w-7 h-7 flex items-center justify-center border border-[#2a2d3a] rounded text-[#8b8da0] hover:border-red-400 hover:text-red-400 transition-all cursor-pointer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Member' : 'Add Team Member'} onSave={handleSave}>
        <div><label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Full Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="JAN RAPHAEL GAMOTEA" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" /></div>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Remove Member" message={`Remove "${deleteTarget?.name}"?`} />
    </div>
  );
}
