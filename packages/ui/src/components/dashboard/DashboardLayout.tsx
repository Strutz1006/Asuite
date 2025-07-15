
import React from 'react';
import { DashboardStat } from './DashboardStat';

interface DashboardLayoutProps {
  title: string;
  description: string;
  stats: { label: string; value: string | number; color?: string }[];
  mainContent: React.ReactNode;
  sideContent?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  description,
  stats,
  mainContent,
  sideContent,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">{title}</h2>
          <p className="text-slate-400 mt-2 text-lg">{description}</p>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          {stats.map((stat, index) => (
            <DashboardStat key={index} {...stat} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={sideContent ? "lg:col-span-2 space-y-8" : "lg:col-span-3 space-y-8"}>
          {mainContent}
        </div>
        {sideContent && (
          <div className="space-y-8">
            {sideContent}
          </div>
        )}
      </div>
    </div>
  );
};
