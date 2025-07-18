import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface LogPeriodProps {
  onNavigate?: (screen: 'dashboard' | 'log' | 'insights' | 'history' | 'calendar') => void;
}

export function LogPeriod({ onNavigate }: LogPeriodProps = {}) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const logCycleEntry = useMutation(api.cycles.logCycleEntry);

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

  const toggleSymptom = (symptomId: string) => {
    setSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
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
      });
      toast.success('Period logged successfully!');
      
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setFlow('medium');
      setMood('neutral');
      setSymptoms([]);
      setNotes('');
      
      // Navigate back to dashboard after successful save
      setTimeout(() => {
        onNavigate?.('dashboard');
      }, 1000);
    } catch (error) {
      toast.error('Failed to log period');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">Log Your Period</h1>
        <p className="text-[#867B9F] text-sm">Track your cycle and symptoms</p>
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
