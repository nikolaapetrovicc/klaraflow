import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const userPreferences = useQuery(api.cycles.getUserPreferences);
  const updateUserPreferences = useMutation(api.cycles.updateUserPreferences);

  const [trackingCategories, setTrackingCategories] = useState({
    ovulation: userPreferences?.trackingCategories?.ovulation ?? false,
    pmsSymptoms: userPreferences?.trackingCategories?.pmsSymptoms ?? true,
    sexLogs: userPreferences?.trackingCategories?.sexLogs ?? false,
    emotionalState: userPreferences?.trackingCategories?.emotionalState ?? true,
    cravings: userPreferences?.trackingCategories?.cravings ?? true,
    crampIntensity: userPreferences?.trackingCategories?.crampIntensity ?? true,
    sleepStress: userPreferences?.trackingCategories?.sleepStress ?? true,
    energyLevel: userPreferences?.trackingCategories?.energyLevel ?? true,
    hungerLevel: userPreferences?.trackingCategories?.hungerLevel ?? false,
  });

  const [purposeMode, setPurposeMode] = useState(userPreferences?.purposeMode ?? 'cycle_tracking');

  const purposeOptions = [
    {
      id: 'cycle_tracking' as const,
      title: 'Just Tracking My Cycle',
      description: 'Basic period and cycle tracking',
      icon: '📅',
    },
    {
      id: 'ttc' as const,
      title: 'Trying to Conceive',
      description: 'Fertility tracking and ovulation monitoring',
      icon: '🤰',
    },
    {
      id: 'wellness_tracking' as const,
      title: 'Symptom + Wellness Tracking',
      description: 'Comprehensive health and wellness monitoring',
      icon: '🌱',
    },
    {
      id: 'pregnancy' as const,
      title: 'Pregnancy Mode',
      description: 'Pregnancy tracking and monitoring',
      icon: '👶',
    },
  ];

  const trackingOptions = [
    { id: 'ovulation', label: 'Ovulation Tracking', description: 'Track ovulation tests and fertile windows' },
    { id: 'pmsSymptoms', label: 'PMS Symptoms', description: 'Track premenstrual symptoms' },
    { id: 'sexLogs', label: 'Sex Logs', description: 'Track intercourse and protection' },
    { id: 'emotionalState', label: 'Emotional State', description: 'Track mood and emotional changes' },
    { id: 'cravings', label: 'Cravings', description: 'Track food cravings and preferences' },
    { id: 'crampIntensity', label: 'Cramp Intensity', description: 'Track pain levels and cramp intensity' },
    { id: 'sleepStress', label: 'Sleep & Stress', description: 'Track sleep quality and stress levels' },
    { id: 'energyLevel', label: 'Energy Level', description: 'Track daily energy levels' },
    { id: 'hungerLevel', label: 'Hunger Level', description: 'Track appetite and hunger patterns' },
  ];

  const handleToggleTracking = (category: string) => {
    setTrackingCategories(prev => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev]
    }));
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      await updateUserPreferences({
        purposeMode,
        trackingCategories,
      });
      toast.success('Preferences updated successfully!');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-[#FF2E74] rounded-full flex items-center justify-center text-white text-4xl font-bold">
          👤
        </div>
        <h1 className="text-3xl font-bold text-[#FF2E74] mb-2">Profile & Settings</h1>
        <p className="text-[#867B9F] text-base">Customize your tracking experience</p>
      </div>

      {/* Purpose Mode */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">Your Purpose</h2>
        <div className="space-y-3">
          {purposeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setPurposeMode(option.id)}
              className={`
                w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left
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
      </div>

      {/* Tracking Categories */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">Tracking Preferences</h2>
        <p className="text-[#867B9F] text-sm mb-4">Choose what you want to track in your daily logs</p>
        <div className="space-y-4">
          {trackingOptions.map((option) => (
            <div key={option.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#F5EAE3]">
              <div className="flex-1">
                <h3 className="font-semibold text-[#2C2C2C] text-sm">{option.label}</h3>
                <p className="text-[#867B9F] text-xs">{option.description}</p>
              </div>
              <button
                onClick={() => handleToggleTracking(option.id)}
                className={`
                  w-12 h-6 rounded-full transition-colors relative
                  ${trackingCategories[option.id as keyof typeof trackingCategories]
                    ? 'bg-[#FF2E74]'
                    : 'bg-[#867B9F]'
                  }
                `}
              >
                <div className={`
                  w-4 h-4 bg-white rounded-full absolute top-1 transition-transform
                  ${trackingCategories[option.id as keyof typeof trackingCategories]
                    ? 'translate-x-6'
                    : 'translate-x-1'
                  }
                `} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Content Filtering */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">Content Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5EAE3]">
            <div>
              <h3 className="font-semibold text-[#2C2C2C] text-sm">Show TTC Content</h3>
              <p className="text-[#867B9F] text-xs">Fertility tips and ovulation tracking</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${purposeMode === 'ttc' ? 'bg-[#FF2E74]' : 'bg-[#867B9F]'}`} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5EAE3]">
            <div>
              <h3 className="font-semibold text-[#2C2C2C] text-sm">Show Pregnancy Content</h3>
              <p className="text-[#867B9F] text-xs">Pregnancy tracking and monitoring</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${purposeMode === 'pregnancy' ? 'bg-[#FF2E74]' : 'bg-[#867B9F]'}`} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5EAE3]">
            <div>
              <h3 className="font-semibold text-[#2C2C2C] text-sm">Show Wellness Tips</h3>
              <p className="text-[#867B9F] text-xs">Health and wellness recommendations</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${purposeMode === 'wellness_tracking' || purposeMode === 'cycle_tracking' ? 'bg-[#FF2E74]' : 'bg-[#867B9F]'}`} />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSavePreferences}
        disabled={isLoading}
        className="w-full bg-[#FF2E74] text-white font-bold py-4 px-6 rounded-[28px] text-lg hover:bg-[#B06B94] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Saving...' : 'Save Preferences'}
      </button>

      {/* About Klara Flow */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">About Klara Flow</h2>
        <div className="space-y-3 text-sm text-[#867B9F]">
          <p>
            <strong className="text-[#FF2E74]">Developed by Klara AI SL</strong> - 
            A modern women's health tracking application designed with inclusivity and personalization in mind.
          </p>
          <p>
            Built with React, TypeScript, and Tailwind CSS for optimal performance and beautiful user experience.
          </p>
          <p>
            Version 1.0.0 • Made with ❤️ for women's health
          </p>
        </div>
      </div>
    </div>
  );
} 