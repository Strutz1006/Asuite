
import React from 'react';

interface DashboardStatProps {
  label: string;
  value: string | number;
  color?: string;
}

export const DashboardStat: React.FC<DashboardStatProps> = ({ label, value, color = 'text-sky-400' }) => {
  return (
    <div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
};
