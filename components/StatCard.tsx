
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtext?: string;
}

export const StatCard: React.FC<Props> = ({ title, value, icon: Icon, color, subtext }) => {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all shadow-lg group" role="region" aria-label={title}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          {subtext && <p className="text-xs text-slate-500 mt-2">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 group-hover:scale-110 transition-transform`} aria-hidden="true">
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );
};
