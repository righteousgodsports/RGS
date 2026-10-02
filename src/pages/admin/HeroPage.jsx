import { useState, useEffect } from 'react';
import { settingsService, storageService } from '../../services/firebase';
import { useToast } from '../../context/ToastContext';
import FileUpload from '../../components/ui/FileUpload';

export default function HeroPage() {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    tag: '', title1: '', title2: '', title3: '', description: '',
    cta1: '', cta2: '', stat1: '', stat1Label: '', stat2: '', stat2Label: '', imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService.get('hero').then(data => {
      if (data) setForm(prev => ({ ...prev, ...data }));
    }).catch(console.error);
  }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form };
      if (imageFile) {
        data.imageUrl = await storageService.uploadImage(imageFile, 'hero');
      }
      await settingsService.save('hero', data);
      addToast('Hero section updated!');
    } catch (err) {
      addToast('Error saving hero data', 'error');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-[#e8e6f0] tracking-tight">Hero Section</h2>
        <p className="text-sm text-[#8b8da0] mt-1">Manage your homepage hero banner content</p>
      </div>

      <div className="bg-[#1c1e28] border border-[#2a2d3a] rounded-xl p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Season Tag</label>
              <input name="tag" value={form.tag} onChange={handleChange} placeholder="Season 2025 — Elite Collection" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Title Line 1</label>
              <input name="title1" value={form.title1} onChange={handleChange} placeholder="RIDE" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Title Line 2 (Accent)</label>
              <input name="title2" value={form.title2} onChange={handleChange} placeholder="BEYOND" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Title Line 3 (Stroke)</label>
              <input name="title3" value={form.title3} onChange={handleChange} placeholder="LIMITS" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Description / Verse</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="FOR I KNOW THE PLANS..." className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all resize-vertical" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Primary Button</label>
              <input name="cta1" value={form.cta1} onChange={handleChange} placeholder="Explore Bikes" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Secondary Button</label>
              <input name="cta2" value={form.cta2} onChange={handleChange} placeholder="Our Tech" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Stat 1 Value</label>
              <input name="stat1" value={form.stat1} onChange={handleChange} placeholder="48" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Stat 1 Label</label>
              <input name="stat1Label" value={form.stat1Label} onChange={handleChange} placeholder="Pro Teams" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Stat 2 Value</label>
              <input name="stat2" value={form.stat2} onChange={handleChange} placeholder="312" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Stat 2 Label</label>
              <input name="stat2Label" value={form.stat2Label} onChange={handleChange} placeholder="Race Wins" className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm px-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Hero Image</label>
              <FileUpload id="heroImage" onChange={setImageFile} previewUrl={form.imageUrl} />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#FDDA0D] to-[#ff8800] text-[#0a0a0a] rounded-lg text-sm font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FDDA0D]/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
              </svg>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
