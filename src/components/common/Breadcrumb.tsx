import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbLabel = (part: string) => {
    switch (part) {
      case 'dashboard':
        return 'Overview';
      case 'datasets':
        return 'Datasets';
      case 'leakage-analysis':
        return 'Leakage Analysis';
      case 'repair':
        return 'Repair & Evaluation';
      case 'model-integrity':
        return 'Model Integrity';
      case 'inference-provenance':
        return 'Inference Provenance';
      case 'distribution-shift':
        return 'Distribution Shift';
      case 'impact-analysis':
        return 'Impact Analysis';
      case 'reports':
        return 'Assurance Reports';
      case 'analysis':
        return 'Analysis Execution';
      default:
        return part;
    }
  };

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-slate-900 transition-colors">
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>DLG-CV</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = getBreadcrumbLabel(value);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {isLast ? (
              <span className="text-slate-900 font-semibold truncate max-w-[200px]">{label}</span>
            ) : (
              <Link to={to} className="hover:text-slate-900 transition-colors truncate max-w-[150px]">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
