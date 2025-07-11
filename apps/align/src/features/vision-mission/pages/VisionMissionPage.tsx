import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';

interface VisionMissionData {
  vision: {
    statement: string;
    lastUpdated: Date;
    updatedBy: string;
  };
  mission: {
    statement: string;
    lastUpdated: Date;
    updatedBy: string;
  };
  values: string[];
}

const mockVisionMission: VisionMissionData = {
  vision: {
    statement: "To be the world's leading sustainable technology company, creating innovative solutions that positively impact our planet and society for generations to come.",
    lastUpdated: new Date('2024-01-15'),
    updatedBy: 'Executive Team'
  },
  mission: {
    statement: "We develop cutting-edge sustainable technologies that reduce environmental impact while delivering exceptional value to our customers, stakeholders, and communities worldwide.",
    lastUpdated: new Date('2024-01-15'),
    updatedBy: 'Executive Team'
  },
  values: [
    'Innovation Excellence',
    'Environmental Stewardship',
    'Customer-Centricity',
    'Ethical Leadership',
    'Collaborative Growth',
    'Continuous Learning'
  ]
};

const VisionMissionPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(mockVisionMission);

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Implement API call to save changes
  };

  const handleCancel = () => {
    setEditData(mockVisionMission);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-100">Vision & Mission</h2>
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Icon path="M5 13l4 4L19 7" className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Vision Section */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-6 h-6 text-sky-400" />
          <h3 className="text-xl font-semibold text-sky-300">Our Vision</h3>
        </div>
        
        {!isEditing ? (
          <div>
            <p className="text-lg leading-relaxed mb-4">{mockVisionMission.vision.statement}</p>
            <div className="flex gap-6 text-sm text-slate-400">
              <span>Last updated: {mockVisionMission.vision.lastUpdated.toLocaleDateString()}</span>
              <span>By: {mockVisionMission.vision.updatedBy}</span>
            </div>
          </div>
        ) : (
          <div>
            <textarea
              value={editData.vision.statement}
              onChange={(e) => setEditData({
                ...editData,
                vision: { ...editData.vision, statement: e.target.value }
              })}
              className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white resize-none focus:border-sky-500 focus:outline-none"
              placeholder="Enter your organization's vision statement..."
            />
          </div>
        )}
      </GlassCard>

      {/* Mission Section */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon path="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6 text-sky-400" />
          <h3 className="text-xl font-semibold text-sky-300">Our Mission</h3>
        </div>
        
        {!isEditing ? (
          <div>
            <p className="text-lg leading-relaxed mb-4">{mockVisionMission.mission.statement}</p>
            <div className="flex gap-6 text-sm text-slate-400">
              <span>Last updated: {mockVisionMission.mission.lastUpdated.toLocaleDateString()}</span>
              <span>By: {mockVisionMission.mission.updatedBy}</span>
            </div>
          </div>
        ) : (
          <div>
            <textarea
              value={editData.mission.statement}
              onChange={(e) => setEditData({
                ...editData,
                mission: { ...editData.mission, statement: e.target.value }
              })}
              className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white resize-none focus:border-sky-500 focus:outline-none"
              placeholder="Enter your organization's mission statement..."
            />
          </div>
        )}
      </GlassCard>

      {/* Core Values Section */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon path="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" className="w-6 h-6 text-sky-400" />
          <h3 className="text-xl font-semibold text-sky-300">Core Values</h3>
        </div>
        
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockVisionMission.values.map((value, index) => (
              <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  <span className="font-medium">{value}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {editData.values.map((value, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={value}
                  onChange={(e) => {
                    const newValues = [...editData.values];
                    newValues[index] = e.target.value;
                    setEditData({ ...editData, values: newValues });
                  }}
                  className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                  placeholder="Enter core value..."
                />
                <button
                  onClick={() => {
                    const newValues = editData.values.filter((_, i) => i !== index);
                    setEditData({ ...editData, values: newValues });
                  }}
                  className="p-3 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setEditData({ ...editData, values: [...editData.values, ''] })}
              className="flex items-center gap-2 p-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-sky-500 hover:text-sky-400 transition-colors"
            >
              <Icon path="M12 4v16m8-8H4" className="w-5 h-5" />
              Add Value
            </button>
          </div>
        )}
      </GlassCard>

      {/* Strategic Alignment Preview */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-6 h-6 text-sky-400" />
          <h3 className="text-xl font-semibold text-sky-300">Strategic Alignment Impact</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-sky-400 mb-2">12</div>
            <div className="text-sm text-slate-400">Objectives Aligned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
            <div className="text-sm text-slate-400">Team Awareness</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">3</div>
            <div className="text-sm text-slate-400">Misalignment Risks</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default VisionMissionPage;