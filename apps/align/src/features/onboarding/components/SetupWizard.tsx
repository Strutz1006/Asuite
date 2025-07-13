import React, { useState } from 'react';
import { GlassCard, Icon } from '../../shared/components';
import { useAuth } from '../../../hooks/useAuth';
import { useOrganization } from '../../../hooks/useOrganization';
import type { UpdateVisionMissionForm } from '../../../types/database';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

interface SetupWizardProps {
  onComplete: () => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const { updateVisionMission } = useOrganization();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [organizationData, setOrganizationData] = useState({
    name: '',
    vision_statement: '',
    mission_statement: '',
    core_values: ['']
  });
  const [departments, setDepartments] = useState([{ name: '', teams: [''] }]);

  const steps: WizardStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Aesyros Align',
      description: 'Let\'s get your organisation set up for strategic success',
      component: WelcomeStep
    },
    {
      id: 'organization',
      title: 'Organisation Basics',
      description: 'Tell us about your organisation',
      component: OrganizationStep
    },
    {
      id: 'vision-mission',
      title: 'Vision & Mission',
      description: 'Define your strategic foundation',
      component: VisionMissionStep
    },
    {
      id: 'structure',
      title: 'Organisation Structure',
      description: 'Set up departments and teams',
      component: StructureStep
    },
    {
      id: 'complete',
      title: 'Setup Complete',
      description: 'You\'re ready to start your strategic journey',
      component: CompleteStep
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveData = async () => {
    setSaving(true);
    try {
      // Filter out empty core values
      const cleanedCoreValues = organizationData.core_values.filter(value => value.trim() !== '');
      
      const result = await updateVisionMission({
        name: organizationData.name,
        vision_statement: organizationData.vision_statement,
        mission_statement: organizationData.mission_statement,
        core_values: cleanedCoreValues
      });
      
      if (!result) {
        throw new Error('Failed to save organisation data');
      }
      
      // TODO: Save departments and teams data to backend
      console.log('Departments to save:', departments);
      console.log('Setup completed successfully!');
      
    } catch (error) {
      console.error('Failed to save setup data:', error);
      throw error; // Re-throw to handle in UI
    } finally {
      setSaving(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-100">Organisation Setup</h1>
            <span className="text-sm text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-sky-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      index < currentStep ? 'bg-sky-600' : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <GlassCard className="max-w-4xl mx-auto p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-100 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-slate-400">
              {steps[currentStep].description}
            </p>
          </div>

          <CurrentStepComponent
            data={{ organizationData, departments }}
            onChange={{ setOrganizationData, setDepartments }}
            onNext={nextStep}
            onPrev={prevStep}
            onComplete={onComplete}
            onSave={handleSaveData}
            saving={saving}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
          />
        </GlassCard>
      </div>
    </div>
  );
};

// Welcome Step Component
const WelcomeStep: React.FC<any> = ({ onNext, isFirstStep }) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto bg-sky-600/20 rounded-full flex items-center justify-center">
        <Icon 
          path="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
          className="w-12 h-12 text-sky-400" 
        />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-slate-100 mb-4">
          Ready to Transform Your Organisation?
        </h3>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Aesyros Align helps you create strategic alignment from vision to execution. 
          We'll guide you through setting up your organisation's foundation, structure, 
          and goals using proven OKR methodology.
        </p>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 max-w-md mx-auto">
        <h4 className="font-medium text-slate-200 mb-3">What we'll cover:</h4>
        <ul className="text-sm text-slate-300 space-y-2">
          <li className="flex items-center gap-2">
            <Icon path="M5 13l4 4L19 7" className="w-4 h-4 text-green-400" />
            Organisation basics and identity
          </li>
          <li className="flex items-center gap-2">
            <Icon path="M5 13l4 4L19 7" className="w-4 h-4 text-green-400" />
            Vision, mission, and core values
          </li>
          <li className="flex items-center gap-2">
            <Icon path="M5 13l4 4L19 7" className="w-4 h-4 text-green-400" />
            Department and team structure
          </li>
        </ul>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-medium"
        >
          Begin Your Journey
          <Icon path="M14 5l7 7m0 0l-7 7m7-7H3" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Organization Step Component
const OrganizationStep: React.FC<any> = ({ data, onChange, onNext, onPrev }) => {
  const { organizationData } = data;
  const { setOrganizationData } = onChange;

  const canProceed = organizationData.name.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="max-w-md mx-auto">
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Organisation Name *
        </label>
        <input
          type="text"
          value={organizationData.name}
          onChange={(e) => setOrganizationData({ ...organizationData, name: e.target.value })}
          placeholder="Enter your organisation's name"
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
        />
        <p className="text-xs text-slate-400 mt-2">
          This will be displayed throughout the platform and in reports.
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Icon path="M10 19l-7-7m0 0l7-7m-7 7h18" className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          Continue
          <Icon path="M14 5l7 7m0 0l-7 7m7-7H3" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Vision Mission Step Component
const VisionMissionStep: React.FC<any> = ({ data, onChange, onNext, onPrev }) => {
  const { organizationData } = data;
  const { setOrganizationData } = onChange;

  const addCoreValue = () => {
    setOrganizationData({
      ...organizationData,
      core_values: [...organizationData.core_values, '']
    });
  };

  const updateCoreValue = (index: number, value: string) => {
    const newValues = [...organizationData.core_values];
    newValues[index] = value;
    setOrganizationData({
      ...organizationData,
      core_values: newValues
    });
  };

  const removeCoreValue = (index: number) => {
    const newValues = organizationData.core_values.filter((_, i) => i !== index);
    setOrganizationData({
      ...organizationData,
      core_values: newValues
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <p className="text-slate-300">
          These foundational elements will guide your organisation's strategic decisions and goals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Vision Statement */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Vision Statement
          </label>
          <textarea
            value={organizationData.vision_statement}
            onChange={(e) => setOrganizationData({ ...organizationData, vision_statement: e.target.value })}
            placeholder="Where do you see your organisation in the future?"
            className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white resize-none focus:border-sky-500 focus:outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">
            Your aspirational view of the future
          </p>
        </div>

        {/* Mission Statement */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Mission Statement
          </label>
          <textarea
            value={organizationData.mission_statement}
            onChange={(e) => setOrganizationData({ ...organizationData, mission_statement: e.target.value })}
            placeholder="What does your organisation do and why?"
            className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white resize-none focus:border-sky-500 focus:outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">
            Your purpose and what you do today
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Core Values
        </label>
        <div className="space-y-3">
          {organizationData.core_values.map((value, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={value}
                onChange={(e) => updateCoreValue(index, e.target.value)}
                placeholder="Enter a core value"
                className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
              />
              {organizationData.core_values.length > 1 && (
                <button
                  onClick={() => removeCoreValue(index)}
                  className="p-3 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addCoreValue}
          className="flex items-center gap-2 mt-3 p-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-sky-500 hover:text-sky-400 transition-colors w-full"
        >
          <Icon path="M12 4v16m8-8H4" className="w-5 h-5" />
          Add Core Value
        </button>
        <p className="text-xs text-slate-400 mt-1">
          The principles that guide your organisation's behaviour
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Icon path="M10 19l-7-7m0 0l7-7m-7 7h18" className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
        >
          Continue
          <Icon path="M14 5l7 7m0 0l-7 7m7-7H3" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Structure Step Component
const StructureStep: React.FC<any> = ({ data, onChange, onNext, onPrev }) => {
  const { departments } = data;
  const { setDepartments } = onChange;

  const addDepartment = () => {
    setDepartments([...departments, { name: '', teams: [''] }]);
  };

  const updateDepartmentName = (deptIndex: number, name: string) => {
    const newDepartments = [...departments];
    newDepartments[deptIndex].name = name;
    setDepartments(newDepartments);
  };

  const removeDepartment = (deptIndex: number) => {
    const newDepartments = departments.filter((_, i) => i !== deptIndex);
    setDepartments(newDepartments);
  };

  const addTeam = (deptIndex: number) => {
    const newDepartments = [...departments];
    newDepartments[deptIndex].teams.push('');
    setDepartments(newDepartments);
  };

  const updateTeamName = (deptIndex: number, teamIndex: number, name: string) => {
    const newDepartments = [...departments];
    newDepartments[deptIndex].teams[teamIndex] = name;
    setDepartments(newDepartments);
  };

  const removeTeam = (deptIndex: number, teamIndex: number) => {
    const newDepartments = [...departments];
    newDepartments[deptIndex].teams = newDepartments[deptIndex].teams.filter((_, i) => i !== teamIndex);
    setDepartments(newDepartments);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-slate-300">
          Define your organisation's structure. This helps with goal alignment and responsibility assignment.
        </p>
      </div>

      <div className="space-y-6">
        {departments.map((department, deptIndex) => (
          <div key={deptIndex} className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
            <div className="flex gap-3 mb-4">
              <input
                value={department.name}
                onChange={(e) => updateDepartmentName(deptIndex, e.target.value)}
                placeholder="Department name (e.g., Engineering, Marketing)"
                className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-sky-500 focus:outline-none"
              />
              {departments.length > 1 && (
                <button
                  onClick={() => removeDepartment(deptIndex)}
                  className="p-3 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="ml-4 space-y-2">
              <label className="block text-sm font-medium text-slate-300">Teams</label>
              {department.teams.map((team, teamIndex) => (
                <div key={teamIndex} className="flex gap-2">
                  <input
                    value={team}
                    onChange={(e) => updateTeamName(deptIndex, teamIndex, e.target.value)}
                    placeholder="Team name (e.g., Frontend, Content)"
                    className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                  {department.teams.length > 1 && (
                    <button
                      onClick={() => removeTeam(deptIndex, teamIndex)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Icon path="M6 18L18 6M6 6l12 12" className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addTeam(deptIndex)}
                className="flex items-center gap-2 mt-2 p-2 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-sky-500 hover:text-sky-400 transition-colors text-sm w-full"
              >
                <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
                Add Team
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addDepartment}
        className="flex items-center gap-2 p-4 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-sky-500 hover:text-sky-400 transition-colors w-full"
      >
        <Icon path="M12 4v16m8-8H4" className="w-5 h-5" />
        Add Department
      </button>

      <div className="flex justify-between pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Icon path="M10 19l-7-7m0 0l7-7m-7 7h18" className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
        >
          Continue
          <Icon path="M14 5l7 7m0 0l-7 7m7-7H3" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Complete Step Component
const CompleteStep: React.FC<any> = ({ onComplete, data, saving, onSave }) => {
  const { organizationData, departments } = data;

  const handleComplete = async () => {
    await onSave();
    onComplete();
  };

  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto bg-green-600/20 rounded-full flex items-center justify-center">
        <Icon 
          path="M5 13l4 4L19 7" 
          className="w-12 h-12 text-green-400" 
        />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-slate-100 mb-4">
          Setup Complete!
        </h3>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Congratulations! You've successfully set up {organizationData.name} with {departments.length} departments. 
          You're now ready to start creating strategic objectives and driving alignment across your organisation.
        </p>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6 max-w-md mx-auto">
        <h4 className="font-medium text-slate-200 mb-3">What's next:</h4>
        <ul className="text-sm text-slate-300 space-y-2">
          <li className="flex items-center gap-2">
            <Icon path="M12 4v16m8-8H4" className="w-4 h-4 text-sky-400" />
            Create your first company objective
          </li>
          <li className="flex items-center gap-2">
            <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" className="w-4 h-4 text-sky-400" />
            Invite team members
          </li>
          <li className="flex items-center gap-2">
            <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-4 h-4 text-sky-400" />
            Monitor progress on dashboard
          </li>
        </ul>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleComplete}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors font-medium"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              Start Using Align
              <Icon path="M13 7l5 5m0 0l-5 5m5-5H6" className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SetupWizard;