import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SetupWizard from '../components/SetupWizard';
import { useOrganization } from '../../../hooks/useOrganization';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateVisionMission } = useOrganization();

  const handleWizardComplete = async () => {
    // Navigate to dashboard after setup completion
    navigate('/');
  };

  return (
    <SetupWizard onComplete={handleWizardComplete} />
  );
};

export default OnboardingPage;