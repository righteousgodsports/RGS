import { useState } from 'react';
import { athletesService, storageService } from '../../services/firebase';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FileUpload from '../../components/ui/FileUpload';

export default function AthletesPage() {
  const { data: athletes, refetch } = useFirestoreCollection(athletesService, 'name', 'asc');
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', achievement: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const openAdd = () => { setEditId(null); setForm({ name: '', role: '', achievement: '' }); setImageFile(null); setImagePreview(''); setModalOpen(true); };

  const openEdit = async (id) => {
    const athlete = await athletesService.getById(id);
    if (athlete) { setEditId(id); setForm({ name: athlete.name || '', role: athlete.role || '', achievement: athlete.achievement || '' }); setImagePreview(athlete.photoUrl || ''); setImageFile(null); setModalOpen(true); }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { addToast('Please enter a name', 'warning'); return; }
    const data = { ...form };
    if (imageFile) { try { data.photoUrl = await storageService.uploadImage(imageFile, 'athletes'); } catch { addToast('Upload failed', 'error'); return; } }
    try {
      if (editId) { await athletesService.update(editId, data); addToast('Athlete updated!'); }
      else { await athletesService.create(data); addToast('Athlete added!'); }
      setModalOpen(false); refetch();
    } catch { addToast('Error saving', 'error'); }
  };

  const handleDelete = async () => {
    try { await athletesService.remove(deleteTarget.id); addToast('Athlete removed'); refetch(); } catch { addToast('Error', 'error'); }
    setConfirmOpen(false);
  };

  const placeholderImg = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect fill=%22%231c1e28%22 width=%2248%22 height=%2248%22 rx=%2224%22/%3E%3C/svg%3E';

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <h2 className="text-2xl font-extrabold text-[#e8e6f0] tracking-tight">Manage Athletes</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-[#FDDA0D] to-[#ff8800] text-[#0a0a0a] rounded-lg text-xs font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FDDA0D]/30 transition-all cursor-pointer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Athlete
        </button>
      </div>

      <div className="bg-[#1c1e28] border border-[#2a2d3a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#111318]">
              <tr>{['Photo', 'Name', 'Role', 'Achievement', 'Actions'].map(h => <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#5a5c6e] border-b border-[#2a2d3a]">{h}</th>)}</tr>
            </thead>
            <tbody>
              {athletes.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-[#5a5c6e] text-sm">No athletes added yet</td></tr>
              ) : athletes.map(a => (
                <tr key={a.id} className="hover:bg-[#22253a] transition-colors">
                  <td className="px-5 py-3 border-b border-[#2a2d3a]"><img src={a.photoUrl || placeholderImg} alt={a.name} className="w-12 h-12 rounded-full object-cover bg-[#0a0b0e] border border-[#2a2d3a]" onError={e => e.target.src = placeholderImg} /></td>
                  <td className="px-5 py-3 border-b border-[#2a2d3a] text-sm font-semibold text-[#e8e6f0]">{a.name}</td>
                  <td className="px-5 py-3 border-b border-[#2a2d3a] text-sm text-[#8b8da0]">{a.role}</td>
                  <td className="px-5 py-3 border-b border-[#2a2d3a] text-sm text-[#8b8da0]">{a.achievement}</td>
                  <td className="px-5 py-3 border-b border-[#2a2d3a]">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(a.id)} className="w-8 h-8 flex items-center justify-center border border-[#2a2d3a] rounded-md text-[#8b8da0] hover:border-[#FDDA0D] hover:text-[#FDDA0D] hover:bg-[#FDDA0D]/[0.08] transition-all cursor-pointer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button onClick={() => { setDeleteTarget(a); setConfirmOpen(true); }} className="w-8 h-8 flex items-center justify-center border border-[#2a2d3a] rounded-md text-[#8b8da0] hover:border-red-400 hover:text-red-400 hover:bg-red-500/[0.08] transition-all cursor-pointer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Athlete' : 'Add New Athlete'} onSave={handleSave}>
        <div className="space-y-5">
          <div><label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Full Name</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Bjorn Tadeo" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" /></div>
          <div><label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Role</label><input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="Pro Road Cyclist" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" /></div>
          <div><label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Achievement</label><input value={form.achievement} onChange={e => setForm(p => ({ ...p, achievement: e.target.value }))} placeholder="3× Tour Champion" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" /></div>
          <div><label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Photo</label><FileUpload id="athletePhoto" onChange={setImageFile} previewUrl={imagePreview} /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} title="Remove Athlete" message={`Remove "${deleteTarget?.name}" from the team?`} />
    </div>
  );
}
