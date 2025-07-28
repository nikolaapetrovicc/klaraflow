import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FertilityLogModal } from "./FertilityLogModal";

interface FertilityCalendarProps {
  logs?: Record<string, { intercourse?: boolean; ovulationTest?: 'positive' | 'negative'; symptoms?: string[] }>;
}

const getFertileWindow = (cycleStart: Date) => {
  // Fertile window: days 10-16 after period start (example)
  const fertileDays: string[] = [];
  for (let i = 10; i <= 16; i++) {
    const d = new Date(cycleStart);
    d.setDate(cycleStart.getDate() + i);
    fertileDays.push(d.toISOString().split('T')[0]);
  }
  return fertileDays;
};

const getOvulationDay = (cycleStart: Date) => {
  const d = new Date(cycleStart);
  d.setDate(cycleStart.getDate() + 14); // Example: ovulation on day 14
  return d.toISOString().split('T')[0];
};

export function FertilityCalendar({ logs = {} }: FertilityCalendarProps) {
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Fetch fertility entries from the database
  const fertilityEntries = useQuery(api.cycles.getUserFertilityEntries);

  // Example: use the 1st of the month as the cycle start for demo
  const cycleStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const fertileWindow = getFertileWindow(cycleStart);
  const ovulationDay = getOvulationDay(cycleStart);

  // Calendar grid
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const days: Date[] = [];
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, monthIndex, d));
  }
  const startWeekday = firstDay.getDay();
  const paddedDays = Array(startWeekday).fill(null).concat(days);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7));
  }

  const isFertile = (date: Date) => fertileWindow.includes(date.toISOString().split('T')[0]);
  const isOvulation = (date: Date) => ovulationDay === date.toISOString().split('T')[0];
  const hasLog = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return logs[dateStr] || (fertilityEntries && fertilityEntries.some(entry => entry.date === dateStr));
  };

  const getLogType = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (!fertilityEntries) return null;
    
    const entries = fertilityEntries.filter(entry => entry.date === dateStr);
    if (entries.length === 0) return null;
    
    // Check for artificial fertilization first
    const hasArtificial = entries.some(entry => entry.type === 'artificial_fertilization');
    if (hasArtificial) return 'artificial';
    
    // Check for other types
    const hasIntercourse = entries.some(entry => entry.type === 'intercourse');
    const hasOvulation = entries.some(entry => entry.type === 'ovulation_test');
    const hasSymptoms = entries.some(entry => entry.type === 'symptoms');
    
    if (hasIntercourse || hasOvulation || hasSymptoms) return 'regular';
    
    return null;
  };
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const monthName = month.toLocaleString('default', { month: 'long' });

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            const newMonth = new Date(month);
            newMonth.setMonth(month.getMonth() - 1);
            setMonth(newMonth);
          }}
          className="text-[#FF2E74] hover:text-[#D92663] transition-colors text-lg font-bold"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold text-[#2C2C2C]">
          {monthName} {year}
        </h2>
        <button
          onClick={() => {
            const newMonth = new Date(month);
            newMonth.setMonth(month.getMonth() + 1);
            setMonth(newMonth);
          }}
          className="text-[#FF2E74] hover:text-[#D92663] transition-colors text-lg font-bold"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-[#867B9F]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((date, idx) =>
          date ? (
            <button
              key={idx}
              className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium focus:outline-none
                ${isOvulation(date) ? 'bg-blue-300 text-white' :
                  isFertile(date) ? 'bg-[#E2F0CB] text-[#2C2C2C]' :
                  ''}
                ${isToday(date) ? 'border-2 border-[#FF2E74]' : ''}
                ${!isFertile(date) && !isOvulation(date) && !isToday(date) ? 'bg-[#F5F5F5] text-[#2C2C2C]' : ''}
              `}
              onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
            >
              <span>{date.getDate()}</span>
              {getLogType(date) === 'artificial' && <span className="ml-1 text-purple-500">🏥</span>}
              {getLogType(date) === 'regular' && <span className="ml-1 text-[#FF2E74]">•</span>}
            </button>
          ) : (
            <div key={idx} />
          )
        )}
      </div>
      {/* Legend */}
      <div className="flex justify-center space-x-4 text-xs mt-4">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-[#E2F0CB] rounded"></div>
          <span className="text-[#2C2C2C]">Fertile</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-300 rounded"></div>
          <span className="text-[#2C2C2C]">Ovulation</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-[#FF2E74] rounded"></div>
          <span className="text-[#2C2C2C]">Log</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-purple-300 rounded"></div>
          <span className="text-[#2C2C2C]">Artificial Fertilization</span>
        </div>
      </div>
      
      {/* Fertility Logging Modal */}
      {selectedDate && (
        <FertilityLogModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          existingLogs={fertilityEntries?.filter(entry => entry.date === selectedDate) || []}
        />
      )}
    </div>
  );
} 