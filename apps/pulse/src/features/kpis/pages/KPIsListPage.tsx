import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, Icon } from '../../shared/components';
import { mockKPIs, mockKPICategories } from '../../shared/data/mockData';
import type { KPI } from '@aesyros/types';

const KPIsListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'on-track' | 'at-risk'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getKPIStatus = (kpi: KPI) => {
    const current = typeof kpi.value === 'string' ? parseFloat(kpi.value) : kpi.value;
    const target = typeof kpi.target === 'string' ? parseFloat(kpi.target) : kpi.target;
    return current >= target;
  };

  const getVariance = (kpi: KPI) => {
    const current = typeof kpi.value === 'string' ? parseFloat(kpi.value) : kpi.value;
    const target = typeof kpi.target === 'string' ? parseFloat(kpi.target) : kpi.target;
    const variance = ((current - target) / target) * 100;
    return variance > 0 ? `+${variance.toFixed(1)}%` : `${variance.toFixed(1)}%`;
  };

  const filteredKPIs = mockKPIs.filter(kpi => {
    const matchesCategory = selectedCategory === 'all' || kpi.category === selectedCategory;
    const isOnTrack = getKPIStatus(kpi);
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'on-track' && isOnTrack) ||
      (selectedStatus === 'at-risk' && !isOnTrack);
    const matchesSearch = kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpi.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpi.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Key Performance Indicators</h1>
          <p className="text-slate-400 mt-1">Monitor and manage all your performance metrics</p>
        </div>
        <Link 
          to="/kpis/new"
          className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all"
        >
          + New KPI
        </Link>
      </div>

      {/* Filters */}
      <GlassCard className="p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search KPIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Category:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                All
              </button>
              {mockKPICategories.map(category => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Status:</span>
            <div className="flex gap-2">
              {['all', 'on-track', 'at-risk'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKPIs.map(kpi => {
          const isOnTrack = getKPIStatus(kpi);
          return (
            <GlassCard key={kpi.id} className="p-6 hover:border-sky-500/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                      {kpi.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      isOnTrack 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {isOnTrack ? 'On Track' : 'At Risk'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{kpi.name}</h3>
                  <div className="text-sm text-slate-400">
                    Owner: {kpi.owner}
                  </div>
                </div>
                
                <Icon 
                  path={kpi.trend === 'up' ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'} 
                  className={`w-5 h-5 ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-sm text-slate-400">Current</div>
                    <div className="text-2xl font-bold text-sky-400">
                      {kpi.value}{kpi.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Target</div>
                    <div className="text-xl font-semibold text-slate-300">
                      {kpi.target}{kpi.unit}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Variance:</span>
                  <span className={`font-mono ${
                    isOnTrack ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {getVariance(kpi)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Updated:</span>
                  <span className="text-slate-300">
                    {kpi.lastUpdated.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                <Link
                  to={`/kpis/${kpi.id}`}
                  className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors text-sm"
                >
                  View Details
                </Link>
                <Link
                  to={`/kpis/${kpi.id}/edit`}
                  className="flex-1 text-center bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg transition-colors text-sm"
                >
                  Edit
                </Link>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {filteredKPIs.length === 0 && (
        <GlassCard className="p-8 text-center">
          <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No KPIs found</h3>
          <p className="text-slate-500 mb-4">Try adjusting your filters or create a new KPI to get started.</p>
          <Link 
            to="/kpis/new"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Icon path="M12 4v16m8-8H4" className="w-5 h-5" />
            Create New KPI
          </Link>
        </GlassCard>
      )}

      {/* Summary Stats */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Category Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockKPICategories.map(category => (
            <div key={category.name} className="text-center">
              <div className="text-2xl font-bold text-sky-400">{category.count}</div>
              <div className="text-sm text-slate-400">{category.name}</div>
              <div className="text-xs text-slate-500">
                {category.onTrack} on track
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default KPIsListPage;