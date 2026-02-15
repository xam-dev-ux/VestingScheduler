import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { VESTING_CONTRACT_ADDRESS } from '../contract';

// Standard ERC20 ABI for approve and allowance functions
const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

export function useTokenApproval(tokenAddress: string, amount: bigint) {
  const { address } = useAccount();
  const [needsApproval, setNeedsApproval] = useState(false);

  // Check current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, VESTING_CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: !!address && !!tokenAddress,
    }
  });

  // Check token balance
  const { data: balance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenAddress,
    }
  });

  // Approve function
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Check if approval is needed
  useEffect(() => {
    if (allowance !== undefined && amount > 0n) {
      setNeedsApproval((allowance as bigint) < amount);
    }
  }, [allowance, amount]);

  // Refetch allowance after successful approval
  useEffect(() => {
    if (isConfirmed) {
      refetchAllowance();
    }
  }, [isConfirmed, refetchAllowance]);

  const approve = async (approvalAmount?: bigint) => {
    const amountToApprove = approvalAmount || amount;

    console.log('[useTokenApproval] Approving:', {
      tokenAddress,
      spender: VESTING_CONTRACT_ADDRESS,
      amount: amountToApprove.toString()
    });

    return writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [VESTING_CONTRACT_ADDRESS, amountToApprove],
    });
  };

  const hasEnoughBalance = balance !== undefined && amount > 0n ? (balance as bigint) >= amount : true;

  return {
    allowance: allowance as bigint | undefined,
    balance: balance as bigint | undefined,
    needsApproval,
    hasEnoughBalance,
    approve,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    refetchAllowance
  };
}
