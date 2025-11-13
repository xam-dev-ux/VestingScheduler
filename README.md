# Vesting Scheduler - Base Mini App

A decentralized token vesting platform built on Base Network that allows users to create and manage customizable vesting schedules with configurable fees.

## Features

### User Experience

- **Interactive Onboarding**: 6-step walkthrough explaining how the platform works
- **Modern UI**: Clean, minimalist design with glass morphism and smooth animations
- **Dark Mode**: Full support for dark/light themes
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### Core Features

- **Single Vesting Creation**: Create individual vesting schedules with custom parameters
- **Batch Vesting Upload**: Upload CSV files to create multiple vesting schedules at once
- **Configurable Parameters**:
  - Custom start times
  - Cliff periods
  - Linear vesting duration
  - Revocable/non-revocable options
- **Fee System**: Configurable platform fee (default 2.5%)
- **Real-time Dashboard**: Track all vestings as beneficiary or creator
- **Claim Interface**: Beneficiaries can claim vested tokens directly
- **Revoke Functionality**: Creators can revoke revocable vestings

## Smart Contract

The `VestingScheduler.sol` contract (400+ lines) includes:

- ERC20 token support
- Multiple vesting schedules per user
- Cliff and linear vesting periods
- Configurable fee system
- Batch creation support
- Revocation mechanism for flexible vestings
- Event emissions for tracking
- Security features (ReentrancyGuard, Pausable)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Blockchain**: Base Network (Ethereum L2)
- **Smart Contracts**: Solidity 0.8.20, OpenZeppelin
- **Web3 Integration**: OnchainKit, Wagmi, Viem
- **Wallet**: Coinbase Smart Wallet
- **Development**: Hardhat

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy the environment variables:

```bash
cp .env.example .env
```

3. Configure your `.env` file with:

```env
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
BASESCAN_API_KEY=your_basescan_api_key
```

## Deployment

### 1. Compile the Smart Contract

```bash
npm run compile
```

### 2. Deploy to Base Mainnet

```bash
npm run deploy
```

This will:
- Deploy the VestingScheduler contract
- Set initial fee percentage (2.5%)
- Verify the contract on Basescan
- Output the contract address

### 3. Update Environment Variables

Add the deployed contract address to your `.env`:

```env
NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=0x...
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

### Creating a Single Vesting

1. Connect your Coinbase Smart Wallet
2. Fill in the vesting parameters:
   - Beneficiary address
   - Token contract address
   - Amount (with decimals)
   - Start time (optional, defaults to now)
   - Cliff duration (in days)
   - Total duration (in days)
   - Revocable checkbox
3. Approve token spending (first time only)
4. Confirm the transaction

### Batch Creating Vestings

1. Download the CSV template
2. Fill in the template with vesting data:
   - `beneficiary`: Ethereum address
   - `token`: Token contract address
   - `amount`: Amount in smallest unit (wei)
   - `startTime`: Unix timestamp (0 for immediate)
   - `cliffDuration`: Cliff in seconds
   - `duration`: Total duration in seconds
   - `revocable`: true/false
3. Upload the CSV file
4. Review the preview
5. Approve and confirm the batch transaction

### CSV Format Example

```csv
beneficiary,token,amount,startTime,cliffDuration,duration,revocable
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,1000000000,0,2592000,31536000,true
0x1234567890123456789012345678901234567890,0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,5000000000,1704067200,0,15552000,false
```

### Claiming Tokens

1. Navigate to "Your Vestings" dashboard
2. Switch to "As Beneficiary" view
3. Find vestings with claimable amounts
4. Click "Claim" to receive vested tokens

### Revoking Vestings

1. Navigate to "Your Vestings" dashboard
2. Switch to "As Creator" view
3. Find revocable vestings
4. Click "Revoke" to cancel the vesting
5. Vested tokens go to beneficiary, remaining returns to creator

## Contract Architecture

### Key Functions

- `createVesting()`: Create a single vesting schedule
- `createBatchVesting()`: Create multiple vestings at once
- `claim()`: Beneficiary claims vested tokens
- `revokeVesting()`: Creator cancels a revocable vesting
- `getClaimableAmount()`: Calculate claimable tokens
- `getVestingDetails()`: Get full vesting information

### Fee System

- Configurable fee percentage (in basis points)
- Default: 250 basis points (2.5%)
- Maximum: 1000 basis points (10%)
- Fees collected on vesting creation
- Owner can withdraw accumulated fees

### Security Features

- OpenZeppelin contracts (Ownable, ReentrancyGuard, Pausable)
- SafeERC20 for token transfers
- Input validation on all functions
- Reentrancy protection
- Emergency pause functionality

## Testing on Base Sepolia

To test on Base Sepolia testnet first:

1. Get testnet ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
2. Update hardhat.config.ts to use `baseSepolia` network
3. Deploy: `npx hardhat run scripts/deploy.ts --network baseSepolia`
4. Update `.env` with testnet contract address

## Project Structure

```
baseapp4/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page
│   ├── providers.tsx      # Web3 providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # App header with wallet
│   ├── CreateVestingForm.tsx
│   ├── BatchVestingUpload.tsx
│   └── VestingDashboard.tsx
├── contracts/             # Smart contracts
│   └── VestingScheduler.sol
├── lib/                   # Utilities and hooks
│   ├── contract.ts        # Contract ABI and address
│   ├── hooks/
│   │   └── useVestingContract.ts
│   └── utils/
│       └── csvParser.ts   # CSV parsing utilities
├── scripts/               # Deployment scripts
│   └── deploy.ts
├── hardhat.config.ts      # Hardhat configuration
└── package.json
```

## Common Token Addresses on Base

- **USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **WETH**: `0x4200000000000000000000000000000000000006`
- **DAI**: `0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb`

## Troubleshooting

### Transaction Fails
- Ensure you have enough ETH for gas
- Check token approval is sufficient
- Verify all addresses are valid
- Ensure duration is at least 1 day

### CSV Upload Issues
- Verify CSV format matches template
- Check all addresses are valid
- Ensure amounts are in correct units
- Validate timestamps and durations

### Claim Not Working
- Verify cliff period has passed
- Check vesting hasn't been revoked
- Ensure connected as beneficiary
- Wait for sufficient time to vest

## Resources

- [Base Docs](https://docs.base.org)
- [OnchainKit](https://onchainkit.xyz)
- [Base Mini Apps Guide](https://docs.base.org/mini-apps/quickstart/create-new-miniapp)
- [Coinbase Smart Wallet](https://www.coinbase.com/wallet)

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues or questions:
- Open a GitHub issue
- Check Base Discord for community support
