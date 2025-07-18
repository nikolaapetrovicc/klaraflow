interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#F5F5F5]">
      <div className="text-center mb-12">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#FF2E74] rounded-full flex items-center justify-center">
            <img src="/src/assets/Klara-Ai-Logo.png" alt="Klara Flow Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-5xl font-bold text-[#FF2E74] mb-4 leading-tight">
            Klara Flow
          </h1>
          <p className="text-xl text-[#2C2C2C] font-light">
            Your AI-powered cycle companion
          </p>
        </div>
        
        <div className="space-y-4 mb-12 text-[#2C2C2C]">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-2 h-2 bg-[#FF2E74] rounded-full"></div>
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
        className="w-full max-w-sm bg-[#FF2E74] text-white font-bold py-4 px-8 rounded-[28px] text-lg hover:bg-[#D92663] transition-colors shadow-lg"
      >
        Get Started
      </button>
    </div>
  );
}
