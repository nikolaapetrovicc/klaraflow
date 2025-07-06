interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-[#FFF9F7] to-[#F5EAE3]">
      <div className="text-center mb-12">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#C27CA3] rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-[#C27CA3] mb-4 leading-tight">
            Klara Flow
          </h1>
          <p className="text-xl text-[#2C2C2C] font-light">
            Your AI-powered cycle companion
          </p>
        </div>
        
        <div className="space-y-4 mb-12 text-[#2C2C2C]">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-2 h-2 bg-[#C27CA3] rounded-full"></div>
            <span className="text-base">Track your cycle with ease</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-2 h-2 bg-[#867B9F] rounded-full"></div>
            <span className="text-base">AI-powered predictions</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-2 h-2 bg-[#E2F0CB] rounded-full"></div>
            <span className="text-base">Personalized insights</span>
          </div>
        </div>
      </div>

      <button
        onClick={onGetStarted}
        className="w-full max-w-sm bg-[#C27CA3] text-white font-bold py-4 px-8 rounded-[28px] text-lg hover:bg-[#B06B94] transition-colors shadow-lg"
      >
        Get Started
      </button>
    </div>
  );
}
