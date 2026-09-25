import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  Database,
  Search,
  Wrench,
  Cpu,
  KeyRound,
  GitCompare,
  TrendingDown,
  FileText,
  LogOut,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Datasets', to: '/datasets', icon: Database },
    { label: 'Leakage Analysis', to: '/leakage-analysis/ds-adult-income', icon: Search },
    { label: 'Repair & Evaluation', to: '/repair/ds-adult-income', icon: Wrench },
    { label: 'Model Integrity', to: '/model-integrity', icon: Cpu },
    { label: 'Inference Provenance', to: '/inference-provenance', icon: KeyRound },
    { label: 'Distribution Shift', to: '/distribution-shift', icon: GitCompare },
    { label: 'Impact Analysis', to: '/impact-analysis', icon: TrendingDown },
    { label: 'Assurance Reports', to: '/reports', icon: FileText }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
            <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:border-teal-400 transition-colors">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-900 font-mono">
                  DataLeakGuard<span className="text-teal-600">-CV</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Evidence-Based Integrity Assurance
                </span>
              </div>
            </NavLink>

            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Research vs CV Architecture label */}
          <div className="px-5 py-2.5 border-b border-slate-100 bg-slate-50/80">
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center justify-between">
              <span>Framework Core</span>
              <span className="text-teal-700 font-semibold">Detect → Repair</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#F0FDFA] text-teal-800 border border-teal-200/80 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Area */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-xs font-bold text-teal-800 shrink-0 font-mono">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AV'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.name || 'Dr. Alexis Vance'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.role || 'ML Security Lead'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
