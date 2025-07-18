import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { Dashboard } from "./components/Dashboard";
import { LogPeriod } from "./components/LogPeriod";
import { Insights } from "./components/Insights";
import { CycleHistory } from "./components/CycleHistory";
import { Profile } from "./components/Profile";
import { FullMonthCalendar } from "./components/FullMonthCalendar";

import { BottomNav } from "./components/BottomNav";

function CalendarView() {
  const cycles = useQuery(api.cycles.getUserCycles);
  const predictions = useQuery(api.cycles.getPredictions);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // Calculate period dates
  const periodDates = cycles ? cycles.map(c => c.date) : [];
  
  // Calculate predicted period dates
  const getPredictedPeriodDates = () => {
    if (!cycles || cycles.length < 2) return [];
    
    const cycleLengths = [];
    for (let i = 1; i < cycles.length; i++) {
      const prevDate = new Date(cycles[i-1].date);
      const currDate = new Date(cycles[i].date);
      const diff = Math.abs((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      cycleLengths.push(diff);
    }
    
    const avgCycleLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
    const lastPeriodStart = new Date(cycles[0].date);
    
    const predictedDates = [];
    for (let i = 1; i <= 3; i++) {
      const nextPeriodStart = new Date(lastPeriodStart);
      nextPeriodStart.setDate(lastPeriodStart.getDate() + (avgCycleLength * i));
      
      for (let day = 0; day < 5; day++) {
        const periodDay = new Date(nextPeriodStart);
        periodDay.setDate(nextPeriodStart.getDate() + day);
        predictedDates.push(periodDay.toISOString().split('T')[0]);
      }
    }
    
    return predictedDates;
  };

  const predictedPeriodDates = getPredictedPeriodDates();

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">Calendar</h1>
        <p className="text-[#867B9F] text-sm">View your cycle calendar</p>
      </div>
      
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <div className="text-center mb-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(currentDate.getMonth() - 1);
                setCurrentDate(newDate);
              }}
              className="text-[#FF2E74] hover:text-[#D92663] transition-colors"
            >
              ←
            </button>
            <h2 className="text-lg font-semibold text-[#2C2C2C]">
              {currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(currentDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}
              className="text-[#FF2E74] hover:text-[#D92663] transition-colors"
            >
              →
            </button>
          </div>
          <button 
            onClick={() => setShowFullCalendar(true)}
            className="bg-[#FF2E74] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#D92663] transition-colors"
          >
            View Full Calendar
          </button>
        </div>
        
        {/* Simple month preview */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-[#867B9F] p-2">{day}</div>
          ))}
          {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() }, (_, i) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
            const dateStr = date.toISOString().split('T')[0];
            const isPeriod = periodDates.includes(dateStr);
            const isPredicted = predictedPeriodDates.includes(dateStr);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={i}
                className={`text-center p-2 text-sm rounded-lg
                  ${isPeriod ? 'bg-[#FF2E74] text-white' : ''}
                  ${isPredicted ? 'bg-[#FF2E74]/50 text-white' : ''}
                  ${isToday ? 'ring-2 ring-[#FF2E74]' : ''}
                  ${!isPeriod && !isPredicted && !isToday ? 'bg-[#F5F5F5] text-[#2C2C2C]' : ''}
                `}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#FF2E74] rounded"></div>
            <span className="text-[#2C2C2C]">Period</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#FF2E74]/50 rounded"></div>
            <span className="text-[#2C2C2C]">Predicted</span>
          </div>
        </div>
      </div>
      
      {showFullCalendar && (
        <FullMonthCalendar
          month={currentDate}
          periodDates={periodDates}
          predictedPeriodDates={predictedPeriodDates}
          onClose={() => setShowFullCalendar(false)}
          onMonthChange={(newMonth) => setCurrentDate(newMonth)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'dashboard' | 'log' | 'insights' | 'history' | 'calendar' | 'profile'>('welcome');
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2E74]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      <Authenticated>
        <div className="flex flex-col h-screen">
          <main className="flex-1 overflow-y-auto pb-20">
            {currentScreen === 'welcome' && (
              <WelcomeScreen onGetStarted={() => setCurrentScreen('dashboard')} />
            )}
            {currentScreen === 'dashboard' && (
              <Dashboard onNavigate={setCurrentScreen} />
            )}
            {currentScreen === 'log' && <LogPeriod onNavigate={setCurrentScreen} />}
            {currentScreen === 'insights' && <Insights />}
            {currentScreen === 'history' && <CycleHistory />}
            {currentScreen === 'calendar' && <CalendarView />}
            {currentScreen === 'profile' && <Profile />}
          </main>
          
          {currentScreen !== 'welcome' && (
            <BottomNav 
              currentScreen={currentScreen} 
              onScreenChange={setCurrentScreen}
            />
          )}
        </div>
      </Authenticated>

      <Unauthenticated>
        <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
            <h2 className="text-xl font-semibold text-[#FF2E74]">Klara Flow</h2>
          </header>
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[#FF2E74] mb-4">Welcome to Klara Flow</h1>
                <p className="text-lg text-[#2C2C2C]">Your AI-powered cycle companion</p>
              </div>
              <SignInForm />
            </div>
          </main>
        </div>
      </Unauthenticated>
      
      <Toaster />
    </div>
  );
}
