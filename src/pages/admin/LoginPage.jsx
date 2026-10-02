import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/admin');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login(email, password);
    } catch (err) {
      setError(authService.getErrorMessage(err.code));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b0e] relative overflow-hidden">
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#FDDA0D] opacity-0 animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="bg-[#1c1e28] border border-[#2a2d3a] rounded-2xl px-10 py-12 w-full max-w-[420px] relative z-10 shadow-[0_0_0_1px_rgba(253,218,13,0.05),0_20px_60px_rgba(0,0,0,0.5),0_0_120px_rgba(253,218,13,0.03)] animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-9">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FDDA0D] to-[#ff8800] flex items-center justify-center text-[#0a0a0a] text-lg font-extrabold">
            RGS
          </div>
          <h1 className="text-2xl font-bold text-[#e8e6f0] tracking-tight">Admin Panel</h1>
          <p className="text-[11px] text-[#8b8da0] tracking-[0.15em] uppercase mt-1">Righteous God Sports</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Email</label>
            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#5a5c6e] peer-focus:text-[#FDDA0D]">
                <path d="M3 8l9 6 9-6M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9-4 9 4" />
              </svg>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@rgs.com" required
                className="peer w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm pl-11 pr-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all"
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-[#8b8da0] uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#5a5c6e]">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /><circle cx="12" cy="16" r="1" />
              </svg>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                className="w-full bg-[#111318] border border-[#2a2d3a] rounded-lg text-[#e8e6f0] text-sm pl-11 pr-4 py-3 outline-none focus:border-[#FDDA0D] focus:ring-2 focus:ring-[#FDDA0D]/15 transition-all"
              />
            </div>
          </div>

          {error && <div className="text-red-400 text-sm text-center mb-4">{error}</div>}

          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-br from-[#FDDA0D] to-[#ff8800] text-[#0a0a0a] rounded-lg text-sm font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FDDA0D]/30 transition-all disabled:opacity-50 cursor-pointer relative"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] rounded-full animate-spin mx-auto" />
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
