import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

interface DashboardProps {
  onNavigate?: (screen: 'dashboard' | 'log' | 'insights' | 'history' | 'calendar') => void;
}

export function Dashboard({ onNavigate }: DashboardProps = {}) {
  const nextPeriodDays = useQuery(api.cycles.getNextPeriodDays);
  const cycles = useQuery(api.cycles.getUserCycles);
  const predictions = useQuery(api.cycles.getPredictions);
  const motivationalQuote = useQuery(api.cycles.getMotivationalQuote);
  const generatePredictions = useMutation(api.cycles.generatePredictions);

  useEffect(() => {
    // Generate predictions when component mounts
    generatePredictions();
  }, [generatePredictions]);

  const getCalendarDays = () => {
    const today = new Date();
    const days = [];
    
    // Get 14 days (7 before, today, 6 after)
    for (let i = -7; i <= 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const isPeriodDay = (date: Date) => {
    if (!cycles) return false;
    const dateStr = date.toISOString().split('T')[0];
    return cycles.some(cycle => cycle.date === dateStr);
  };

  const isPredictedPeriodDay = (date: Date) => {
    if (!predictions || predictions.length === 0) return false;
    const dateStr = date.toISOString().split('T')[0];
    
    return predictions.some(prediction => {
      const startDate = prediction.predictedStart;
      const endDate = prediction.predictedEnd;
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  const isFertileDay = (date: Date) => {
    if (!predictions || predictions.length === 0) return false;
    
    // Calculate fertile window (typically 5 days before ovulation + ovulation day)
    // Ovulation is typically 14 days before next period
    const nextPrediction = predictions[0];
    if (!nextPrediction) return false;
    
    const nextPeriodDate = new Date(nextPrediction.predictedStart);
    const ovulationDate = new Date(nextPeriodDate.getTime() - (14 * 24 * 60 * 60 * 1000));
    const fertileStart = new Date(ovulationDate.getTime() - (5 * 24 * 60 * 60 * 1000));
    
    const dateStr = date.toISOString().split('T')[0];
    const fertileStartStr = fertileStart.toISOString().split('T')[0];
    const ovulationStr = ovulationDate.toISOString().split('T')[0];
    
    return dateStr >= fertileStartStr && dateStr <= ovulationStr;
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">Hello, beautiful</h1>
        <p className="text-[#867B9F] text-sm">How are you feeling today?</p>
      </div>

      {/* Motivational Quote */}
      {motivationalQuote && (
        <div className="bg-gradient-to-r from-[#C27CA3] to-[#867B9F] rounded-3xl p-6 text-white">
          <div className="text-center">
            <div className="text-2xl mb-3">✨</div>
            <p className="text-sm font-medium italic mb-2">"{motivationalQuote.quote}"</p>
            <p className="text-xs opacity-75">— {motivationalQuote.author}</p>
          </div>
        </div>
      )}

      {/* Next Period Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[#2C2C2C] mb-2">Next Period</h2>
          {nextPeriodDays !== null && nextPeriodDays !== undefined ? (
            <div>
              <div className="text-4xl font-bold text-[#C27CA3] mb-1">
                {nextPeriodDays}
              </div>
              <p className="text-[#867B9F] text-sm">
                {nextPeriodDays === 0 ? 'Today' : nextPeriodDays === 1 ? 'day' : 'days'}
              </p>
            </div>
          ) : (
            <div className="text-[#867B9F]">
              <p>Track a few cycles to see predictions</p>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Strip */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#F5EAE3]">
        <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 text-center">This Week</h3>
        <div className="flex justify-between space-x-1">
          {calendarDays.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const isPeriod = isPeriodDay(date);
            const isPredicted = isPredictedPeriodDay(date);
            const isFertile = isFertileDay(date);
            
            return (
              <div
                key={index}
                className={`
                  w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs
                  ${isToday ? 'ring-2 ring-[#C27CA3]' : ''}
                  ${isPeriod ? 'bg-[#C27CA3] text-white' : 
                    isPredicted ? 'bg-[#C27CA3]/50 text-white' :
                    isFertile ? 'bg-[#E2F0CB] text-[#2C2C2C]' : 
                    'bg-[#F5EAE3] text-[#2C2C2C]'}
                `}
              >
                <div className="font-medium">{date.getDate()}</div>
                <div className="text-[10px] opacity-75">
                  {date.toLocaleDateString('en', { weekday: 'short' }).slice(0, 1)}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#C27CA3] rounded"></div>
            <span className="text-[#2C2C2C]">Period</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#C27CA3]/50 rounded"></div>
            <span className="text-[#2C2C2C]">Predicted</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#E2F0CB] rounded"></div>
            <span className="text-[#2C2C2C]">Fertile</span>
          </div>
        </div>
      </div>

      {/* Log Period Button */}
      <button 
        onClick={() => onNavigate?.('log')}
        className="w-full bg-[#C27CA3] text-white font-bold py-4 px-6 rounded-[28px] text-lg hover:bg-[#B06B94] transition-colors shadow-lg"
      >
        Log Period
      </button>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#F5EAE3] text-center">
          <div className="text-2xl font-bold text-[#867B9F] mb-1">
            {cycles && cycles.length >= 2 ? 
              Math.round(cycles.slice(0, 3).reduce((acc, cycle, index, arr) => {
                if (index === 0) return acc;
                const prevDate = new Date(arr[index - 1].date);
                const currDate = new Date(cycle.date);
                const diff = Math.abs((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
                return acc + diff;
              }, 0) / (Math.min(cycles.length, 3) - 1)) : 28
            }
          </div>
          <div className="text-xs text-[#2C2C2C]">Avg Cycle</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#F5EAE3] text-center">
          <div className="text-2xl font-bold text-[#867B9F] mb-1">5</div>
          <div className="text-xs text-[#2C2C2C]">Period Length</div>
        </div>
      </div>

      {/* Recent Entries */}
      {cycles && cycles.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#2C2C2C]">Recent Entries</h3>
            {onNavigate && (
              <button
                onClick={() => onNavigate('history')}
                className="text-[#C27CA3] text-sm font-medium hover:text-[#B06B94] transition-colors"
              >
                View All
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {cycles.slice(0, 3).map((cycle) => (
              <div
                key={cycle._id}
                className="flex items-center justify-between p-3 bg-[#F5EAE3] rounded-2xl"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    cycle.flow === 'light' ? 'bg-[#E2F0CB]' :
                    cycle.flow === 'medium' ? 'bg-[#867B9F]' :
                    'bg-[#C27CA3]'
                  }`}></div>
                  <div>
                    <div className="text-sm font-medium text-[#2C2C2C]">
                      {new Date(cycle.date).toLocaleDateString('en', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-xs text-[#867B9F]">
                      {cycle.flow} flow
                    </div>
                  </div>
                </div>
                
                <div className="text-lg">
                  {cycle.mood === 'happy' ? '😌' : 
                   cycle.mood === 'neutral' ? '😐' : '😖'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
