# Quick Start Guide

Get your Vesting Scheduler running in 5 minutes!

## Prerequisites

- Node.js v18+
- npm or yarn
- Coinbase Wallet or any Web3 wallet
- Base mainnet ETH (~0.01 for deployment)

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env

# 3. Edit .env with your keys
# - Add PRIVATE_KEY (for deployment)
# - Add NEXT_PUBLIC_ONCHAINKIT_API_KEY
# - Add BASESCAN_API_KEY (optional)
```

## Deploy Contract

```bash
# Compile
npm run compile

# Deploy to Base mainnet
npm run deploy

# Copy the contract address output to .env
# NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=0x...
```

## Run Locally

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## First Vesting

1. **Connect Wallet** - Click "Connect" in header
2. **Get Test Tokens** - Need ERC20 tokens to vest
3. **Create Vesting**:
   - Beneficiary: Your test address
   - Token: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` (USDC)
   - Amount: `1000000` (1 USDC with 6 decimals)
   - Cliff: `0` days
   - Duration: `1` day
   - Revocable: Check the box
4. **Approve Token** - Confirm in wallet
5. **Create** - Confirm transaction
6. **View** - See in dashboard!

## Batch Upload

1. **Download Template** - Click "Download CSV Template"
2. **Edit CSV**:
```csv
beneficiary,token,amount,startTime,cliffDuration,duration,revocable
0xYourAddress,0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,1000000,0,0,86400,true
```
3. **Upload** - Select file
4. **Review** - Check preview
5. **Create** - Confirm transaction

## Test Claiming

1. Switch to "As Beneficiary" in dashboard
2. Wait for some time to pass (or use short duration)
3. Click "Claim" on vesting card
4. Confirm transaction
5. Tokens received!

## Deploy to Production

### Vercel (Recommended)

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# Deploy on Vercel
# 1. Import GitHub repo
# 2. Add environment variables
# 3. Deploy
```

### Manual Build

```bash
npm run build
npm start
```

## Common Issues

### "Insufficient funds"
- Need ETH on Base for gas
- Get ETH from exchange or bridge

### "Contract not found"
- Check NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS in .env
- Ensure deployed to Base mainnet

### "Token approval failed"
- Ensure you have enough tokens
- Check token address is correct
- Try increasing gas limit

### "CSV upload error"
- Check CSV format matches template
- Verify all addresses are valid (0x...)
- Ensure amounts are in correct units

## Testing on Base Sepolia

To test without mainnet costs:

```bash
# Update hardhat.config.ts network to baseSepolia
# Get testnet ETH from Base Sepolia faucet
# Deploy to testnet
npx hardhat run scripts/deploy.ts --network baseSepolia

# Update .env with testnet contract address
# Use testnet tokens for testing
```

## Getting Help

- 📖 [Full Documentation](README.md)
- 🚀 [Deployment Guide](DEPLOYMENT_GUIDE.md)
- 📊 [CSV Format Guide](CSV_FORMAT.md)
- ✨ [Features Overview](FEATURES.md)

## Next Steps

1. ✅ Deploy contract to mainnet
2. ✅ Create first vesting
3. ✅ Test claiming
4. ✅ Try batch upload
5. ✅ Deploy frontend to Vercel
6. ✅ Share with users!

## Key Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production
npm run compile      # Compile contracts
npm run deploy       # Deploy to Base
npm run lint         # Run linter
```

## Important Addresses (Base Mainnet)

```
USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
WETH: 0x4200000000000000000000000000000000000006
DAI:  0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb
```

## Configuration

Adjust fee percentage after deployment:
```javascript
// Connect as contract owner
// Call: setFeePercentage(newBasisPoints)
// Example: 500 = 5%, 100 = 1%
```

---

**Ready to vest?** Start with `npm install` and follow the steps above! 🚀
