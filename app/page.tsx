'use client';

import { Header } from '@/components/Header';
import { CreateVestingForm } from '@/components/CreateVestingForm';
import { BatchVestingUpload } from '@/components/BatchVestingUpload';
import { VestingDashboard } from '@/components/VestingDashboard';
import { AdminPanel } from '@/components/AdminPanel';
import { Onboarding, useOnboarding } from '@/components/Onboarding';
import { BottomNav } from '@/components/BottomNav';
import { useState } from 'react';
import { useFeePercentage } from '@/lib/hooks/useVestingContract';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const { data: feePercentage } = useFeePercentage();
  const { showOnboarding, setShowOnboarding, resetOnboarding } = useOnboarding();

  const feePercent = feePercentage ? Number(feePercentage) / 100 : 0;

  const handleNavigation = (section: 'create' | 'dashboard' | 'guide') => {
    if (section === 'guide') {
      resetOnboarding();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/10 dark:to-purple-950/10 pb-20">
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      <Header onShowOnboarding={resetOnboarding} />

      <main className="container mx-auto px-4 py-12 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-slideDown">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Live on Base Mainnet
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Token Vesting Made Simple
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
              Create customizable vesting schedules on Base Network with individual or batch creation
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full border border-green-200 dark:border-green-800 mb-6">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                FREE Gas with Coinbase Smart Wallet
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {feePercentage !== undefined && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-800">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Platform fee: <span className="font-semibold text-gray-900 dark:text-white">{feePercent}%</span>
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={`https://basescan.org/address/${process.env.NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS}#code`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Verified Contract
                  </span>
                </a>

                <a
                  href={`https://basescan.org/address/${process.env.NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS}#readContract`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-500 dark:border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors animate-pulse"
                >
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-bold text-purple-700 dark:text-purple-400">
                    🔒 Ownership Renounced
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12" data-section="create">
            {/* Creation Form - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6 animate-slideUp">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <button
                    onClick={() => setActiveTab('single')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${
                      activeTab === 'single'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {activeTab === 'single' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Single Vesting
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('batch')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all relative ${
                      activeTab === 'batch'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {activeTab === 'batch' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Batch Upload
                    </div>
                  </button>
                </div>

                {/* Form Content */}
                <div className="p-6">
                  {activeTab === 'single' ? (
                    <CreateVestingForm />
                  ) : (
                    <BatchVestingUpload />
                  )}
                </div>
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              {/* Quick Guide */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Quick Start</h3>
                </div>

                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <p className="pt-0.5">
                      Connect your wallet to Base
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <p className="pt-0.5">
                      Fill vesting details or upload CSV
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <p className="pt-0.5">
                      Approve tokens & create schedule
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <p className="pt-0.5">
                      Track and claim in dashboard
                    </p>
                  </li>
                </ol>
              </div>

              {/* Features */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-800/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Key Features
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Customizable cliff & duration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Batch CSV upload support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Revocable vesting option</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Real-time progress tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Secure on-chain execution</span>
                  </li>
                </ul>
              </div>

              {/* Security */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-800/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Security & Transparency
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <a
                        href={`https://basescan.org/address/${process.env.NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS}#code`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 underline font-semibold"
                      >
                        ✅ Verified Contract
                      </a>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Audit the source code yourself</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">Protected Vestings</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Owner cannot steal vested tokens</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">Non-upgradeable</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Contract logic cannot change</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <a
                        href={`https://basescan.org/address/${process.env.NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS}#readContract`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 underline"
                      >
                        Check Current Owner
                      </a>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Can adjust fees & pause (not steal)</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500 dark:border-green-600">
                  <p className="text-sm font-bold text-green-800 dark:text-green-300 mb-1">
                    🎉 Ownership Renounced!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    This contract is <strong>100% decentralized</strong>. No one can change fees, pause, or access tokens. <a href={`https://basescan.org/address/${process.env.NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS}#readContract`} target="_blank" rel="noopener noreferrer" className="underline font-semibold">Verify owner = 0x000...000</a>
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-sm font-semibold">Network</h3>
                </div>
                <div className="text-2xl font-bold mb-1">Base Mainnet</div>
                <p className="text-xs text-gray-400">Fast & Low Cost</p>
              </div>
            </div>
          </div>

          {/* Admin Panel - Only visible for owner */}
          <div className="animate-slideUp mb-12" style={{ animationDelay: '0.15s' }}>
            <AdminPanel />
          </div>

          {/* Dashboard Section */}
          <div className="animate-slideUp" data-section="dashboard" style={{ animationDelay: '0.2s' }}>
            <VestingDashboard />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 dark:border-gray-800/50 mt-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">V</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Vesting Scheduler
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built on <span className="font-semibold text-blue-600">Base Network</span> • Powered by <span className="font-semibold text-purple-600">OnchainKit</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <BottomNav onNavigate={handleNavigation} />
    </div>
  );
}
