'use client';

import { useEffect, useState } from 'react';

interface BottomNavProps {
  onNavigate?: (section: 'create' | 'dashboard' | 'guide') => void;
}

export function BottomNav({ onNavigate }: BottomNavProps) {
  const [activeSection, setActiveSection] = useState<'create' | 'dashboard' | 'guide'>('create');

  const handleNavigation = (section: 'create' | 'dashboard' | 'guide') => {
    setActiveSection(section);

    // Scroll to the corresponding section
    let element: HTMLElement | null = null;
    if (section === 'create') {
      element = document.querySelector('[data-section="create"]') as HTMLElement;
    } else if (section === 'dashboard') {
      element = document.querySelector('[data-section="dashboard"]') as HTMLElement;
    }

    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    if (onNavigate) {
      onNavigate(section);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16 sm:h-18">
          {/* Create Button */}
          <button
            onClick={() => handleNavigation('create')}
            className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] px-3 py-2 rounded-xl transition-all touch-manipulation ${
              activeSection === 'create'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            aria-label="Create Vesting"
          >
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-xs font-medium">Create</span>
          </button>

          {/* Dashboard Button */}
          <button
            onClick={() => handleNavigation('dashboard')}
            className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] px-3 py-2 rounded-xl transition-all touch-manipulation ${
              activeSection === 'dashboard'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            aria-label="View Dashboard"
          >
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-xs font-medium">Dashboard</span>
          </button>

          {/* Guide Button */}
          <button
            onClick={() => handleNavigation('guide')}
            className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] px-3 py-2 rounded-xl transition-all touch-manipulation ${
              activeSection === 'guide'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            aria-label="How it works"
          >
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-medium">Guide</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
