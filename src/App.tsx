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

import { BottomNav } from "./components/BottomNav";

function CalendarView() {
  const cycles = useQuery(api.cycles.getUserCycles);
  const predictions = useQuery(api.cycles.getPredictions);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">Calendar View</h1>
        <p className="text-[#867B9F] text-sm">Your cycle calendar - Coming soon with full functionality!</p>
      </div>
      
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F5EAE3]">
        <p className="text-center text-[#867B9F]">
          📅 Interactive calendar with period tracking will be available here
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'dashboard' | 'log' | 'insights' | 'history' | 'calendar'>('welcome');
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F7]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C27CA3]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F7] font-sans">
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
        <div className="min-h-screen flex flex-col bg-[#FFF9F7]">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
            <h2 className="text-xl font-semibold text-[#C27CA3]">Klara Flow</h2>
          </header>
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[#C27CA3] mb-4">Welcome to Klara Flow</h1>
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
