import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface OnboardingPurposeProps {
  onComplete: () => void;
}

export function OnboardingPurpose({ onComplete }: OnboardingPurposeProps) {
  const [purposeMode, setPurposeMode] = useState<'cycle_tracking' | 'ttc' | 'wellness_tracking' | 'pregnancy'>('cycle_tracking');
  const [trackingCategories, setTrackingCategories] = useState({
    ovulation: false,
    pmsSymptoms: true,
    sexLogs: false,
    emotionalState: true,
    cravings: true,
    crampIntensity: true,
    sleepStress: true,
    energyLevel: true,
    hungerLevel: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const createUserPreferences = useMutation(api.cycles.createUserPreferences);

  const purposeOptions = [
    {
      id: 'cycle_tracking' as const,
      title: 'Just Tracking My Cycle',
      description: 'Basic period and cycle tracking',
      icon: '📅',
      defaultCategories: {
        ovulation: false,
        pmsSymptoms: true,
        sexLogs: false,
        emotionalState: true,
        cravings: true,
        crampIntensity: true,
        sleepStress: true,
        energyLevel: true,
        hungerLevel: false,
      }
    },
    {
      id: 'ttc' as const,
      title: 'Trying to Conceive',
      description: 'Fertility tracking and ovulation monitoring',
      icon: '🤰',
      defaultCategories: {
        ovulation: true,
        pmsSymptoms: true,
        sexLogs: true,
        emotionalState: true,
        cravings: true,
        crampIntensity: true,
        sleepStress: true,
        energyLevel: true,
        hungerLevel: true,
      }
    },
    {
      id: 'wellness_tracking' as const,
      title: 'Symptom + Wellness Tracking',
      description: 'Comprehensive health and wellness monitoring',
      icon: '🌱',
      defaultCategories: {
        ovulation: false,
        pmsSymptoms: true,
        sexLogs: false,
        emotionalState: true,
        cravings: true,
        crampIntensity: true,
        sleepStress: true,
        energyLevel: true,
        hungerLevel: true,
      }
    },
    {
      id: 'pregnancy' as const,
      title: 'Pregnancy Mode',
      description: 'Pregnancy tracking and monitoring',
      icon: '👶',
      defaultCategories: {
        ovulation: false,
        pmsSymptoms: false,
        sexLogs: false,
        emotionalState: true,
        cravings: true,
        crampIntensity: false,
        sleepStress: true,
        energyLevel: true,
        hungerLevel: true,
      }
    },
  ];

  const handlePurposeSelect = (purpose: typeof purposeMode) => {
    setPurposeMode(purpose);
    const selectedOption = purposeOptions.find(option => option.id === purpose);
    if (selectedOption) {
      setTrackingCategories(selectedOption.defaultCategories);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await createUserPreferences({
        purposeMode,
        trackingCategories,
      });
      toast.success('Preferences saved successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6">
      <div className="max-w-md mx-auto pt-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#FF2E74] rounded-full flex items-center justify-center text-white text-3xl font-bold">
            🎯
          </div>
          <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">What's your goal?</h1>
          <p className="text-[#867B9F] text-base">
            Help us personalize your experience by choosing your primary purpose
          </p>
        </div>

        {/* Purpose Options */}
        <div className="space-y-4 mb-8">
          {purposeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handlePurposeSelect(option.id)}
              className={`
                w-full p-4 rounded-3xl border-2 transition-all duration-200 text-left
                ${purposeMode === option.id 
                  ? 'border-[#FF2E74] bg-[#FF2E74]/5' 
                  : 'border-[#F5EAE3] bg-white hover:border-[#FF2E74]/50'
                }
              `}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2C2C2C] text-lg">{option.title}</h3>
                  <p className="text-[#867B9F] text-sm">{option.description}</p>
                </div>
                {purposeMode === option.id && (
                  <div className="w-6 h-6 bg-[#FF2E74] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Tracking Categories Preview */}
        <div className="bg-white rounded-3xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">What we'll track for you:</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(trackingCategories).map(([key, enabled]) => (
              <div key={key} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-[#FF2E74]' : 'bg-[#F5EAE3]'}`} />
                <span className={`text-sm ${enabled ? 'text-[#2C2C2C]' : 'text-[#867B9F]'}`}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-[#FF2E74] text-white font-bold py-4 px-6 rounded-[28px] text-lg hover:bg-[#B06B94] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Setting up...' : 'Get Started'}
        </button>

        <p className="text-center text-xs text-[#867B9F] mt-4">
          You can change these settings anytime in your profile
        </p>
      </div>
    </div>
  );
} 