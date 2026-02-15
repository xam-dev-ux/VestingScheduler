'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useVestingContract } from '@/lib/hooks/useVestingContract';
import { useTokenApproval } from '@/lib/hooks/useTokenApproval';
import { parseCSVFile, downloadCSVTemplate } from '@/lib/utils/csvParser';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';

export function BatchVestingUpload() {
  const { address } = useAccount();
  const { createBatchVesting, isPending, isConfirming, isConfirmed, hash } =
    useVestingContract();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [batchCount, setBatchCount] = useState(0);

  // Calculate total amount needed per token
  const tokenAmounts = useMemo(() => {
    if (!previewData) return {};

    const amounts: { [token: string]: bigint } = {};
    previewData.tokens.forEach((token: string, idx: number) => {
      const amount = previewData.amounts[idx];
      if (amounts[token]) {
        amounts[token] += amount;
      } else {
        amounts[token] = amount;
      }
    });

    return amounts;
  }, [previewData]);

  // Get the first (and typically only) token for approval
  const primaryToken = useMemo(() => {
    return Object.keys(tokenAmounts)[0] || '';
  }, [tokenAmounts]);

  const primaryTokenAmount = useMemo(() => {
    return tokenAmounts[primaryToken] || 0n;
  }, [tokenAmounts, primaryToken]);

  // Token approval hook for the primary token
  const {
    needsApproval,
    hasEnoughBalance,
    balance,
    approve,
    isPending: isApprovePending,
    isConfirming: isApproveConfirming,
    isConfirmed: isApprovalConfirmed,
    hash: approvalHash,
  } = useTokenApproval(primaryToken, primaryTokenAmount);

  // Watch for transaction confirmation
  useEffect(() => {
    if (isConfirmed && batchCount > 0) {
      setSuccess(`Successfully created ${batchCount} vesting schedules!`);
      setFile(null);
      setPreviewData(null);
      setBatchCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isConfirmed, batchCount]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');
    setSuccess('');

    try {
      const parsed = await parseCSVFile(selectedFile);
      setPreviewData(parsed);
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV file');
      setFile(null);
      setPreviewData(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!previewData) {
      setError('Please upload a valid CSV file');
      return;
    }

    if (!address) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setBatchCount(previewData.beneficiaries.length);
      await createBatchVesting(
        previewData.beneficiaries,
        previewData.tokens,
        previewData.amounts,
        previewData.startTimes,
        previewData.cliffDurations,
        previewData.durations,
        previewData.revocables
      );

      // Success message will be shown when transaction is confirmed (via isConfirmed state)
    } catch (err: any) {
      setError(err.message || 'Failed to create batch vesting');
      setBatchCount(0);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Batch Create Vestings</h2>
        <button
          onClick={downloadCSVTemplate}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Download CSV Template
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload CSV File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-2">
            CSV should include: beneficiary, token, amount, startTime,
            cliffDuration, duration, revocable
          </p>
        </div>

        {previewData && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4">
            <h3 className="text-sm font-semibold mb-2">Preview</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Total vestings:</span>{' '}
                {previewData.beneficiaries.length}
              </p>
              <p>
                <span className="font-medium">Total tokens to vest:</span>{' '}
                {previewData.amounts.reduce((a: bigint, b: bigint) => a + b, 0n).toString()}
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  View details
                </summary>
                <div className="mt-2 max-h-60 overflow-y-auto">
                  {previewData.beneficiaries.map(
                    (beneficiary: string, index: number) => (
                      <div
                        key={index}
                        className="text-xs py-2 border-b border-gray-200 dark:border-gray-700"
                      >
                        <p className="font-mono">{beneficiary}</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Amount: {previewData.amounts[index].toString()} |
                          Duration: {(Number(previewData.durations[index]) / 86400).toFixed(0)} days
                        </p>
                      </div>
                    )
                  )}
                </div>
              </details>
            </div>
          </div>
        )}

        {/* Token Approval Status */}
        {previewData && address && primaryToken && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <h3 className="text-sm font-semibold mb-2">Token Approval Status</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Token:</span>{' '}
                <span className="font-mono text-xs">{primaryToken}</span>
              </p>
              <p>
                <span className="font-medium">Total amount needed:</span>{' '}
                {primaryTokenAmount.toString()} units
              </p>
              {balance !== undefined && (
                <p>
                  <span className="font-medium">Your balance:</span>{' '}
                  {balance.toString()} units
                </p>
              )}
              {!hasEnoughBalance && (
                <p className="text-red-600 dark:text-red-400">
                  ⚠️ Insufficient balance for batch vesting
                </p>
              )}
              {needsApproval ? (
                <p className="text-orange-600 dark:text-orange-400">
                  🔒 Approval required before creating batch vesting
                </p>
              ) : primaryTokenAmount > 0n ? (
                <p className="text-green-600 dark:text-green-400">
                  ✅ Token approval granted
                </p>
              ) : null}
            </div>

            {isApprovalConfirmed && (
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                ✅ Approval confirmed!{' '}
                {approvalHash && (
                  <a
                    href={`https://basescan.org/tx/${approvalHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View tx
                  </a>
                )}
              </div>
            )}
          </div>
        )}

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

        {/* Approve Button */}
        {needsApproval && previewData && address && primaryToken && (
          <button
            type="button"
            onClick={() => approve()}
            disabled={isApprovePending || isApproveConfirming || !hasEnoughBalance}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isApprovePending
              ? 'Awaiting Wallet Approval...'
              : isApproveConfirming
              ? 'Confirming Approval...'
              : `Approve ${primaryTokenAmount.toString()} Token Units`}
          </button>
        )}

        {/* Create Batch Vesting Button */}
        <button
          type="submit"
          disabled={!previewData || isPending || isConfirming || !address || needsApproval}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {!address
            ? 'Connect Wallet'
            : needsApproval
            ? 'Approve Tokens First'
            : isPending
            ? 'Awaiting Wallet Approval...'
            : isConfirming
            ? 'Confirming Transaction...'
            : isConfirmed
            ? 'Created!'
            : `Create ${previewData?.beneficiaries.length || 0} Vestings`}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <h3 className="text-sm font-semibold mb-2">CSV Format Guide:</h3>
        <ul className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
          <li>
            <strong>beneficiary:</strong> Ethereum address (0x...)
          </li>
          <li>
            <strong>token:</strong> Token contract address (0x...)
          </li>
          <li>
            <strong>amount:</strong> Token amount in smallest unit (e.g., wei)
          </li>
          <li>
            <strong>startTime:</strong> Unix timestamp or 0 for immediate start
          </li>
          <li>
            <strong>cliffDuration:</strong> Cliff period in seconds
          </li>
          <li>
            <strong>duration:</strong> Total vesting duration in seconds
          </li>
          <li>
            <strong>revocable:</strong> true or false
          </li>
        </ul>
      </div>
    </div>
  );
}
