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

// Generate a friendly username from address (never show 0x addresses per Base guidelines)
function generateUsername(address: string): string {
  const adjectives = [
    'Cosmic', 'Stellar', 'Nebula', 'Galactic', 'Quantum', 'Crypto', 'Digital', 'Virtual',
    'Phantom', 'Shadow', 'Mystic', 'Thunder', 'Lightning', 'Phoenix', 'Dragon', 'Emerald'
  ];

  const nouns = [
    'Whale', 'Shark', 'Tiger', 'Eagle', 'Wolf', 'Bear', 'Lion', 'Falcon',
    'Viper', 'Cobra', 'Raven', 'Hawk', 'Lynx', 'Puma', 'Panther', 'Leopard'
  ];

  // Use address bytes to deterministically pick adjective and noun
  const addrNum = parseInt(address.slice(2, 10), 16);
  const adjIndex = addrNum % adjectives.length;
  const nounIndex = Math.floor(addrNum / adjectives.length) % nouns.length;

  // Add last 4 chars of address for uniqueness
  const suffix = address.slice(-4).toUpperCase();

  return `${adjectives[adjIndex]}${nouns[nounIndex]}${suffix}`;
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

  // Priority: Basename > ENS > Generated Username (NEVER show 0x address per Base guidelines)
  const finalDisplay = basename || ensName || generateUsername(address);

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
          alt={finalDisplay}
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
