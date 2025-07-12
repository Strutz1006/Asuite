import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import { useAuth } from '../../../hooks/useAuth';
import { useOrganization } from '../../../hooks/useOrganization';
import { useObjectiveStats } from '../../../hooks/useObjectives';
import type { UpdateVisionMissionForm } from '../../../types/database';

const VisionMissionPage: React.FC = () => {
  const { user, profile, isManager } = useAuth();
  const { organization, updateVisionMission, loading: orgLoading } = useOrganization();
  const { stats } = useObjectiveStats();
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<UpdateVisionMissionForm>({
    vision_statement: '',
    mission_statement: '',
    core_values: []
  });

  // Initialize edit data when organization loads
  React.useEffect(() => {
    if (organization && !isEditing) {
      setEditData({
        vision_statement: organization.vision_statement || '',
        mission_statement: organization.mission_statement || '',
        core_values: organization.core_values || []
      });
    }
  }, [organization, isEditing]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateVisionMission(editData);
      if (result) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update vision/mission:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (organization) {
      setEditData({
        vision_statement: organization.vision_statement || '',
        mission_statement: organization.mission_statement || '',
        core_values: organization.core_values || []
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">
            Please sign in to access vision & mission
          </h2>
        </div>
      </div>
    );
  }

  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Vision & Mission</h2>
          {organization && (
            <p className="text-slate-400 mt-1">{organization.name}</p>
          )}
        </div>
        <div className="flex gap-3">
          {!isManager && (
            <div className="text-sm text-slate-400 bg-slate-800 px-3 py-2 rounded-lg">
              Manager access required to edit
            </div>
          )}
          {isManager && !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" className="w-4 h-4" />
              {!organization?.vision_statement && !organization?.mission_statement && (!organization?.core_values || organization.core_values.length === 0) 
                ? 'Begin Your Journey' 
                : 'Edit'}
            </button>
          ) : isManager && isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Icon path="M5 13l4 4L19 7" className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-800 text-white rounded-lg transition-colors"
              >
                <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                Cancel
              </button>
            </div>
          ) : null}
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
            {organization?.vision_statement ? (
              <p className="text-lg leading-relaxed mb-4">{organization.vision_statement}</p>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No vision statement defined yet</p>
                {isManager && (
                  <p className="text-xs mt-1">Click "Edit" to add your organization's vision</p>
                )}
              </div>
            )}
            
            {organization?.vision_statement && (
              <div className="flex gap-6 text-sm text-slate-400">
                {organization.vision_last_updated && (
                  <span>Last updated: {new Date(organization.vision_last_updated).toLocaleDateString()}</span>
                )}
                {organization.vision_updated_by && (
                  <span>By: {organization.vision_updated_by}</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <textarea
              value={editData.vision_statement || ''}
              onChange={(e) => setEditData({
                ...editData,
                vision_statement: e.target.value
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
            {organization?.mission_statement ? (
              <p className="text-lg leading-relaxed mb-4">{organization.mission_statement}</p>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Icon path="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No mission statement defined yet</p>
                {isManager && (
                  <p className="text-xs mt-1">Click "Edit" to add your organization's mission</p>
                )}
              </div>
            )}
            
            {organization?.mission_statement && (
              <div className="flex gap-6 text-sm text-slate-400">
                {organization.mission_last_updated && (
                  <span>Last updated: {new Date(organization.mission_last_updated).toLocaleDateString()}</span>
                )}
                {organization.mission_updated_by && (
                  <span>By: {organization.mission_updated_by}</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <textarea
              value={editData.mission_statement || ''}
              onChange={(e) => setEditData({
                ...editData,
                mission_statement: e.target.value
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
          <div>
            {organization?.core_values && organization.core_values.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organization.core_values.map((value, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                      <span className="font-medium">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Icon path="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No core values defined yet</p>
                {isManager && (
                  <p className="text-xs mt-1">Click "Edit" to add your organization's core values</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {editData.core_values?.map((value, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={value}
                  onChange={(e) => {
                    const newValues = [...(editData.core_values || [])];
                    newValues[index] = e.target.value;
                    setEditData({ ...editData, core_values: newValues });
                  }}
                  className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
                  placeholder="Enter core value..."
                />
                <button
                  onClick={() => {
                    const newValues = (editData.core_values || []).filter((_, i) => i !== index);
                    setEditData({ ...editData, core_values: newValues });
                  }}
                  className="p-3 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setEditData({ 
                ...editData, 
                core_values: [...(editData.core_values || []), ''] 
              })}
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
            <div className="text-3xl font-bold text-sky-400 mb-2">{stats?.total || 0}</div>
            <div className="text-sm text-slate-400">Total Objectives</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{Math.round(stats?.average_progress || 0)}%</div>
            <div className="text-sm text-slate-400">Average Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{stats?.by_status['at-risk'] || 0}</div>
            <div className="text-sm text-slate-400">At-Risk Objectives</div>
          </div>
        </div>

        {organization && (organization.vision_statement || organization.mission_statement) && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="text-center">
              <p className="text-sm text-slate-400">
                Having clear vision and mission statements helps ensure all {stats?.total || 0} objectives 
                are aligned with your organization's strategic direction.
              </p>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default VisionMissionPage;