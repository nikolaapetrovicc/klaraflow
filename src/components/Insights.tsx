import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Insights() {
  const predictions = useQuery(api.cycles.getPredictions);
  const alerts = useQuery(api.cycles.getAlerts);
  const cycles = useQuery(api.cycles.getUserCycles);
  const aiAdvice = useQuery(api.cycles.getAIAdvice);

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startMonth = startDate.toLocaleDateString('en', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()}–${endDate.getDate()}`;
    } else {
      return `${startMonth} ${startDate.getDate()} – ${endMonth} ${endDate.getDate()}`;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-[#E2F0CB]';
    if (confidence >= 60) return 'text-[#867B9F]';
    return 'text-[#C27CA3]';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">Your Insights</h1>
        <p className="text-[#867B9F] text-sm">AI-powered predictions and personalized advice</p>
      </div>

      {/* AI Advice */}
      {aiAdvice && (
        <div className="bg-gradient-to-r from-[#C27CA3] to-[#867B9F] rounded-3xl p-6 text-white">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">🤖</div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">AI Health Insights</h2>
              <p className="text-sm opacity-90 leading-relaxed">{aiAdvice.advice}</p>
              <div className="mt-3 text-xs opacity-75">
                Based on your recent cycle data and symptoms
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`
                p-4 rounded-2xl border-l-4
                ${alert.type === 'late' 
                  ? 'bg-[#F8D7DA] border-[#C27CA3] text-[#2C2C2C]'
                  : 'bg-[#E2F0CB] border-[#867B9F] text-[#2C2C2C]'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div className="text-lg">
                  {alert.type === 'late' ? '⚠️' : 'ℹ️'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{alert.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Predictions */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">Upcoming Periods</h2>
        
        {predictions && predictions.length > 0 ? (
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div
                key={prediction._id}
                className="flex items-center justify-between p-4 bg-[#F5EAE3] rounded-2xl"
              >
                <div className="flex-1">
                  <div className="font-semibold text-[#2C2C2C]">
                    {formatDateRange(prediction.predictedStart, prediction.predictedEnd)}
                  </div>
                  <div className="text-sm text-[#867B9F]">
                    Cycle {index + 1} • {getConfidenceLabel(prediction.confidence)} confidence
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-bold ${getConfidenceColor(prediction.confidence)}`}>
                    {Math.round(prediction.confidence)}%
                  </div>
                  <div className="text-xs text-[#867B9F]">
                    {index < 3 ? 'accurate' : 'estimate'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🔮</div>
            <p className="text-[#867B9F] text-sm">
              Track a few cycles to see AI predictions
            </p>
          </div>
        )}
      </div>

      {/* Cycle Insights */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">Cycle Insights</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#F5EAE3] rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="text-lg">📊</div>
              <div>
                <div className="font-medium text-[#2C2C2C] text-sm">Average Cycle</div>
                <div className="text-xs text-[#867B9F]">Based on your data</div>
              </div>
            </div>
            <div className="text-[#C27CA3] font-bold">
              {cycles && cycles.length >= 2 ? 
                Math.round(cycles.slice(0, 3).reduce((acc, cycle, index, arr) => {
                  if (index === 0) return acc;
                  const prevDate = new Date(arr[index - 1].date);
                  const currDate = new Date(cycle.date);
                  const diff = Math.abs((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
                  return acc + diff;
                }, 0) / (Math.min(cycles.length, 3) - 1)) : 28
              } days
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F5EAE3] rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="text-lg">🩸</div>
              <div>
                <div className="font-medium text-[#2C2C2C] text-sm">Period Length</div>
                <div className="text-xs text-[#867B9F]">Typical duration</div>
              </div>
            </div>
            <div className="text-[#C27CA3] font-bold">5 days</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F5EAE3] rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="text-lg">🌱</div>
              <div>
                <div className="font-medium text-[#2C2C2C] text-sm">Fertile Window</div>
                <div className="text-xs text-[#867B9F]">Most likely days</div>
              </div>
            </div>
            <div className="text-[#867B9F] font-bold">Days 12-16</div>
          </div>

          {cycles && cycles.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-[#F5EAE3] rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="text-lg">📈</div>
                <div>
                  <div className="font-medium text-[#2C2C2C] text-sm">Data Quality</div>
                  <div className="text-xs text-[#867B9F]">Prediction accuracy</div>
                </div>
              </div>
              <div className="text-[#C27CA3] font-bold">
                {cycles.length < 3 ? 'Building...' : 
                 cycles.length < 6 ? 'Good' : 'Excellent'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-[#867B9F] to-[#E2F0CB] rounded-3xl p-6 text-[#2C2C2C]">
        <h2 className="text-lg font-semibold mb-3">💡 Today's Tip</h2>
        <p className="text-sm opacity-90">
          Staying hydrated can help reduce bloating and cramps during your period. 
          Aim for 8 glasses of water daily!
        </p>
      </div>
    </div>
  );
}
