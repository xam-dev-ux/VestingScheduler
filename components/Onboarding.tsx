'use client';

import { useState, useEffect } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: 'Welcome to Vesting Scheduler',
      description: 'Create and manage token vesting schedules on Base Network',
      icon: '🚀',
      content: 'A powerful platform for distributing tokens over time with customizable schedules, perfect for teams, investors, and contributors.'
    },
    {
      title: 'How It Works',
      description: 'Simple 3-step process to create vesting schedules',
      icon: '⚡',
      content: 'Connect your wallet, configure vesting parameters (beneficiary, amount, duration), and create schedules individually or in bulk via CSV.'
    },
    {
      title: 'Single Vesting',
      description: 'Create individual vesting schedules',
      icon: '📝',
      content: 'Fill out a simple form with beneficiary address, token, amount, cliff period, and duration. Perfect for one-off distributions.'
    },
    {
      title: 'Batch Upload',
      description: 'Create multiple vestings at once',
      icon: '📊',
      content: 'Upload a CSV file with multiple vestings. Save time and gas by creating hundreds of schedules in a single transaction.'
    },
    {
      title: 'Track & Claim',
      description: 'Monitor and claim vested tokens',
      icon: '💎',
      content: 'View all your vestings in the dashboard. Beneficiaries can claim tokens as they vest, with real-time progress tracking.'
    },
    {
      title: 'Fully Decentralized',
      description: '100% trustless and secure',
      icon: '🔒',
      content: 'Contract ownership has been renounced - no one can change fees, pause operations, or access your tokens. Verified on BaseScan for full transparency. Current fee: 2.5% (locked forever).'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding_completed', 'true');
    setTimeout(() => onComplete(), 300);
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 flex items-center justify-center text-5xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl animate-bounce-slow">
              {step.icon}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-lg">
            {step.description}
          </p>

          {/* Content */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl p-6 mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {step.content}
            </p>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handleSkip}
              className="min-h-[44px] min-w-[44px] px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors font-medium"
            >
              Skip
            </button>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="min-h-[44px] min-w-[44px] px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors font-medium"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="min-h-[44px] min-w-[44px] px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed');
    if (!completed) {
      setShowOnboarding(true);
    }
  }, []);

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding_completed');
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    setShowOnboarding,
    resetOnboarding
  };
}
