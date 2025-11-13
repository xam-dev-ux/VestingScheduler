# Deployment Guide - Vesting Scheduler on Base

This guide walks you through deploying the Vesting Scheduler mini app to Base mainnet.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Base Mainnet ETH** for deployment (~0.01 ETH)
3. **Coinbase Developer Platform Account** for OnchainKit API key
4. **Basescan API Key** for contract verification

## Step-by-Step Deployment

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in the following variables:

```env
# Your private key (KEEP THIS SECRET!)
PRIVATE_KEY=your_private_key_here

# Base Mainnet RPC (default is public, consider using your own)
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Get from https://portal.cdp.coinbase.com/
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Get from https://basescan.org/myapikey
BASESCAN_API_KEY=your_basescan_api_key

# Will be filled after deployment
NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile Smart Contract

```bash
npm run compile
```

This will:
- Compile the Solidity contract
- Generate TypeScript types
- Create artifacts in `artifacts/` directory

### 4. Deploy to Base Mainnet

```bash
npm run deploy
```

The script will:
1. Deploy VestingScheduler with 2.5% fee
2. Set the deployer as fee collector
3. Verify contract on Basescan
4. Display the contract address

**Expected Output:**
```
Deploying VestingScheduler contract to Base mainnet...
Deploying with account: 0x...
Fee percentage: 2.5 %
Fee collector: 0x...

✅ VestingScheduler deployed to: 0x1234567890123456789012345678901234567890

Add this to your .env file:
NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

Waiting for block confirmations...
Verifying contract on Basescan...
✅ Contract verified on Basescan
```

### 5. Update Environment Variables

Copy the contract address from the output and add it to `.env`:

```env
NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

### 6. Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and test the app:
1. Connect wallet
2. Create a test vesting
3. Verify transaction on Basescan

### 7. Deploy Frontend

#### Option A: Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
   - `NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_BASE_RPC_URL`
   - `NEXT_PUBLIC_CHAIN_ID=8453`
4. Deploy

#### Option B: Build and Deploy Manually

```bash
npm run build
npm start
```

Deploy the `.next` folder to your hosting provider.

## Post-Deployment Configuration

### 1. Update Fee Percentage (Optional)

If you want to change the fee from 2.5%:

```solidity
// Connect as contract owner
// Call setFeePercentage with new basis points
// Example: 500 = 5%, 100 = 1%
```

### 2. Update Fee Collector (Optional)

To change where fees are sent:

```solidity
// Connect as contract owner
// Call setFeeCollector with new address
```

### 3. Test with Mainnet Tokens

Recommended tokens for testing on Base:
- **USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **WETH**: `0x4200000000000000000000000000000000000006`

Create a test vesting with small amounts first.

## Verification Checklist

- [ ] Contract deployed successfully
- [ ] Contract verified on Basescan
- [ ] Frontend connects to correct contract
- [ ] Wallet connection works
- [ ] Can create single vesting
- [ ] Can upload batch CSV
- [ ] Dashboard displays vestings correctly
- [ ] Claim function works
- [ ] Revoke function works (for revocable vestings)

## Monitoring

### View Contract on Basescan

Visit: `https://basescan.org/address/YOUR_CONTRACT_ADDRESS`

You can:
- View all transactions
- Read contract state
- Verify code
- Track fee accumulation

### Analytics

Monitor key metrics:
- Total vestings created
- Total value locked
- Fees collected
- Active vs completed vestings

### Events to Track

Important events emitted:
- `VestingCreated`: New vesting created
- `TokensClaimed`: Beneficiary claimed tokens
- `VestingRevoked`: Creator revoked vesting
- `BatchVestingCreated`: Batch creation completed
- `FeesWithdrawn`: Owner withdrew fees

## Security Considerations

1. **Private Key Security**
   - Never commit `.env` file
   - Use hardware wallet for mainnet deployment
   - Consider using a multisig for contract ownership

2. **Contract Ownership**
   - Transfer ownership to secure address after deployment
   - Consider using a Gnosis Safe multisig

3. **Fee Collection**
   - Regularly withdraw accumulated fees
   - Monitor fee collector address

4. **Emergency Actions**
   - Contract has pause functionality
   - Only use in critical situations
   - Communicate with users before pausing

## Updating the Contract

The contract is immutable once deployed. To update:

1. Deploy new version of contract
2. Update `NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS`
3. Communicate migration path to users
4. Old vestings remain on old contract

## Common Issues

### Deployment Fails

**Problem**: "Insufficient funds for gas"
- **Solution**: Add more ETH to deployer wallet

**Problem**: "Nonce too high"
- **Solution**: Reset wallet nonce or wait for pending tx

### Contract Not Verified

**Problem**: Verification fails
- **Solution**: Run manually:
```bash
npx hardhat verify --network base CONTRACT_ADDRESS 250 FEE_COLLECTOR_ADDRESS
```

### Frontend Can't Connect

**Problem**: Contract calls fail
- **Solution**: Verify contract address in `.env`
- **Solution**: Check RPC URL is correct
- **Solution**: Ensure wallet is on Base network

## Costs

Estimated deployment costs on Base:
- Contract deployment: ~$2-5 (depending on gas)
- Contract verification: Free
- Test transactions: ~$0.10-0.50 each

## Next Steps

After successful deployment:

1. **Create Documentation**
   - Write user guide
   - Create video tutorials
   - Add FAQ section

2. **Marketing**
   - Share on Base community channels
   - Tweet about launch
   - Write blog post

3. **Monitor & Iterate**
   - Track user feedback
   - Monitor gas costs
   - Plan v2 features

## Support Resources

- [Base Discord](https://discord.gg/buildonbase)
- [OnchainKit Docs](https://onchainkit.xyz)
- [Hardhat Docs](https://hardhat.org)
- [Base Developer Docs](https://docs.base.org)

## Contract Management Commands

```bash
# View contract info
npx hardhat console --network base

# Withdraw fees (as owner)
# Connect wallet and call withdrawFees(tokenAddress)

# Pause contract (emergency only)
# Connect wallet and call pause()

# Unpause contract
# Connect wallet and call unpause()
```

## Maintenance

Regular maintenance tasks:
1. Monitor accumulated fees
2. Check for security updates in dependencies
3. Test with new token launches
4. Review user feedback
5. Update documentation

## Backup & Recovery

Backup important data:
- Contract address
- Deployment transaction hash
- Contract ABI
- Initial configuration (fee %, fee collector)
- Deployer address

Store in secure location (password manager, safe).

---

For issues or questions during deployment, open a GitHub issue or reach out on Base Discord.
