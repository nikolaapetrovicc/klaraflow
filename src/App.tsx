import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Dashboard } from "./components/Dashboard";
import { LogPeriod } from "./components/LogPeriod";
import { Insights } from "./components/Insights";
import { CycleHistory } from "./components/CycleHistory";
import { Profile } from "./components/Profile";
import { PregnancyPlanner } from "./components/PregnancyPlanner";
import { BottomNav } from "./components/BottomNav";
import { OnboardingPurpose } from "./components/OnboardingPurpose";

function CalendarView() {
  const cycles = useQuery(api.cycles.getUserCycles);
  
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
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-[#FF2E74] rounded-full flex items-center justify-center text-white text-4xl font-bold">
          📅
        </div>
        <h1 className="text-3xl font-bold text-[#FF2E74] mb-2">Calendar View</h1>
        <p className="text-[#867B9F] text-base">Track your cycle over time</p>
      </div>

      {/* Calendar Component */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">Your Cycle Calendar</h2>
        <div className="text-center text-[#867B9F] py-8">
          <div className="text-4xl mb-4">📅</div>
          <p>Calendar view coming soon!</p>
          <p className="text-sm mt-2">Track your periods and symptoms over time</p>
        </div>
      </div>

      {/* Period Dates */}
      {cycles && cycles.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
          <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">Recent Periods</h2>
          <div className="space-y-2">
            {cycles.slice(0, 5).map((cycle, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-[#F5EAE3] last:border-b-0">
                <span className="text-[#2C2C2C]">
                  {new Date(cycle.date).toLocaleDateString('en', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  cycle.flow === 'light' ? 'bg-[#E2F0CB] text-[#2C2C2C]' :
                  cycle.flow === 'medium' ? 'bg-[#867B9F] text-white' :
                  'bg-[#FF2E74] text-white'
                }`}>
                  {cycle.flow.charAt(0).toUpperCase() + cycle.flow.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predicted Periods */}
      {predictedPeriodDates.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
          <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4">Predicted Periods</h2>
          <div className="space-y-2">
            {predictedPeriodDates.slice(0, 3).map((date, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-[#F5EAE3] last:border-b-0">
                <span className="text-[#2C2C2C]">
                  {new Date(date).toLocaleDateString('en', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF2E74]/50 text-[#2C2C2C]">
                  Predicted
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'onboarding' | 'dashboard' | 'log' | 'insights' | 'history' | 'calendar' | 'profile' | 'pregnancy'>('welcome');
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userPreferences = useQuery(api.cycles.getUserPreferences);

  if (loggedInUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2E74]"></div>
      </div>
    );
  }

  // Check if user needs onboarding
  const needsOnboarding = loggedInUser && !userPreferences;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      <Authenticated>
        <div className="flex flex-col h-screen">
          <main className="flex-1 overflow-y-auto pb-20">
            {currentScreen === 'welcome' && (
              <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-[#FF2E74] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    🌸
                  </div>
                  <h1 className="text-3xl font-bold text-[#FF2E74] mb-4">Welcome to Klara Flow</h1>
                  <p className="text-[#867B9F] text-lg mb-8">Your personalized cycle tracking companion</p>
                  <button
                    onClick={() => setCurrentScreen('onboarding')}
                    className="bg-[#FF2E74] text-white font-bold py-4 px-8 rounded-[28px] text-lg hover:bg-[#B06B94] transition-colors shadow-lg"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}
            {currentScreen === 'onboarding' && (
              <OnboardingPurpose onComplete={() => setCurrentScreen('dashboard')} />
            )}
            {currentScreen === 'dashboard' && (
              <Dashboard onNavigate={setCurrentScreen} />
            )}
            {currentScreen === 'log' && <LogPeriod onNavigate={(screen: string) => setCurrentScreen(screen as any)} />}
            {currentScreen === 'insights' && <Insights />}
            {currentScreen === 'history' && <CycleHistory />}
            {currentScreen === 'calendar' && <CalendarView />}
            {currentScreen === 'profile' && <Profile />}
            {currentScreen === 'pregnancy' && <PregnancyPlanner />}
          </main>
          
          {currentScreen !== 'welcome' && currentScreen !== 'onboarding' && (
            <BottomNav 
              currentScreen={currentScreen} 
              onScreenChange={setCurrentScreen}
            />
          )}
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-[#FF2E74] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                🌸
              </div>
              <h1 className="text-3xl font-bold text-[#FF2E74] mb-2">Klara Flow</h1>
              <p className="text-[#867B9F] text-lg">Your personalized cycle tracking companion</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
      {/* Footer with Klara AI SL branding */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5EAE3] p-2 text-center">
        <p className="text-xs text-[#867B9F]">
          Developed by <span className="font-semibold text-[#FF2E74]">Klara AI SL</span> • 
          Built with React, TypeScript & Tailwind CSS
        </p>
      </div>
    </div>
  );
}
