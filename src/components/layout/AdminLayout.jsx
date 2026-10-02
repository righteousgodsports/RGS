import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>, end: true },
  { to: '/admin/hero', label: 'Hero Section', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg> },
  { to: '/admin/bikes', label: 'Bikes', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6l-4 8h6l-3 4"/><path d="M5.5 17.5L9 9h3"/></svg> },
  { to: '/admin/athletes', label: 'Athletes', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  { to: '/admin/jerseys', label: 'Jerseys', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M20.38 3.46L16 2 12 5 8 2 3.62 3.46a2 2 0 00-1.34 1.4L1 10l4 2V20a2 2 0 002 2h10a2 2 0 002-2v-8l4-2-1.28-5.14a2 2 0 00-1.34-1.4z"/></svg> },
  { to: '/admin/members', label: 'Members', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
  { to: '/admin/messages', label: 'Messages', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
];

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/hero': 'Hero Section',
  '/admin/bikes': 'Manage Bikes',
  '/admin/athletes': 'Manage Athletes',
  '/admin/jerseys': 'Manage Jerseys',
  '/admin/members': 'Marquee Members',
  '/admin/messages': 'Contact Messages',
};

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || 'Admin';

  return (
    <div className="flex min-h-screen bg-[#0a0b0e]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-[150] md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-[200] bg-[#111318] border-r border-[#2a2d3a] flex flex-col transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-[260px]',
          'max-md:-translate-x-full max-md:w-[260px]',
          mobileOpen && 'max-md:translate-x-0'
        )}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#2a2d3a] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FDDA0D] to-[#ff8800] flex items-center justify-center text-[#0a0a0a] text-[10px] font-extrabold shrink-0">
              RGS
            </div>
            <span className={cn('font-bold text-[#e8e6f0] whitespace-nowrap transition-opacity', collapsed && 'opacity-0 w-0')}>
              RGS Admin
            </span>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-7 h-7 items-center justify-center rounded-md text-[#8b8da0] hover:bg-[#1c1e28] hover:text-[#e8e6f0] transition-all shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap overflow-hidden transition-all relative',
                isActive
                  ? 'bg-[#FDDA0D]/10 text-[#FDDA0D]'
                  : 'text-[#8b8da0] hover:bg-[#1c1e28] hover:text-[#e8e6f0]'
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#FDDA0D]" />}
                  {item.icon}
                  <span className={cn(collapsed && 'md:hidden')}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#2a2d3a]">
          <button
            onClick={logout}
            className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-400 w-full hover:bg-red-500/[0.08] transition-all whitespace-nowrap overflow-hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 shrink-0">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className={cn(collapsed && 'md:hidden')}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn('flex-1 transition-[margin] duration-300', collapsed ? 'md:ml-[72px]' : 'md:ml-[260px]')}>
        {/* Topbar */}
        <header className="h-16 bg-[#0a0b0e]/80 backdrop-blur-xl border-b border-[#2a2d3a] flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex w-9 h-9 items-center justify-center text-[#e8e6f0]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="text-base font-bold text-[#e8e6f0] tracking-tight">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FDDA0D] to-[#ff8800] flex items-center justify-center text-[#0a0a0a] text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="text-xs text-[#8b8da0] hidden sm:inline">{user?.email}</span>
          </div>
        </header>

        {/* Page content outlet */}
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
