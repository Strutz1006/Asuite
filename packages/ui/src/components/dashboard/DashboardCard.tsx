
import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div className={`bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-lg p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
