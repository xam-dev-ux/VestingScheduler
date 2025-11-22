'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { VESTING_CONTRACT_ADDRESS, VESTING_SCHEDULER_ABI } from '@/lib/contract';

// Owner/admin address of the contract
const OWNER_ADDRESS = '0x8F058fE6b568D97f85d517Ac441b52B95722fDDe'.toLowerCase();

export function AdminPanel() {
  const { address } = useAccount();
  const [tokenAddress, setTokenAddress] = useState('');
  const [newFeePercentage, setNewFeePercentage] = useState('');
  const [newFeeCollector, setNewFeeCollector] = useState('');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Check if user is the owner
  const isOwner = address?.toLowerCase() === OWNER_ADDRESS;

  // Read current contract owner
  const { data: contractOwner } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'owner',
  });

  // Read current fee percentage
  const { data: currentFeePercentage } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'feePercentage',
  });

  // Read current fee collector
  const { data: currentFeeCollector } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'feeCollector',
  });

  // Read accumulated fees for a token
  const { data: accumulatedFees, refetch: refetchFees } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'accumulatedFees',
    args: tokenAddress ? [tokenAddress as `0x${string}`] : undefined,
  });

  const handleWithdrawFees = async () => {
    if (!tokenAddress) {
      alert('Please enter a token address');
      return;
    }

    try {
      await writeContract({
        address: VESTING_CONTRACT_ADDRESS,
        abi: VESTING_SCHEDULER_ABI,
        functionName: 'withdrawFees',
        args: [tokenAddress as `0x${string}`],
      });
    } catch (error) {
      console.error('Error withdrawing fees:', error);
      alert('Error withdrawing fees');
    }
  };

  const handleSetFeePercentage = async () => {
    const percentage = parseInt(newFeePercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 1000) {
      alert('Fee must be between 0 and 1000 (0-10%)');
      return;
    }

    try {
      await writeContract({
        address: VESTING_CONTRACT_ADDRESS,
        abi: VESTING_SCHEDULER_ABI,
        functionName: 'setFeePercentage',
        args: [BigInt(percentage)],
      });
    } catch (error) {
      console.error('Error setting fee percentage:', error);
      alert('Error setting fee percentage');
    }
  };

  const handleSetFeeCollector = async () => {
    if (!newFeeCollector || !newFeeCollector.startsWith('0x')) {
      alert('Enter a valid address');
      return;
    }

    try {
      await writeContract({
        address: VESTING_CONTRACT_ADDRESS,
        abi: VESTING_SCHEDULER_ABI,
        functionName: 'setFeeCollector',
        args: [newFeeCollector as `0x${string}`],
      });
    } catch (error) {
      console.error('Error setting fee collector:', error);
      alert('Error setting fee collector');
    }
  };

  const handleRenounceOwnership = async () => {
    const confirmed = window.confirm(
      '⚠️ CRITICAL WARNING ⚠️\n\n' +
      'You are about to PERMANENTLY RENOUNCE ownership of the contract.\n\n' +
      'After this action:\n' +
      '❌ You CANNOT change fees\n' +
      '❌ You CANNOT withdraw fees\n' +
      '❌ You CANNOT pause the contract\n' +
      '❌ This action is IRREVERSIBLE\n\n' +
      'This is done to prove that the contract is decentralized and secure.\n\n' +
      'Are you ABSOLUTELY SURE you want to continue?'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      '🚨 FINAL CONFIRMATION 🚨\n\n' +
      'Think "I RENOUNCE" in your mind and click OK to confirm.\n\n' +
      'This is your last chance to cancel.'
    );

    if (!doubleConfirm) return;

    try {
      await writeContract({
        address: VESTING_CONTRACT_ADDRESS,
        abi: VESTING_SCHEDULER_ABI,
        functionName: 'renounceOwnership',
      });
    } catch (error) {
      console.error('Error renouncing ownership:', error);
      alert('Error renouncing ownership');
    }
  };

  // If not owner, don't show anything
  if (!isOwner) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🔐 Admin Panel
        </h2>
        <p className="text-gray-600 mt-2">Manage fees and contract configuration</p>
      </div>

      {/* Current Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">💰 Current Fee</h3>
          <p className="text-3xl font-bold text-purple-600">
            {currentFeePercentage ? `${Number(currentFeePercentage) / 100}%` : '...'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {currentFeePercentage ? `${currentFeePercentage.toString()} basis points` : ''}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">👤 Fee Collector</h3>
          <p className="text-sm font-mono text-gray-600 break-all">
            {currentFeeCollector ? currentFeeCollector.toString() : '...'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">🔐 Contract Owner</h3>
          <p className="text-sm font-mono text-gray-600 break-all">
            {contractOwner ? contractOwner.toString() : '...'}
          </p>
          {contractOwner?.toLowerCase() === '0x0000000000000000000000000000000000000000' && (
            <p className="text-xs text-green-600 mt-1 font-semibold">✅ Decentralized</p>
          )}
        </div>
      </div>

      {/* Withdraw Fees */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💸 Withdraw Fees</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Address
            </label>
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Examples: WETH, USDC, or any ERC20 token
            </p>
          </div>

          {tokenAddress && accumulatedFees !== undefined && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Accumulated fees:</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatEther(accumulatedFees as bigint)} tokens
              </p>
            </div>
          )}

          <button
            onClick={handleWithdrawFees}
            disabled={isPending || isConfirming || !tokenAddress}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending || isConfirming ? 'Processing...' : 'Withdraw Fees'}
          </button>

          {isConfirmed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">✅ Fees withdrawn successfully!</p>
            </div>
          )}
        </div>
      </div>

      {/* Change Fee Percentage */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Change Fee Percentage</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Fee (basis points)
            </label>
            <input
              type="number"
              value={newFeePercentage}
              onChange={(e) => setNewFeePercentage(e.target.value)}
              placeholder="250 = 2.5%"
              min="0"
              max="1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              100 basis points = 1%. Maximum: 1000 (10%)
            </p>
            {newFeePercentage && (
              <p className="text-sm text-purple-600 mt-2 font-semibold">
                = {parseInt(newFeePercentage) / 100}%
              </p>
            )}
          </div>

          <button
            onClick={handleSetFeePercentage}
            disabled={isPending || isConfirming || !newFeePercentage}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending || isConfirming ? 'Processing...' : 'Change Fee'}
          </button>
        </div>
      </div>

      {/* Change Fee Collector */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">👥 Change Fee Collector</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Address
            </label>
            <input
              type="text"
              value={newFeeCollector}
              onChange={(e) => setNewFeeCollector(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSetFeeCollector}
            disabled={isPending || isConfirming || !newFeeCollector}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending || isConfirming ? 'Processing...' : 'Change Collector'}
          </button>
        </div>
      </div>

      {/* Renounce Ownership */}
      <div className="bg-red-50 border-2 border-red-300 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-red-800 mb-4">⚠️ Renounce Contract Ownership</h3>

        <div className="bg-white p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Why do this?</strong> Renouncing ownership proves that the contract is fully decentralized
            and that no one can modify its rules or take ownership of the funds.
          </p>
          <p className="text-sm text-gray-700 mb-3">
            <strong>Consequences (IRREVERSIBLE):</strong>
          </p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Fees can never be changed again</li>
            <li>Accumulated fees cannot be withdrawn</li>
            <li>The contract cannot be paused/unpaused</li>
            <li>The contract will be completely autonomous</li>
            <li>Maximum trust for users</li>
          </ul>
        </div>

        <button
          onClick={handleRenounceOwnership}
          disabled={isPending || isConfirming || contractOwner?.toLowerCase() === '0x0000000000000000000000000000000000000000'}
          className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-4 rounded-lg font-bold hover:from-red-700 hover:to-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
        >
          {contractOwner?.toLowerCase() === '0x0000000000000000000000000000000000000000'
            ? '✅ Ownership already renounced'
            : isPending || isConfirming
              ? 'Processing...'
              : '🚨 RENOUNCE CONTRACT OWNERSHIP'}
        </button>

        {contractOwner?.toLowerCase() === '0x0000000000000000000000000000000000000000' && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold text-center">
              ✅ This contract no longer has an owner. It is fully decentralized and secure.
            </p>
          </div>
        )}
      </div>

      {/* Common tokens for reference */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-800 mb-2">📋 Common token addresses on Base:</p>
        <div className="space-y-1 text-xs font-mono text-blue-700">
          <p>WETH: 0x4200000000000000000000000000000000000006</p>
          <p>USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913</p>
          <p>DAI: 0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb</p>
        </div>
      </div>

      {/* Verified contract link */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-green-800 mb-2">🔍 Security Verification:</p>
        <a
          href={`https://basescan.org/address/${VESTING_CONTRACT_ADDRESS}#code`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-green-700 hover:text-green-900 underline font-mono"
        >
          View verified contract on BaseScan →
        </a>
      </div>
    </div>
  );
}
