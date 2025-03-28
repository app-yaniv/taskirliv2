'use client'

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

export default function ProgressStepper({ 
  currentStep, 
  totalSteps, 
  onStepClick 
}: ProgressStepperProps) {
  return (
    <div className="flex justify-between items-center mb-8" dir="rtl">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        
        return (
          <div key={step} className="flex flex-col items-center relative flex-1">
            {/* Connector line */}
            {step < totalSteps && (
              <div 
                className={`absolute top-4 w-full h-1 right-1/2 ${
                  isCompleted || (isActive && step > 1) ? 'bg-blue-500' : 'bg-gray-300'
                }`} 
              />
            )}
            
            {/* Step circle */}
            <button
              onClick={() => onStepClick(step)}
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : isCompleted 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
              }`}
            >
              {isCompleted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step
              )}
            </button>
            
            {/* Step label - hidden on mobile */}
            <span className={`text-xs mt-2 hidden md:block ${
              isActive || isCompleted ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              שלב {step}
            </span>
          </div>
        );
      })}
    </div>
  );
} 