import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function CycleHistory() {
  const cycles = useQuery(api.cycles.getUserCycles);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFlowColor = (flow: string) => {
    switch (flow) {
      case 'light': return 'bg-[#E2F0CB] text-[#2C2C2C]';
      case 'medium': return 'bg-[#867B9F] text-white';
      case 'heavy': return 'bg-[#FF2E74] text-white';
      default: return 'bg-[#F5EAE3] text-[#2C2C2C]';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😌';
      case 'neutral': return '😐';
      case 'sad': return '😖';
      default: return '😐';
    }
  };

  const getSymptomEmoji = (symptom: string) => {
    const symptomMap: Record<string, string> = {
      'cramps': '🤕',
      'bloating': '🎈',
      'headache': '🤯',
      'fatigue': '😴',
      'acne': '🔴',
      'cravings': '🍫',
      'tender_breasts': '💔',
      'mood_swings': '🎭',
    };
    return symptomMap[symptom] || '•';
  };

  const getSymptomLabel = (symptom: string) => {
    const labelMap: Record<string, string> = {
      'cramps': 'Cramps',
      'bloating': 'Bloating',
      'headache': 'Headache',
      'fatigue': 'Fatigue',
      'acne': 'Acne',
      'cravings': 'Cravings',
      'tender_breasts': 'Tender Breasts',
      'mood_swings': 'Mood Swings',
    };
    return labelMap[symptom] || symptom;
  };

  if (!cycles || cycles.length === 0) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">Cycle History</h1>
          <p className="text-[#867B9F] text-sm">Your logged period data</p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#F5EAE3] text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">No data yet</h3>
          <p className="text-[#867B9F] text-sm mb-6">
            Start logging your periods to see your cycle history here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">Cycle History</h1>
        <p className="text-[#867B9F] text-sm">Your logged period data</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#F5EAE3] text-center">
          <div className="text-2xl font-bold text-[#FF2E74] mb-1">{cycles.length}</div>
          <div className="text-xs text-[#2C2C2C]">Total Entries</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#F5EAE3] text-center">
          <div className="text-2xl font-bold text-[#867B9F] mb-1">
            {cycles.length > 0 ? Math.round(cycles.length / 3) || 1 : 0}
          </div>
          <div className="text-xs text-[#2C2C2C]">Months Tracked</div>
        </div>
      </div>

      {/* Cycle Entries */}
      <div className="space-y-4">
        {cycles.map((cycle) => (
          <div
            key={cycle._id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]"
          >
            {/* Date and Flow */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-[#2C2C2C]">
                  {formatDate(cycle.date)}
                </h3>
                <p className="text-xs text-[#867B9F]">
                  {Math.floor((Date.now() - new Date(cycle.date).getTime()) / (1000 * 60 * 60 * 24))} days ago
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getFlowColor(cycle.flow)}`}>
                {cycle.flow.charAt(0).toUpperCase() + cycle.flow.slice(1)} Flow
              </div>
            </div>

            {/* Mood */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-lg">{getMoodEmoji(cycle.mood)}</div>
              <div>
                <div className="text-sm font-medium text-[#2C2C2C]">
                  Feeling {cycle.mood === 'happy' ? 'good' : cycle.mood === 'neutral' ? 'okay' : 'not great'}
                </div>
              </div>
            </div>

            {/* Symptoms */}
            {cycle.symptoms.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-[#2C2C2C] mb-2">Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                  {cycle.symptoms.map((symptom, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 bg-[#F5EAE3] px-3 py-1 rounded-full text-xs"
                    >
                      <span>{getSymptomEmoji(symptom)}</span>
                      <span className="text-[#2C2C2C]">{getSymptomLabel(symptom)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {cycle.notes && (
              <div className="bg-[#F5EAE3] rounded-2xl p-3">
                <h4 className="text-sm font-semibold text-[#2C2C2C] mb-1">Notes</h4>
                <p className="text-sm text-[#2C2C2C]">{cycle.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
