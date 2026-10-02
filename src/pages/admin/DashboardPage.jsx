import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bikesService, athletesService, jerseysService, membersService, settingsService, storageService } from '../../services/firebase';
import { defaultHero, defaultBikes, defaultAthletes, defaultJerseys, defaultMembers } from '../../data/defaultData';
import { useToast } from '../../context/ToastContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [stats, setStats] = useState({ bikes: 0, athletes: 0, jerseys: 0, members: 0 });
  const [seeding, setSeeding] = useState(false);

  const seedDatabase = async () => {
    if (!window.confirm('This will import the default demo data into your Firebase database. Proceed?')) return;
    setSeeding(true);
    addToast('Importing data... please wait (this takes a moment)');
    
    try {
      const uploadImg = async (url, folder) => {
        if (!url) return null;
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          const file = new File([blob], `seed-${Date.now()}.jpg`, { type: blob.type });
          return await storageService.uploadImage(file, folder);
        } catch (e) {
          console.error("Error uploading image", e);
          return null;
        }
      };

      // 1. Settings (Hero)
      const heroUrl = await uploadImg(defaultHero.imageUrl, 'hero');
      await settingsService.save('hero', { ...defaultHero, imageUrl: heroUrl || defaultHero.imageUrl });
      
      // 2. Bikes
      for (const b of defaultBikes) {
        const url = await uploadImg(b.imageUrl, 'bikes');
        await bikesService.create({ ...b, imageUrl: url || b.imageUrl });
      }

      // 3. Athletes
      for (const a of defaultAthletes) {
        const url = await uploadImg(a.photoUrl, 'athletes');
        await athletesService.create({ ...a, photoUrl: url || a.photoUrl });
      }

      // 4. Jerseys
      for (const j of defaultJerseys) {
        const url = await uploadImg(j.imageUrl, 'jerseys');
        await jerseysService.create({ ...j, imageUrl: url || j.imageUrl });
      }

      // 5. Members
      for (const m of defaultMembers) {
        await membersService.create({ name: m });
      }

      addToast('Demo data imported successfully!', 'success');
      // Trigger a re-fetch of stats
      const [b, a, j, m] = await Promise.all([bikesService.getAll(), athletesService.getAll(), jerseysService.getAll(), membersService.getAll()]);
      setStats({ bikes: b.length, athletes: a.length, jerseys: j.length, members: m.length });

    } catch (err) {
      console.error(err);
      addToast('Error importing data: ' + err.message, 'error');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const [bikes, athletes, jerseys, members] = await Promise.all([
          bikesService.getAll(),
          athletesService.getAll(),
          jerseysService.getAll(),
          membersService.getAll(),
        ]);
        setStats({
          bikes: bikes.length,
          athletes: athletes.length,
          jerseys: jerseys.length,
          members: members.length,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Bikes', value: stats.bikes, color: '#FDDA0D', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6l-4 8h6l-3 4"/><path d="M5.5 17.5L9 9h3"/></svg> },
    { label: 'Athletes', value: stats.athletes, color: '#4af0c0', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
    { label: 'Jerseys', value: stats.jerseys, color: '#a78bfa', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M20.38 3.46L16 2 12 5 8 2 3.62 3.46a2 2 0 00-1.34 1.4L1 10l4 2V20a2 2 0 002 2h10a2 2 0 002-2v-8l4-2-1.28-5.14a2 2 0 00-1.34-1.4z"/></svg> },
    { label: 'Team Members', value: stats.members, color: '#ff6b6b', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  ];

  const quickActions = [
    { label: 'Add New Bike', path: '/admin/bikes' },
    { label: 'Add New Athlete', path: '/admin/athletes' },
    { label: 'Add New Jersey', path: '/admin/jerseys' },
    { label: 'Edit Hero Section', path: '/admin/hero' },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-[#1c1e28] border border-[#2a2d3a] rounded-xl p-6 flex items-center gap-5 hover:border-[#353848] hover:-translate-y-0.5 transition-all"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${card.color}14`, color: card.color }}
            >
              {card.icon}
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#e8e6f0] leading-none tracking-tighter">{card.value}</div>
              <div className="text-[11px] text-[#8b8da0] uppercase tracking-wider mt-1">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#1c1e28] border border-[#2a2d3a] rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#2a2d3a] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#e8e6f0]">Quick Actions</h3>
            <button 
              onClick={seedDatabase} 
              disabled={seeding}
              className="text-[10px] font-bold uppercase tracking-wider text-[#FDDA0D] hover:text-[#fff] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {seeding ? 'Importing...' : 'Import Demo Data'}
            </button>
          </div>
          <div className="p-6 flex flex-col gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-3 w-full px-4 py-3.5 bg-[#0a0b0e] border border-[#2a2d3a] rounded-lg text-[#8b8da0] text-sm font-medium hover:bg-[#22253a] hover:border-[#353848] hover:text-[#e8e6f0] hover:translate-x-1 transition-all text-left cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#FDDA0D" strokeWidth="1.5" className="w-[18px] h-[18px] shrink-0">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1c1e28] border border-[#2a2d3a] rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#2a2d3a]">
            <h3 className="text-sm font-bold text-[#e8e6f0]">System Info</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                ['Platform', 'React + Vite + Tailwind CSS v4'],
                ['Database', 'Cloud Firestore'],
                ['Storage', 'Firebase Storage'],
                ['Auth', 'Firebase Authentication'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-[#2a2d3a] last:border-0">
                  <span className="text-xs text-[#8b8da0] uppercase tracking-wider">{label}</span>
                  <span className="text-sm text-[#e8e6f0] font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
