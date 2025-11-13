import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { VESTING_SCHEDULER_ABI, VESTING_CONTRACT_ADDRESS } from '../contract';

export function useVestingContract() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

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
      args: [beneficiary, token, totalAmount, startTime, cliffDuration, duration, revocable],
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
      args: [beneficiaries, tokens, amounts, startTimes, cliffDurations, durations, revocables],
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
