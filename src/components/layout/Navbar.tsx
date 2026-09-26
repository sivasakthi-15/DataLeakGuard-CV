import React, { useState } from 'react';
import { Menu, Search, Bell, HelpCircle, Check, Info, Shield, X, LogOut } from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const notifications = [
    { id: 1, title: 'Duplicate leakage identified', time: '12m ago', unread: true },
    { id: 2, title: 'Model hash mismatch: YOLOv8', time: '2h ago', unread: true },
    { id: 3, title: 'Inference record PRV-9041 verified', time: '4h ago', unread: false }
  ];

  const quickLinks = [
    { label: 'Adult Census Income Dataset', path: '/datasets/ds-adult-income' },
    { label: 'Chest X-Ray Pneumonia CV Cohort', path: '/datasets/ds-chest-xray' },
    { label: 'Leakage Analysis & Repair', path: '/leakage-analysis/ds-adult-income' },
    { label: 'Model Fingerprint & Integrity', path: '/model-integrity' },
    { label: 'Inference Provenance Audit', path: '/inference-provenance' },
    { label: 'Assurance Report REP-2026-0042', path: '/reports/REP-2026-0042' }
  ];

  const filteredLinks = quickLinks.filter((l) =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="h-16 px-4 md:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between">
        {/* Left Section: Mobile Menu & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <Breadcrumb />
          </div>
        </div>

        {/* Center / Search Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 text-xs transition-all w-36 sm:w-64"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Search pipeline, dataset...</span>
            <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-mono">
              /
            </kbd>
          </button>
        </div>

        {/* Right Section: Notifications, Help, User */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-900">Integrity Alerts</span>
                  <span className="text-[10px] text-teal-700 font-mono font-medium">2 Unread</span>
                </div>
                <div className="space-y-1.5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50/60 border border-slate-200/60 cursor-pointer transition-colors"
                      onClick={() => setShowNotifications(false)}
                    >
                      <p className="text-xs text-slate-800 font-medium">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help Modal Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Integrity Framework Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User profile quick tag */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-xs font-semibold text-teal-800 font-mono">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AV'}
            </div>
            <span className="text-xs text-slate-700 font-medium max-w-[120px] truncate">
              {user?.name || 'Dr. Alexis Vance'}
            </span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Sign Out"
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50">
              <Search className="w-4 h-4 text-teal-600" />
              <input
                type="text"
                autoFocus
                placeholder="Search datasets, models, findings, reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setShowSearch(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 block mb-2">
                Quick Navigation
              </span>
              <div className="space-y-1">
                {filteredLinks.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      setShowSearch(false);
                      navigate(item.path);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.path}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Framework Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-teal-700" />
              <h3 className="text-base font-bold text-slate-900 font-mono">
                DataLeakGuard-CV Framework Positioning
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong className="text-slate-900">Core Research Loop:</strong>
                <br />
                <code className="text-teal-800 font-mono text-[11px] block mt-1 bg-slate-50 p-2.5 rounded border border-slate-200">
                  Detect → Explain → Repair → Retrain → Compare → Measure Performance Inflation
                </code>
              </p>

              <p>
                <strong className="text-slate-900">Computer Vision & Integrity Extensions:</strong>
                <br />
                <span className="text-slate-600">
                  Data Integrity → Model Integrity → Inference Provenance → Distribution Shift → Evidence → Risk → Assurance Report.
                </span>
              </p>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-[11px] text-slate-600">
                <p className="font-semibold text-slate-900">Reporting Conventions & Transparency:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Evaluations report "Observed difference" rather than universal causal claims.</li>
                  <li>Findings are classified under "Potential issue", "Detected", or "Requires review".</li>
                  <li>Check results are "Verified under configured checks", not absolute proofs.</li>
                  <li>Recommendations are project-defined dispositions (ACCEPT, REVIEW, QUARANTINE).</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
