import { SignInForm } from "../SignInForm";

interface WelcomeScreenProps {
  onNavigate: () => void;
}

export function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <div className="text-center mb-8">
        <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
          <img 
            src="/src/assets/Klara-Ai-Logo.png" 
            alt="Klara AI Logo" 
            className="w-20 h-20 object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Klara Flow</h1>
        <p className="text-xl text-white opacity-90 mb-2">Your Personal Health Companion</p>
        <p className="text-white opacity-75 text-sm">
          Developed by <span className="font-semibold">Klara AI SL</span>
        </p>
      </div>

      <div className="w-full max-w-md">
        <SignInForm />
      </div>

      <div className="mt-8 text-center">
        <p className="text-white opacity-75 text-sm">
          Built with React & Tailwind CSS
        </p>
      </div>
    </div>
  );
}
