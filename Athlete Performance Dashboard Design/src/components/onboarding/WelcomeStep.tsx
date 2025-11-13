import React from 'react';
import { Button } from '../Button';
import { Target, Zap, TrendingUp } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-4">
      {/* Hero */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-[#03fd1c] rounded-full flex items-center justify-center mb-6 mx-auto">
          <Zap className="w-10 h-10 text-black" />
        </div>
        <h1 className="text-white mb-4">Build Your Personal GRIT Plan</h1>
        <p className="text-gray-300 text-lg max-w-md mx-auto">
          Answer a few questions. We'll design a plan built for your sport, body, schedule, and goals.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl w-full">
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-6">
          <Target className="w-8 h-8 text-[#03fd1c] mb-3" />
          <h3 className="text-white mb-2">Goal-Driven</h3>
          <p className="text-gray-400 text-sm">
            Personalized training plan based on your specific athletic goals
          </p>
        </div>
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-6">
          <Zap className="w-8 h-8 text-[#03fd1c] mb-3" />
          <h3 className="text-white mb-2">Sport-Specific</h3>
          <p className="text-gray-400 text-sm">
            Tailored exercises and drills for your position and competition level
          </p>
        </div>
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-6">
          <TrendingUp className="w-8 h-8 text-[#03fd1c] mb-3" />
          <h3 className="text-white mb-2">Adaptive</h3>
          <p className="text-gray-400 text-sm">
            Plans adjust to your schedule, equipment, and training experience
          </p>
        </div>
      </div>

      {/* CTA */}
      <Button 
        variant="primary" 
        size="lg"
        onClick={onNext}
        className="w-full md:w-auto"
      >
        Start My Build
      </Button>
      
      <p className="text-gray-500 text-sm mt-4">
        Takes about 5 minutes to complete
      </p>
    </div>
  );
}
