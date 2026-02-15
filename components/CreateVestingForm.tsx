'use client';

import { useState, useEffect } from 'react';
import { parseUnits } from 'viem';
import { useVestingContract } from '@/lib/hooks/useVestingContract';
import { useAccount } from 'wagmi';

export function CreateVestingForm() {
  const { address } = useAccount();
  const { createVesting, isPending, isConfirming, isConfirmed, hash } = useVestingContract();

  const [formData, setFormData] = useState({
    beneficiary: '',
    token: '',
    amount: '',
    decimals: '18',
    startTime: '',
    cliffDays: '',
    durationDays: '',
    revocable: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Watch for transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      setSuccess('Vesting created successfully!');
      setFormData({
        beneficiary: '',
        token: '',
        amount: '',
        decimals: '18',
        startTime: '',
        cliffDays: '',
        durationDays: '',
        revocable: false,
      });
    }
  }, [isConfirmed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('[CreateVesting] Form submitted');
    console.log('[CreateVesting] Wallet address:', address);
    console.log('[CreateVesting] Form data:', formData);

    try {
      if (!address) {
        throw new Error('Please connect your wallet');
      }

      // Validaciones
      if (!/^0x[a-fA-F0-9]{40}$/.test(formData.beneficiary)) {
        throw new Error('Invalid beneficiary address');
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(formData.token)) {
        throw new Error('Invalid token address');
      }

      const amount = parseUnits(formData.amount, parseInt(formData.decimals));
      const startTime = formData.startTime
        ? BigInt(Math.floor(new Date(formData.startTime).getTime() / 1000))
        : 0n;
      const cliffDuration = BigInt(parseInt(formData.cliffDays) * 86400);
      const duration = BigInt(parseInt(formData.durationDays) * 86400);

      console.log('[CreateVesting] Parsed values:', {
        amount: amount.toString(),
        startTime: startTime.toString(),
        cliffDuration: cliffDuration.toString(),
        duration: duration.toString()
      });

      if (duration < 86400n) {
        throw new Error('Duration must be at least 1 day');
      }
      if (cliffDuration > duration) {
        throw new Error('Cliff duration cannot exceed total duration');
      }

      console.log('[CreateVesting] Calling createVesting...');
      await createVesting(
        formData.beneficiary,
        formData.token,
        amount,
        startTime,
        cliffDuration,
        duration,
        formData.revocable
      );

      console.log('[CreateVesting] createVesting call completed');
      // Success message will be shown when transaction is confirmed (via isConfirmed state)
    } catch (err: any) {
      console.error('[CreateVesting] Error:', err);
      setError(err.message || 'Failed to create vesting');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Create Vesting Schedule</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Beneficiary Address
          </label>
          <input
            type="text"
            value={formData.beneficiary}
            onChange={(e) =>
              setFormData({ ...formData, beneficiary: e.target.value })
            }
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Token Address
          </label>
          <input
            type="text"
            value={formData.token}
            onChange={(e) => setFormData({ ...formData, token: e.target.value })}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            USDC on Base: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="text"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="1000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Decimals</label>
            <input
              type="number"
              value={formData.decimals}
              onChange={(e) =>
                setFormData({ ...formData, decimals: e.target.value })
              }
              placeholder="18"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Start Time (optional)
          </label>
          <input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to start immediately
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Cliff Duration (days)
            </label>
            <input
              type="number"
              value={formData.cliffDays}
              onChange={(e) =>
                setFormData({ ...formData, cliffDays: e.target.value })
              }
              placeholder="30"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Total Duration (days)
            </label>
            <input
              type="number"
              value={formData.durationDays}
              onChange={(e) =>
                setFormData({ ...formData, durationDays: e.target.value })
              }
              placeholder="365"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              required
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="revocable"
            checked={formData.revocable}
            onChange={(e) =>
              setFormData({ ...formData, revocable: e.target.checked })
            }
            className="mr-2"
          />
          <label htmlFor="revocable" className="text-sm">
            Revocable (can be cancelled by creator)
          </label>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <div>{success}</div>
            {hash && (
              <a
                href={`https://basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View on BaseScan →
              </a>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || isConfirming || !address}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {!address
            ? 'Connect Wallet'
            : isPending
            ? 'Awaiting Wallet Approval...'
            : isConfirming
            ? 'Confirming Transaction...'
            : isConfirmed
            ? 'Created!'
            : 'Create Vesting'}
        </button>
      </form>
    </div>
  );
}
