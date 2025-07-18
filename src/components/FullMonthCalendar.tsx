import React from "react";

interface FullMonthCalendarProps {
  month: Date; // Any date in the month to display
  periodDates: string[]; // Array of ISO date strings for logged periods
  predictedPeriodDates: string[]; // Array of ISO date strings for predicted periods
  onClose: () => void;
  onMonthChange?: (newMonth: Date) => void; // Callback for month navigation
}

export function FullMonthCalendar({ month, periodDates, predictedPeriodDates, onClose, onMonthChange }: FullMonthCalendarProps) {
  // Get first and last day of the month
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  // Get all days in the month
  const days: Date[] = [];
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, monthIndex, d));
  }

  // Get the weekday of the first day (0=Sun, 1=Mon, ...)
  const startWeekday = firstDay.getDay();

  // Pad start with empty slots if month doesn't start on Sunday
  const paddedDays = Array(startWeekday).fill(null).concat(days);

  // Split into weeks
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7));
  }

  // Helper to check if a date is a period day (logged or predicted)
  const isPeriodDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return periodDates.includes(dateStr) || predictedPeriodDates.includes(dateStr);
  };
  // Helper to check if a date is a predicted period day
  const isPredictedPeriodDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return predictedPeriodDates.includes(dateStr);
  };
  // Helper to check if a date is today
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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#FF2E74] font-bold text-lg">×</button>
        <div className="text-center mb-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => {
                const newMonth = new Date(month);
                newMonth.setMonth(month.getMonth() - 1);
                onMonthChange?.(newMonth);
              }}
              className="text-[#FF2E74] hover:text-[#D92663] transition-colors text-lg font-bold"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold text-[#FF2E74]">{monthName} {year}</h2>
            <button 
              onClick={() => {
                const newMonth = new Date(month);
                newMonth.setMonth(month.getMonth() + 1);
                onMonthChange?.(newMonth);
              }}
              className="text-[#FF2E74] hover:text-[#D92663] transition-colors text-lg font-bold"
            >
              →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-[#867B9F]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((date, idx) =>
            date ? (
              <div
                key={idx}
                className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium
                  ${isPeriodDay(date) ? 'bg-[#FF2E74] text-white' : ''}
                  ${isPredictedPeriodDay(date) ? 'bg-[#FF2E74]/50 text-white' : ''}
                  ${isToday(date) ? 'border-2 border-[#FF2E74]' : ''}
                  ${!isPeriodDay(date) && !isToday(date) ? 'bg-[#F5F5F5] text-[#2C2C2C]' : ''}
                `}
              >
                {date.getDate()}
              </div>
            ) : (
              <div key={idx} />
            )
          )}
        </div>
      </div>
    </div>
  );
} 