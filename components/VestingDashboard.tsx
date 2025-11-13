'use client';

import { useAccount } from 'wagmi';
import {
  useBeneficiaryVestings,
  useCreatorVestings,
  useVestingDetails,
  useVestingContract,
} from '@/lib/hooks/useVestingContract';
import { useState } from 'react';
import { formatUnits } from 'viem';
import { format } from 'date-fns';

function VestingCard({ vestingId }: { vestingId: bigint }) {
  const { data: details, isLoading } = useVestingDetails(vestingId);
  const { claimVesting, revokeVesting, isPending } = useVestingContract();
  const { address } = useAccount();

  if (isLoading || !details) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  const [
    beneficiary,
    token,
    totalAmount,
    startTime,
    cliffDuration,
    duration,
    amountClaimed,
    claimableAmount,
    revocable,
    revoked,
    creator,
  ] = details;

  const isBeneficiary = address?.toLowerCase() === beneficiary.toLowerCase();
  const isCreator = address?.toLowerCase() === creator.toLowerCase();
  const canClaim = isBeneficiary && claimableAmount > 0n && !revoked;
  const canRevoke = isCreator && revocable && !revoked;

  const startDate = new Date(Number(startTime) * 1000);
  const endDate = new Date((Number(startTime) + Number(duration)) * 1000);
  const cliffDate = new Date((Number(startTime) + Number(cliffDuration)) * 1000);

  const progress =
    Number(totalAmount) > 0
      ? (Number(amountClaimed) / Number(totalAmount)) * 100
      : 0;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">Vesting #{vestingId.toString()}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {token.slice(0, 6)}...{token.slice(-4)}
          </p>
        </div>
        {revoked && (
          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
            Revoked
          </span>
        )}
        {!revoked && revocable && (
          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
            Revocable
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Total:</span>
          <span className="font-medium">
            {formatUnits(totalAmount, 18)} tokens
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Claimed:</span>
          <span className="font-medium">
            {formatUnits(amountClaimed, 18)} tokens
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Claimable:</span>
          <span className="font-medium text-green-600">
            {formatUnits(claimableAmount, 18)} tokens
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
            <p>Start: {format(startDate, 'MMM dd, yyyy HH:mm')}</p>
            {cliffDuration > 0n && (
              <p>Cliff: {format(cliffDate, 'MMM dd, yyyy HH:mm')}</p>
            )}
            <p>End: {format(endDate, 'MMM dd, yyyy HH:mm')}</p>
          </div>
        </div>

        {isBeneficiary && (
          <div className="text-xs mt-2">
            <p className="text-gray-600 dark:text-gray-400">
              Beneficiary (You)
            </p>
          </div>
        )}
        {isCreator && (
          <div className="text-xs mt-2">
            <p className="text-gray-600 dark:text-gray-400">
              Creator (You)
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {canClaim && (
          <button
            onClick={() => claimVesting(vestingId)}
            disabled={isPending}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-md disabled:bg-gray-400"
          >
            Claim
          </button>
        )}
        {canRevoke && (
          <button
            onClick={() => {
              if (
                confirm(
                  'Are you sure you want to revoke this vesting? This action cannot be undone.'
                )
              ) {
                revokeVesting(vestingId);
              }
            }}
            disabled={isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-md disabled:bg-gray-400"
          >
            Revoke
          </button>
        )}
      </div>
    </div>
  );
}

export function VestingDashboard() {
  const { address } = useAccount();
  const [view, setView] = useState<'beneficiary' | 'creator'>('beneficiary');

  const { data: beneficiaryVestings, isLoading: loadingBeneficiary } =
    useBeneficiaryVestings(address || '');
  const { data: creatorVestings, isLoading: loadingCreator } =
    useCreatorVestings(address || '');

  if (!address) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <p className="text-center text-gray-600 dark:text-gray-400">
          Connect your wallet to view your vesting schedules
        </p>
      </div>
    );
  }

  const vestings =
    view === 'beneficiary' ? beneficiaryVestings : creatorVestings;
  const isLoading =
    view === 'beneficiary' ? loadingBeneficiary : loadingCreator;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Vestings</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('beneficiary')}
            className={`px-4 py-2 text-sm rounded-md ${
              view === 'beneficiary'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            As Beneficiary
          </button>
          <button
            onClick={() => setView('creator')}
            className={`px-4 py-2 text-sm rounded-md ${
              view === 'creator'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            As Creator
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : vestings && vestings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vestings.map((vestingId) => (
            <VestingCard key={vestingId.toString()} vestingId={vestingId} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 py-8">
          No vesting schedules found
        </p>
      )}
    </div>
  );
}
