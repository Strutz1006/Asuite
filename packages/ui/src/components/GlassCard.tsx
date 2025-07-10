import React from 'react';

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => (
  <div className={`bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-lg ${className}`}>
    {children}
  </div>
);