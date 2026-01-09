import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { useCapabilities } from 'wagmi/experimental';
import { VESTING_SCHEDULER_ABI, VESTING_CONTRACT_ADDRESS } from '../contract';
import { base } from 'wagmi/chains';

/**
 * Hook for interacting with the Vesting Contract
 *
 * Paymaster Support:
 * When using Coinbase Smart Wallet with OnchainKit, transactions are automatically
 * sponsored (gas-free) without additional configuration needed. The OnchainKitProvider
 * with a valid API key handles the paymaster integration automatically.
 */
export function useVestingContract() {
  const { address } = useAccount();

  // Check if user has paymaster capabilities (Coinbase Smart Wallet)
  const { data: capabilities } = useCapabilities({
    account: address,
  });

  // Standard wagmi hooks for contract interactions
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  // Check if paymaster is available (Coinbase Smart Wallet users get free gas)
  const paymasterService = capabilities?.[base.id]?.paymasterService;
  const hasPaymaster = paymasterService?.supported === true;

  const createVesting = async (
    beneficiary: string,
    token: string,
    totalAmount: bigint,
    startTime: bigint,
    cliffDuration: bigint,
    duration: bigint,
    revocable: boolean
  ) => {
    return writeContract({
      address: VESTING_CONTRACT_ADDRESS,
      abi: VESTING_SCHEDULER_ABI,
      functionName: 'createVesting',
      args: [beneficiary as `0x${string}`, token as `0x${string}`, totalAmount, startTime, cliffDuration, duration, revocable],
    });
  };

  const createBatchVesting = async (
    beneficiaries: string[],
    tokens: string[],
    amounts: bigint[],
    startTimes: bigint[],
    cliffDurations: bigint[],
    durations: bigint[],
    revocables: boolean[]
  ) => {
    return writeContract({
      address: VESTING_CONTRACT_ADDRESS,
      abi: VESTING_SCHEDULER_ABI,
      functionName: 'createBatchVesting',
      args: [beneficiaries as `0x${string}`[], tokens as `0x${string}`[], amounts, startTimes, cliffDurations, durations, revocables],
    });
  };

  const claimVesting = async (vestingId: bigint) => {
    return writeContract({
      address: VESTING_CONTRACT_ADDRESS,
      abi: VESTING_SCHEDULER_ABI,
      functionName: 'claim',
      args: [vestingId],
    });
  };

  const revokeVesting = async (vestingId: bigint) => {
    return writeContract({
      address: VESTING_CONTRACT_ADDRESS,
      abi: VESTING_SCHEDULER_ABI,
      functionName: 'revokeVesting',
      args: [vestingId],
    });
  };

  return {
    createVesting,
    createBatchVesting,
    claimVesting,
    revokeVesting,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    hasPaymaster, // Indicates if user has Coinbase Smart Wallet (gas-free transactions)
  };
}

export function useVestingDetails(vestingId: bigint) {
  return useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'getVestingDetails',
    args: [vestingId],
  });
}

export function useBeneficiaryVestings(beneficiary: string) {
  return useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'getBeneficiaryVestings',
    args: [beneficiary as `0x${string}`],
  });
}

export function useCreatorVestings(creator: string) {
  return useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'getCreatorVestings',
    args: [creator as `0x${string}`],
  });
}

export function useClaimableAmount(vestingId: bigint) {
  return useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'getClaimableAmount',
    args: [vestingId],
  });
}

export function useFeePercentage() {
  return useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'feePercentage',
  });
}

export function useVestingCount() {
  return useReadContract({
    address: VESTING_CONTRACT_ADDRESS,
    abi: VESTING_SCHEDULER_ABI,
    functionName: 'vestingCount',
  });
}
