import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="w-full h-1 bg-[#252525] rounded-full mb-6">
        <div 
          className="h-full bg-[#03fd1c] rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step circles */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${isCompleted ? 'bg-[#03fd1c] text-black' : ''}
                  ${isCurrent ? 'bg-[#03fd1c]/20 border-2 border-[#03fd1c] text-[#03fd1c]' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-[#252525] text-gray-500' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-bold">{stepNumber}</span>
                )}
              </div>
              {stepLabels && stepLabels[index] && (
                <span className={`text-xs ${isCurrent ? 'text-[#03fd1c]' : 'text-gray-500'}`}>
                  {stepLabels[index]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
