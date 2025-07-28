import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface LogPeriodProps {
  onNavigate?: (screen: string) => void;
}

export function LogPeriod({ onNavigate }: LogPeriodProps = {}) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  // New wellness tracking fields
  const [crampIntensity, setCrampIntensity] = useState<number>(0);
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [cravings, setCravings] = useState<string[]>([]);
  const [hungerLevel, setHungerLevel] = useState<number>(3);
  const [sleepQuality, setSleepQuality] = useState<number>(3);
  const [stressLevel, setStressLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [emotionalState, setEmotionalState] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);

  const logCycleEntry = useMutation(api.cycles.logCycleEntryEnhanced);
  const userPreferences = useQuery(api.cycles.getUserPreferences);

  const symptomOptions = [
    { id: 'cramps', label: 'Cramps', icon: '🤕' },
    { id: 'bloating', label: 'Bloating', icon: '🎈' },
    { id: 'headache', label: 'Headache', icon: '🤯' },
    { id: 'fatigue', label: 'Fatigue', icon: '😴' },
    { id: 'acne', label: 'Acne', icon: '🔴' },
    { id: 'cravings', label: 'Cravings', icon: '🍫' },
    { id: 'tender_breasts', label: 'Tender Breasts', icon: '💔' },
    { id: 'mood_swings', label: 'Mood Swings', icon: '🎭' },
  ];

  const cravingOptions = [
    { id: 'sweet', label: 'Sweet', icon: '🍰' },
    { id: 'salty', label: 'Salty', icon: '🍟' },
    { id: 'chocolate', label: 'Chocolate', icon: '🍫' },
    { id: 'carbs', label: 'Carbs', icon: '🍞' },
    { id: 'dairy', label: 'Dairy', icon: '🧀' },
    { id: 'fruits', label: 'Fruits', icon: '🍎' },
    { id: 'spicy', label: 'Spicy', icon: '🌶️' },
    { id: 'none', label: 'None', icon: '❌' },
  ];

  const emotionalOptions = [
    { id: 'anxious', label: 'Anxious', icon: '😰' },
    { id: 'calm', label: 'Calm', icon: '😌' },
    { id: 'irritable', label: 'Irritable', icon: '😤' },
    { id: 'happy', label: 'Happy', icon: '😊' },
    { id: 'sad', label: 'Sad', icon: '😢' },
    { id: 'stressed', label: 'Stressed', icon: '😓' },
    { id: 'energetic', label: 'Energetic', icon: '⚡' },
    { id: 'tired', label: 'Tired', icon: '😴' },
  ];

  const toggleSymptom = (symptomId: string) => {
    setSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const toggleCraving = (cravingId: string) => {
    if (cravingId === 'none') {
      setCravings([]);
    } else {
      setCravings(prev => {
        const withoutNone = prev.filter(c => c !== 'none');
        return withoutNone.includes(cravingId)
          ? withoutNone.filter(c => c !== cravingId)
          : [...withoutNone, cravingId];
      });
    }
  };

  const toggleEmotional = (emotionalId: string) => {
    setEmotionalState(prev => 
      prev.includes(emotionalId) 
        ? prev.filter(e => e !== emotionalId)
        : [...prev, emotionalId]
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await logCycleEntry({
        date,
        flow,
        mood,
        symptoms,
        notes: notes.trim() || undefined,
        crampIntensity: crampIntensity > 0 ? crampIntensity : undefined,
        energyLevel,
        cravings: cravings.length > 0 ? cravings : undefined,
        hungerLevel,
        sleepQuality,
        stressLevel,
        emotionalState: emotionalState.length > 0 ? emotionalState : undefined,
      });
      toast.success('Entry logged successfully!');
      
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setFlow('medium');
      setMood('neutral');
      setSymptoms([]);
      setNotes('');
      setCrampIntensity(0);
      setEnergyLevel('medium');
      setCravings([]);
      setHungerLevel(3);
      setSleepQuality(3);
      setStressLevel('medium');
      setEmotionalState([]);
      
      // Navigate back to dashboard after successful save
      setTimeout(() => {
        onNavigate?.('dashboard');
      }, 1000);
    } catch (error) {
      toast.error('Failed to log entry');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has preferences and what categories are enabled
  const showCrampIntensity = userPreferences?.trackingCategories?.crampIntensity ?? true;
  const showEnergyLevel = userPreferences?.trackingCategories?.energyLevel ?? true;
  const showCravings = userPreferences?.trackingCategories?.cravings ?? true;
  const showHungerLevel = userPreferences?.trackingCategories?.hungerLevel ?? false;
  const showSleepStress = userPreferences?.trackingCategories?.sleepStress ?? true;
  const showEmotionalState = userPreferences?.trackingCategories?.emotionalState ?? true;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">Log Your Entry</h1>
        <p className="text-[#867B9F] text-sm">Track your cycle and wellness</p>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 rounded-2xl border border-[#F5EAE3] focus:border-[#FF2E74] focus:ring-1 focus:ring-[#FF2E74] outline-none"
        />
      </div>

      {/* Flow Intensity */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <label className="block text-sm font-semibold text-[#2C2C2C] mb-4">Flow Intensity</label>
        <div className="flex space-x-3">
          {(['light', 'medium', 'heavy'] as const).map((flowType) => (
            <button
              key={flowType}
              onClick={() => setFlow(flowType)}
              className={`
                flex-1 py-3 px-4 rounded-[28px] font-semibold text-sm transition-colors
                ${flow === flowType 
                  ? 'bg-[#FF2E74] text-white' 
                  : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                }
              `}
            >
              {flowType.charAt(0).toUpperCase() + flowType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <label className="block text-sm font-semibold text-[#2C2C2C] mb-4">How are you feeling?</label>
        <div className="flex justify-center space-x-6">
          {[
            { mood: 'happy' as const, emoji: '😌', label: 'Good' },
            { mood: 'neutral' as const, emoji: '😐', label: 'Okay' },
            { mood: 'sad' as const, emoji: '😖', label: 'Not great' },
          ].map(({ mood: moodType, emoji, label }) => (
            <button
              key={moodType}
              onClick={() => setMood(moodType)}
              className={`
                flex flex-col items-center p-4 rounded-2xl transition-colors
                ${mood === moodType 
                  ? 'bg-[#FF2E74] text-white' 
                  : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                }
              `}
            >
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="text-xs font-medium">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cramp Intensity */}
      {showCrampIntensity && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-4">Cramp Intensity</label>
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setCrampIntensity(level)}
                className={`
                  flex-1 py-3 px-2 rounded-2xl text-sm font-medium transition-colors
                  ${crampIntensity === level 
                    ? 'bg-[#FF2E74] text-white' 
                    : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                  }
                `}
              >
                {level === 0 ? 'None' : level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Energy Level */}
      {showEnergyLevel && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-4">Energy Level</label>
          <div className="flex space-x-3">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setEnergyLevel(level)}
                className={`
                  flex-1 py-3 px-4 rounded-[28px] font-semibold text-sm transition-colors
                  ${energyLevel === level 
                    ? 'bg-[#FF2E74] text-white' 
                    : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                  }
                `}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cravings */}
      {showCravings && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-4">Cravings</label>
          <div className="grid grid-cols-2 gap-3">
            {cravingOptions.map((craving) => (
              <button
                key={craving.id}
                onClick={() => toggleCraving(craving.id)}
                className={`
                  flex items-center space-x-2 p-3 rounded-2xl text-sm font-medium transition-colors
                  ${cravings.includes(craving.id)
                    ? 'bg-[#FF2E74] text-white'
                    : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                  }
                `}
              >
                <span>{craving.icon}</span>
                <span>{craving.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hunger Level */}
      {showHungerLevel && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-4">Hunger Level</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setHungerLevel(level)}
                className={`
                  flex-1 py-3 px-2 rounded-2xl text-sm font-medium transition-colors
                  ${hungerLevel === level 
                    ? 'bg-[#FF2E74] text-white' 
                    : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                  }
                `}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sleep Quality */}
      {showSleepStress && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-4">Sleep Quality</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setSleepQuality(level)}
                className={`
                  flex-1 py-3 px-2 rounded-2xl text-sm font-medium transition-colors
                  ${sleepQuality === level 
                    ? 'bg-[#FF2E74] text-white' 
                    : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                  }
                `}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stress Level */}
      {showSleepStress && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-4">Stress Level</label>
          <div className="flex space-x-3">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setStressLevel(level)}
                className={`
                  flex-1 py-3 px-4 rounded-[28px] font-semibold text-sm transition-colors
                  ${stressLevel === level 
                    ? 'bg-[#FF2E74] text-white' 
                    : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                  }
                `}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emotional State */}
      {showEmotionalState && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-4">Emotional State</label>
          <div className="grid grid-cols-2 gap-3">
            {emotionalOptions.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => toggleEmotional(emotion.id)}
                className={`
                  flex items-center space-x-2 p-3 rounded-2xl text-sm font-medium transition-colors
                  ${emotionalState.includes(emotion.id)
                    ? 'bg-[#FF2E74] text-white'
                    : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                  }
                `}
              >
                <span>{emotion.icon}</span>
                <span>{emotion.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Symptoms */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <label className="block text-sm font-semibold text-[#2C2C2C] mb-4">Symptoms</label>
        <div className="grid grid-cols-2 gap-3">
          {symptomOptions.map((symptom) => (
            <button
              key={symptom.id}
              onClick={() => toggleSymptom(symptom.id)}
              className={`
                flex items-center space-x-2 p-3 rounded-2xl text-sm font-medium transition-colors
                ${symptoms.includes(symptom.id)
                  ? 'bg-[#FF2E74] text-white'
                  : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                }
              `}
            >
              <span>{symptom.icon}</span>
              <span>{symptom.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How are you feeling today? Any additional symptoms or thoughts..."
          className="w-full p-3 rounded-2xl border border-[#F5EAE3] focus:border-[#FF2E74] focus:ring-1 focus:ring-[#FF2E74] outline-none resize-none h-24"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full bg-[#FF2E74] text-white font-bold py-4 px-6 rounded-[28px] text-lg hover:bg-[#B06B94] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Saving...' : 'Save Entry'}
      </button>
    </div>
  );
}
