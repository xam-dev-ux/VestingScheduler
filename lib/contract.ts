export const VESTING_SCHEDULER_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "_feePercentage", "type": "uint256" },
      { "internalType": "address", "name": "_feeCollector", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "startId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "count", "type": "uint256" }
    ],
    "name": "BatchVestingCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "oldCollector", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "newCollector", "type": "address" }
    ],
    "name": "FeeCollectorUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "oldFee", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "newFee", "type": "uint256" }
    ],
    "name": "FeePercentageUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "token", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "FeesWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "vestingId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "beneficiary", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "TokensClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "vestingId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "beneficiary", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "token", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "duration", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "creator", "type": "address" }
    ],
    "name": "VestingCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "vestingId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "beneficiary", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amountReturned", "type": "uint256" }
    ],
    "name": "VestingRevoked",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address[]", "name": "beneficiaries", "type": "address[]" },
      { "internalType": "address[]", "name": "tokens", "type": "address[]" },
      { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "startTimes", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "cliffDurations", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "durations", "type": "uint256[]" },
      { "internalType": "bool[]", "name": "revocables", "type": "bool[]" }
    ],
    "name": "createBatchVesting",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "beneficiary", "type": "address" },
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "totalAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "cliffDuration", "type": "uint256" },
      { "internalType": "uint256", "name": "duration", "type": "uint256" },
      { "internalType": "bool", "name": "revocable", "type": "bool" }
    ],
    "name": "createVesting",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }],
    "name": "getClaimableAmount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }],
    "name": "getBeneficiaryVestings",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "creator", "type": "address" }],
    "name": "getCreatorVestings",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }],
    "name": "getVestingDetails",
    "outputs": [
      { "internalType": "address", "name": "beneficiary", "type": "address" },
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "totalAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "cliffDuration", "type": "uint256" },
      { "internalType": "uint256", "name": "duration", "type": "uint256" },
      { "internalType": "uint256", "name": "amountClaimed", "type": "uint256" },
      { "internalType": "uint256", "name": "claimableAmount", "type": "uint256" },
      { "internalType": "bool", "name": "revocable", "type": "bool" },
      { "internalType": "bool", "name": "revoked", "type": "bool" },
      { "internalType": "address", "name": "creator", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "vestingId", "type": "uint256" }],
    "name": "revokeVesting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feePercentage",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vestingCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeCollector",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "token", "type": "address" }],
    "name": "accumulatedFees",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "token", "type": "address" }],
    "name": "withdrawFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "newFeePercentage", "type": "uint256" }],
    "name": "setFeePercentage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "newFeeCollector", "type": "address" }],
    "name": "setFeeCollector",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const VESTING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS as `0x${string}`;
