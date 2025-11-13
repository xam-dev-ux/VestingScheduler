'use client';

import { useState, useRef } from 'react';
import { useVestingContract } from '@/lib/hooks/useVestingContract';
import { parseCSVFile, downloadCSVTemplate } from '@/lib/utils/csvParser';
import { useAccount } from 'wagmi';

export function BatchVestingUpload() {
  const { address } = useAccount();
  const { createBatchVesting, isPending, isConfirming, isConfirmed } =
    useVestingContract();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);

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
      await createBatchVesting(
        previewData.beneficiaries,
        previewData.tokens,
        previewData.amounts,
        previewData.startTimes,
        previewData.cliffDurations,
        previewData.durations,
        previewData.revocables
      );

      setSuccess(
        `Successfully created ${previewData.beneficiaries.length} vesting schedules!`
      );
      setFile(null);
      setPreviewData(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create batch vesting');
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={!previewData || isPending || isConfirming || !address}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPending || isConfirming
            ? 'Creating Batch...'
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
