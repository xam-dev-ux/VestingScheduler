'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { VESTING_CONTRACT_ADDRESS, VESTING_SCHEDULER_ABI } from '@/lib/contract';

// Dirección del owner/admin del contrato
const OWNER_ADDRESS = '0x8F058fE6b568D97f85d517Ac441b52B95722fDDe'.toLowerCase();

export function AdminPanel() {
  const { address } = useAccount();
  const [tokenAddress, setTokenAddress] = useState('');
  const [newFeePercentage, setNewFeePercentage] = useState('');
  const [newFeeCollector, setNewFeeCollector] = useState('');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Verificar si el usuario es el owner
  const isOwner = address?.toLowerCase() === OWNER_ADDRESS;

  // Leer fee percentage actual
  const { data: currentFeePercentage } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'feePercentage',
  });

  // Leer fee collector actual
  const { data: currentFeeCollector } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'feeCollector',
  });

  // Leer fees acumulados para un token
  const { data: accumulatedFees, refetch: refetchFees } = useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'accumulatedFees',
    args: tokenAddress ? [tokenAddress as `0x${string}`] : undefined,
  });

  const handleWithdrawFees = async () => {
    if (!tokenAddress) {
      alert('Por favor ingresa una dirección de token');
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
      alert('Error al retirar fees');
    }
  };

  const handleSetFeePercentage = async () => {
    const percentage = parseInt(newFeePercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 1000) {
      alert('Fee debe estar entre 0 y 1000 (0-10%)');
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
      alert('Error al cambiar fee percentage');
    }
  };

  const handleSetFeeCollector = async () => {
    if (!newFeeCollector || !newFeeCollector.startsWith('0x')) {
      alert('Ingresa una dirección válida');
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
      alert('Error al cambiar fee collector');
    }
  };

  // Si no es el owner, no mostrar nada
  if (!isOwner) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🔐 Panel de Administración
        </h2>
        <p className="text-gray-600 mt-2">Gestiona las comisiones y configuración del contrato</p>
      </div>

      {/* Información actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">💰 Fee Actual</h3>
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
      </div>

      {/* Retirar Fees */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💸 Retirar Comisiones</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección del Token
            </label>
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ejemplos: WETH, USDC, o cualquier token ERC20
            </p>
          </div>

          {tokenAddress && accumulatedFees !== undefined && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Fees acumulados:</p>
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
            {isPending || isConfirming ? 'Procesando...' : 'Retirar Fees'}
          </button>

          {isConfirmed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">✅ Fees retirados exitosamente!</p>
            </div>
          )}
        </div>
      </div>

      {/* Cambiar Fee Percentage */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Cambiar Porcentaje de Fee</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo Fee (basis points)
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
              100 basis points = 1%. Máximo: 1000 (10%)
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
            {isPending || isConfirming ? 'Procesando...' : 'Cambiar Fee'}
          </button>
        </div>
      </div>

      {/* Cambiar Fee Collector */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">👥 Cambiar Fee Collector</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Dirección
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
            {isPending || isConfirming ? 'Procesando...' : 'Cambiar Collector'}
          </button>
        </div>
      </div>

      {/* Tokens comunes para consultar */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-800 mb-2">📋 Direcciones de tokens comunes en Base:</p>
        <div className="space-y-1 text-xs font-mono text-blue-700">
          <p>WETH: 0x4200000000000000000000000000000000000006</p>
          <p>USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913</p>
          <p>DAI: 0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb</p>
        </div>
      </div>
    </div>
  );
}
