import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface FertilityLogModalProps {
  date: string;
  onClose: () => void;
  existingLogs?: any[];
}

export function FertilityLogModal({ date, onClose, existingLogs = [] }: FertilityLogModalProps) {
  const [activeTab, setActiveTab] = useState<'intercourse' | 'ovulation' | 'artificial' | 'symptoms'>('intercourse');
  const [isLoading, setIsLoading] = useState(false);
  
  // Intercourse state
  const [protectedSex, setProtectedSex] = useState(false);
  const [intercourseNotes, setIntercourseNotes] = useState('');
  
  // Ovulation test state
  const [ovulationResult, setOvulationResult] = useState<'positive' | 'negative'>('negative');
  const [ovulationBrand, setOvulationBrand] = useState('');
  const [ovulationNotes, setOvulationNotes] = useState('');
  
  // Artificial fertilization state
  const [fertilizationMethod, setFertilizationMethod] = useState<'iui' | 'ivf' | 'icsi' | 'other'>('iui');
  const [clinic, setClinic] = useState('');
  const [doctor, setDoctor] = useState('');
  const [fertilizationNotes, setFertilizationNotes] = useState('');
  
  // Symptoms state
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomIntensity, setSymptomIntensity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [symptomNotes, setSymptomNotes] = useState('');

  const logFertilityEntry = useMutation(api.cycles.logFertilityEntry);

  const symptomOptions = [
    { id: 'cervical_mucus', label: 'Cervical Mucus', icon: '💧' },
    { id: 'ovulation_pain', label: 'Ovulation Pain', icon: '🤕' },
    { id: 'breast_tenderness', label: 'Breast Tenderness', icon: '💔' },
    { id: 'bloating', label: 'Bloating', icon: '🎈' },
    { id: 'mood_swings', label: 'Mood Swings', icon: '🎭' },
    { id: 'fatigue', label: 'Fatigue', icon: '😴' },
    { id: 'libido_increase', label: 'Increased Libido', icon: '❤️' },
    { id: 'basal_temp', label: 'Basal Temp Rise', icon: '🌡️' },
  ];

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let details: any;
      
      switch (activeTab) {
        case 'intercourse':
          details = {
            intercourse: {
              protected: protectedSex,
              notes: intercourseNotes.trim() || undefined,
            }
          };
          break;
        case 'ovulation':
          details = {
            ovulationTest: {
              result: ovulationResult,
              brand: ovulationBrand.trim() || undefined,
              notes: ovulationNotes.trim() || undefined,
            }
          };
          break;
        case 'artificial':
          details = {
            artificialFertilization: {
              method: fertilizationMethod,
              clinic: clinic.trim() || undefined,
              doctor: doctor.trim() || undefined,
              notes: fertilizationNotes.trim() || undefined,
            }
          };
          break;
        case 'symptoms':
          details = {
            symptoms: {
              symptoms: selectedSymptoms,
              intensity: symptomIntensity,
              notes: symptomNotes.trim() || undefined,
            }
          };
          break;
      }

      await logFertilityEntry({
        date,
        type: activeTab === 'intercourse' ? 'intercourse' : 
              activeTab === 'ovulation' ? 'ovulation_test' :
              activeTab === 'artificial' ? 'artificial_fertilization' : 'symptoms',
        details,
      });

      toast.success('Fertility entry logged successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to log fertility entry');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl p-6 border-b border-[#F5EAE3]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#FF2E74]">Log for {formatDate(date)}</h3>
            <button 
              onClick={onClose}
              className="text-[#FF2E74] font-bold text-lg hover:text-[#D92663] transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6">
          <div className="flex space-x-2 mb-6">
            {[
              { id: 'intercourse', label: 'Intercourse', icon: '❤️' },
              { id: 'ovulation', label: 'Ovulation Test', icon: '🧪' },
              { id: 'artificial', label: 'Artificial Fertilization', icon: '🏥' },
              { id: 'symptoms', label: 'Symptoms', icon: '🤒' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex-1 py-2 px-3 rounded-2xl text-xs font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-[#FF2E74] text-white' 
                    : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                  }
                `}
              >
                <div className="text-sm mb-1">{tab.icon}</div>
                <div>{tab.label}</div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'intercourse' && (
              <div className="space-y-4">
                <div className="bg-[#F5EAE3] rounded-2xl p-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={protectedSex}
                      onChange={(e) => setProtectedSex(e.target.checked)}
                      className="w-4 h-4 text-[#FF2E74] rounded focus:ring-[#FF2E74]"
                    />
                    <span className="text-sm font-medium text-[#2C2C2C]">Protected intercourse</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Notes (Optional)</label>
                  <textarea
                    value={intercourseNotes}
                    onChange={(e) => setIntercourseNotes(e.target.value)}
                    placeholder="Any additional notes..."
                    className="w-full p-3 rounded-2xl border border-[#F5EAE3] focus:border-[#FF2E74] focus:ring-1 focus:ring-[#FF2E74] outline-none resize-none h-20"
                  />
                </div>
              </div>
            )}

            {activeTab === 'ovulation' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-3">Test Result</label>
                  <div className="flex space-x-3">
                    {(['positive', 'negative'] as const).map((result) => (
                      <button
                        key={result}
                        onClick={() => setOvulationResult(result)}
                        className={`
                          flex-1 py-3 px-4 rounded-2xl font-medium text-sm transition-colors
                          ${ovulationResult === result 
                            ? 'bg-[#FF2E74] text-white' 
                            : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                          }
                        `}
                      >
                        {result.charAt(0).toUpperCase() + result.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Brand (Optional)</label>
                  <input
                    type="text"
                    value={ovulationBrand}
                    onChange={(e) => setOvulationBrand(e.target.value)}
                    placeholder="e.g., Clearblue, First Response..."
                    className="w-full p-3 rounded-2xl border border-[#F5EAE3] focus:border-[#FF2E74] focus:ring-1 focus:ring-[#FF2E74] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Notes (Optional)</label>
                  <textarea
                    value={ovulationNotes}
                    onChange={(e) => setOvulationNotes(e.target.value)}
                    placeholder="Any additional notes..."
                    className="w-full p-3 rounded-2xl border border-[#F5EAE3] focus:border-[#FF2E74] focus:ring-1 focus:ring-[#FF2E74] outline-none resize-none h-20"
                  />
                </div>
              </div>
            )}

            {activeTab === 'artificial' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-3">Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { id: 'iui', label: 'IUI', desc: 'Intrauterine Insemination' },
                      { id: 'ivf', label: 'IVF', desc: 'In Vitro Fertilization' },
                      { id: 'icsi', label: 'ICSI', desc: 'Intracytoplasmic Sperm Injection' },
                      { id: 'other', label: 'Other', desc: 'Other method' },
                    ] as const).map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setFertilizationMethod(method.id)}
                        className={`
                          p-3 rounded-2xl text-sm transition-colors text-left
                          ${fertilizationMethod === method.id 
                            ? 'bg-[#FF2E74] text-white' 
                            : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                          }
                        `}
                      >
                        <div className="font-medium">{method.label}</div>
                        <div className="text-xs opacity-75">{method.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Clinic (Optional)</label>
                  <input
                    type="text"
                    value={clinic}
                    onChange={(e) => setClinic(e.target.value)}
                    placeholder="Clinic name..."
                    className="w-full p-3 rounded-2xl border border-[#F5EAE3] focus:border-[#FF2E74] focus:ring-1 focus:ring-[#FF2E74] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Doctor (Optional)</label>
                  <input
                    type="text"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="Doctor name..."
                    className="w-full p-3 rounded-2xl border border-[#F5EAE3] focus:border-[#FF2E74] focus:ring-1 focus:ring-[#FF2E74] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Notes (Optional)</label>
                  <textarea
                    value={fertilizationNotes}
                    onChange={(e) => setFertilizationNotes(e.target.value)}
                    placeholder="Any additional notes about the procedure..."
                    className="w-full p-3 rounded-2xl border border-[#F5EAE3] focus:border-[#FF2E74] focus:ring-1 focus:ring-[#FF2E74] outline-none resize-none h-20"
                  />
                </div>
              </div>
            )}

            {activeTab === 'symptoms' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-3">Fertility Symptoms</label>
                  <div className="grid grid-cols-2 gap-3">
                    {symptomOptions.map((symptom) => (
                      <button
                        key={symptom.id}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`
                          flex items-center space-x-2 p-3 rounded-2xl text-sm font-medium transition-colors
                          ${selectedSymptoms.includes(symptom.id)
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

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-3">Intensity</label>
                  <div className="flex space-x-3">
                    {(['mild', 'moderate', 'severe'] as const).map((intensity) => (
                      <button
                        key={intensity}
                        onClick={() => setSymptomIntensity(intensity)}
                        className={`
                          flex-1 py-3 px-4 rounded-2xl font-medium text-sm transition-colors
                          ${symptomIntensity === intensity 
                            ? 'bg-[#FF2E74] text-white' 
                            : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'
                          }
                        `}
                      >
                        {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Notes (Optional)</label>
                  <textarea
                    value={symptomNotes}
                    onChange={(e) => setSymptomNotes(e.target.value)}
                    placeholder="Any additional notes about your symptoms..."
                    className="w-full p-3 rounded-2xl border border-[#F5EAE3] focus:border-[#FF2E74] focus:ring-1 focus:ring-[#FF2E74] outline-none resize-none h-20"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-6">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-[#FF2E74] text-white font-bold py-4 px-6 rounded-[28px] text-lg hover:bg-[#B06B94] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 