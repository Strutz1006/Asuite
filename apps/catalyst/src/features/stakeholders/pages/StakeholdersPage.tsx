import React from 'react';
import { GlassCard } from '../../shared/components';
import { mockStakeholders } from '../../shared/data/mockData';

const StakeholdersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Stakeholder Management</h1>
          <p className="text-slate-400 mt-1">Map influence, track engagement, and manage change resistance</p>
        </div>
        <button className="bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-2 px-5 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all">
          + Add Stakeholder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stakeholder Map */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Stakeholder Map</h3>
          <div className="space-y-3">
            {mockStakeholders.map(stakeholder => (
              <div key={stakeholder.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <div className="font-medium">{stakeholder.name}</div>
                  <div className="text-sm text-slate-400">{stakeholder.role} • {stakeholder.department}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 text-xs font-bold rounded-full ${
                    stakeholder.influence === 'High' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {stakeholder.influence} Influence
                  </div>
                  <div className={`px-2 py-1 text-xs font-bold rounded-full ${
                    stakeholder.engagement === 'Champion' ? 'bg-green-500/20 text-green-300' :
                    stakeholder.engagement === 'Supporter' ? 'bg-blue-500/20 text-blue-300' :
                    stakeholder.engagement === 'Neutral' ? 'bg-slate-500/20 text-slate-300' :
                    stakeholder.engagement === 'Skeptic' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {stakeholder.engagement}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Engagement Actions */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Engagement Actions</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <h4 className="font-semibold text-green-300 mb-2">Champions (Leverage)</h4>
              <p className="text-sm text-slate-300 mb-2">Have champions lead training sessions and peer mentoring</p>
              <div className="text-xs text-slate-400 mb-3">
                Stakeholders: Sarah Chen
              </div>
              <button className="text-sm text-green-400 hover:text-green-300">Create Action Plan</button>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="font-semibold text-blue-300 mb-2">Supporters (Enable)</h4>
              <p className="text-sm text-slate-300 mb-2">Provide tools and resources to amplify their support</p>
              <div className="text-xs text-slate-400 mb-3">
                Stakeholders: Lisa Park
              </div>
              <button className="text-sm text-blue-400 hover:text-blue-300">Enable Support</button>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <h4 className="font-semibold text-yellow-300 mb-2">Skeptics (Address Concerns)</h4>
              <p className="text-sm text-slate-300 mb-2">Schedule 1:1 sessions to understand and address specific concerns</p>
              <div className="text-xs text-slate-400 mb-3">
                Stakeholders: Alex Kim
              </div>
              <button className="text-sm text-yellow-400 hover:text-yellow-300">Schedule Meetings</button>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <h4 className="font-semibold text-red-300 mb-2">Resistors (Intensive Support)</h4>
              <p className="text-sm text-slate-300 mb-2">Provide additional training and support resources</p>
              <div className="text-xs text-slate-400 mb-3">
                Stakeholders: Jordan Lee
              </div>
              <button className="text-sm text-red-400 hover:text-red-300">Design Support Plan</button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Influence-Interest Matrix */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Influence-Interest Matrix</h3>
        <div className="relative bg-slate-700/30 rounded-lg p-6 h-96">
          {/* Matrix Grid */}
          <div className="absolute inset-6 grid grid-cols-2 grid-rows-2 gap-2">
            {/* High Influence, High Interest */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-red-300 mb-2">Manage Closely</h4>
              <div className="space-y-1">
                <div className="text-xs bg-slate-800 px-2 py-1 rounded">Sarah Chen</div>
                <div className="text-xs bg-slate-800 px-2 py-1 rounded">Alex Kim</div>
              </div>
            </div>
            
            {/* Low Influence, High Interest */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-green-300 mb-2">Keep Satisfied</h4>
              <div className="space-y-1">
                <div className="text-xs bg-slate-800 px-2 py-1 rounded">Lisa Park</div>
              </div>
            </div>
            
            {/* High Influence, Low Interest */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-yellow-300 mb-2">Keep Informed</h4>
              <div className="space-y-1">
                <div className="text-xs bg-slate-800 px-2 py-1 rounded">Mike Torres</div>
              </div>
            </div>
            
            {/* Low Influence, Low Interest */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-blue-300 mb-2">Monitor</h4>
              <div className="space-y-1">
                <div className="text-xs bg-slate-800 px-2 py-1 rounded">Jordan Lee</div>
              </div>
            </div>
          </div>
          
          {/* Axis Labels */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-slate-400">
            Interest Level
          </div>
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-slate-400">
            Influence Level
          </div>
        </div>
      </GlassCard>

      {/* Communication Plan */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">Communication Plan</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-3 font-semibold">Stakeholder</th>
                <th className="p-3 font-semibold">Message</th>
                <th className="p-3 font-semibold">Channel</th>
                <th className="p-3 font-semibold">Frequency</th>
                <th className="p-3 font-semibold">Next Contact</th>
              </tr>
            </thead>
            <tbody>
              {mockStakeholders.map((stakeholder, _index) => (
                <tr key={stakeholder.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="p-3 font-medium">{stakeholder.name}</td>
                  <td className="p-3 text-sm text-slate-400">
                    {stakeholder.engagement === 'Champion' ? 'Leverage expertise to drive adoption' :
                     stakeholder.engagement === 'Supporter' ? 'Provide resources and updates' :
                     stakeholder.engagement === 'Neutral' ? 'Build awareness and interest' :
                     stakeholder.engagement === 'Skeptic' ? 'Address concerns and provide evidence' :
                     'Intensive support and training'}
                  </td>
                  <td className="p-3 text-sm">
                    {stakeholder.influence === 'High' ? '1:1 Meeting' : 'Email/Group'}
                  </td>
                  <td className="p-3 text-sm">
                    {stakeholder.engagement === 'Champion' ? 'Weekly' :
                     stakeholder.engagement === 'Resistor' ? 'Daily' : 'Bi-weekly'}
                  </td>
                  <td className="p-3 text-sm text-sky-400">
                    {new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default StakeholdersPage;