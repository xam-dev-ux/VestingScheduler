'use client';

import { useEnsName, useEnsAvatar } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { normalize } from 'viem/ens';

interface AddressDisplayProps {
  address: string;
  showAvatar?: boolean;
  showFull?: boolean;
  className?: string;
}

export function AddressDisplay({
  address,
  showAvatar = false,
  showFull = false,
  className = ''
}: AddressDisplayProps) {
  // Try to get ENS name from mainnet
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: mainnet.id,
  });

  // Try to get Basename from Base
  const { data: basename } = useEnsName({
    address: address as `0x${string}`,
    chainId: base.id,
  });

  // Get avatar if available
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ? normalize(ensName) : undefined,
    chainId: mainnet.id,
  });

  const displayName = basename || ensName || address;
  const shortAddress = showFull
    ? address
    : `${address.slice(0, 6)}...${address.slice(-4)}`;

  const finalDisplay = (basename || ensName) ? displayName : shortAddress;

  if (!showAvatar) {
    return (
      <span className={className} title={address}>
        {finalDisplay}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {ensAvatar ? (
        <img
          src={ensAvatar}
          alt={displayName}
          className="w-6 h-6 rounded-full"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
          {address.slice(2, 4).toUpperCase()}
        </div>
      )}
      <span title={address}>{finalDisplay}</span>
    </div>
  );
}
