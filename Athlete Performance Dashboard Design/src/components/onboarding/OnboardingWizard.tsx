import React, { useState } from 'react';
import { X } from 'lucide-react';
import { StepIndicator } from './StepIndicator';
import { WelcomeStep } from './WelcomeStep';
import { DemographicsStep } from './DemographicsStep';
import { EnhancedSportPositionStep } from './EnhancedSportPositionStep';
import { GoalDefinitionStep } from './GoalDefinitionStep';
import { PerformanceBaselineStep } from './PerformanceBaselineStep';
import { BodyProfileStep } from './BodyProfileStep';
import { ScheduleStep } from './ScheduleStep';
import { ExperienceStep } from './ExperienceStep';
import { MentalProfileStep } from './MentalProfileStep';
import { SummaryStep } from './SummaryStep';

export interface OnboardingData {
  // From DemographicsStep
  dateOfBirth?: string;
  gender?: string;
  emergencyContact?: string;
  medicalConditions?: string[];
  medications?: string;
  dietaryRestrictions?: string;
  isPregnant?: boolean;

  // From SportPositionStep
  sport?: string;
  position?: string;
  level?: string;
  seasonPhase?: string;
  nextCompetition?: string;
  teamSchedule?: string;

  // From GoalDefinitionStep
  goals?: Array<{
    category: string;
    subcategory: string;
    priority: number;
    timeline: string;
  }>;

  // From PerformanceBaselineStep
  pushUps?: string;
  pullUps?: string;
  mileTime?: string;
  fortyYardDash?: string;
  verticalJump?: string;
  benchPress?: string;
  beepTest?: string;
  recentFrequency?: string;
  recentFocus?: string;
  sleepHours?: string;
  stressLevel?: string;
  hydration?: string;
  nutritionApproach?: string;
  recoveryTools?: string[];

  // From BodyProfileStep
  bodyType?: string;
  height?: { feet: string; inches: string };
  weight?: number;
  injuries?: string[];
  equipmentAccess?: string[];

  // From ScheduleStep
  trainingDays?: string[];
  preferredTime?: string;
  sessionDuration?: number;
  competitionSchedule?: string;
  weeklyVolume?: number;

  // From ExperienceStep
  trainingExperience?: string;
  currentWorkload?: string;
  coachingStyle?: string;
  motivators?: string[];
  strengths?: string[];
  weaknesses?: string[];

  // From MentalProfileStep
  confidenceLevel?: number;
  stressResponse?: string;
  focusLevel?: number;
  recoveryPriority?: string;
  mentalSkills?: string[];
  trainingReadiness?: number;
  mentalStrengthScore?: number;
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onClose: () => void;
}

export function OnboardingWizard({ onComplete, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});

  const steps = [
    { label: 'Welcome', completed: currentStep > 0 },
    { label: 'Personal', completed: currentStep > 1 },
    { label: 'Sport', completed: currentStep > 2 },
    { label: 'Goals', completed: currentStep > 3 },
    { label: 'Baseline', completed: currentStep > 4 },
    { label: 'Body', completed: currentStep > 5 },
    { label: 'Schedule', completed: currentStep > 6 },
    { label: 'Experience', completed: currentStep > 7 },
    { label: 'Mental', completed: currentStep > 8 },
    { label: 'Review', completed: currentStep > 9 }
  ];

  const handleNext = (stepData: any) => {
    setData({ ...data, ...stepData });
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleEdit = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const handleComplete = () => {
    onComplete(data);
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 overflow-auto">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-[#141414] border-b border-[#252525] px-8 py-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold">Build Your GRIT Plan</h1>
              <p className="text-gray-400 mt-1">Personalized training designed for your goals</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-[#141414] border-b border-[#252525] px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <StepIndicator 
              steps={steps}
              currentStep={currentStep}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {currentStep === 0 && (
              <WelcomeStep onNext={() => setCurrentStep(1)} />
            )}

            {currentStep === 1 && (
              <DemographicsStep
                data={data}
                onUpdate={setData}
                onNext={() => setCurrentStep(2)}
                onBack={handleBack}
              />
            )}

            {currentStep === 2 && (
              <EnhancedSportPositionStep
                data={data}
                onUpdate={setData}
                onNext={() => setCurrentStep(3)}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && (
              <GoalDefinitionStep
                data={data}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && (
              <PerformanceBaselineStep
                data={data}
                onUpdate={setData}
                onNext={() => setCurrentStep(5)}
                onBack={handleBack}
              />
            )}

            {currentStep === 5 && (
              <BodyProfileStep
                data={data}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 6 && (
              <ScheduleStep
                data={data}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 7 && (
              <ExperienceStep
                data={data}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 8 && (
              <MentalProfileStep
                data={data}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 9 && (
              <SummaryStep
                data={data}
                onComplete={handleComplete}
                onBack={handleBack}
                onEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
