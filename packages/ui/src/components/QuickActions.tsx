import React from 'react';
import { Link } from 'react-router-dom';

interface QuickAction {
  to: string;
  icon: string;
  title: string;
  description: string;
  isButton?: boolean;
  onClick?: () => void;
}

interface QuickActionsProps {
  currentApp: 'align' | 'catalyst' | 'flow' | 'foresight' | 'pulse';
  appTitle: string;
  appDescription: string;
  appIcon: string;
  actions: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  currentApp, 
  appTitle, 
  appDescription, 
  appIcon, 
  actions 
}) => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/80 z-30 overflow-y-auto hidden lg:block border-4 border-green-500 relative" style={{ maxWidth: '256px', minWidth: '256px' }}>
      <div className="p-4 w-full relative">
        <div className="absolute top-2 left-2 bg-green-500 text-black px-2 py-1 text-xs z-50">SIDEBAR</div>
        {/* App Branding */}
        <div className="flex items-center gap-2 mb-4 w-full">
          <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={appIcon} />
          </svg>
          <div>
            <h1 className="text-lg font-bold text-white">{appTitle}</h1>
            <p className="text-xs text-sky-300">{appDescription}</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-2">
          {actions.map((action, index) => (
            action.isButton ? (
              <button
                key={index}
                onClick={action.onClick}
                className="px-3 py-2 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm leading-tight truncate">{action.title}</div>
                    <div className="text-xs text-slate-400 leading-tight line-clamp-2">{action.description}</div>
                  </div>
                </div>
              </button>
            ) : (
              <Link
                key={index}
                to={action.to}
                className="px-3 py-2 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors text-left block"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm leading-tight truncate">{action.title}</div>
                    <div className="text-xs text-slate-400 leading-tight line-clamp-2">{action.description}</div>
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;