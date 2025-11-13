# Getting Started with Vesting Scheduler

Welcome! This guide will help you get your Vesting Scheduler app running from scratch.

## What You're Building

A token vesting platform on Base Network where users can:
- Create individual or batch vesting schedules
- Upload CSV files with multiple vestings
- Track all vestings in a dashboard
- Claim vested tokens automatically
- Platform earns configurable fees

## Prerequisites Check

Before starting, ensure you have:

- [ ] Node.js v18 or higher (`node --version`)
- [ ] npm (`npm --version`)
- [ ] A code editor (VS Code recommended)
- [ ] Git (optional, for version control)

For deployment, you'll also need:
- [ ] Coinbase Wallet or MetaMask
- [ ] ~0.01 ETH on Base mainnet
- [ ] OnchainKit API key (free from Coinbase)
- [ ] Basescan API key (optional, for verification)

## Step 1: Install Dependencies

Open terminal in the project directory:

```bash
# Install all packages
npm install
```

This will install:
- Next.js and React
- OnchainKit for Base integration
- Hardhat for smart contracts
- All other dependencies

**Expected time**: 2-3 minutes

## Step 2: Configure Environment

Create your environment file:

```bash
# Copy the example
cp .env.example .env
```

Open `.env` and add your keys:

```env
# For deployment only (keep this secret!)
PRIVATE_KEY=your_wallet_private_key_here

# Base RPC (you can use default)
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Get free key from https://portal.cdp.coinbase.com/
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here

# Optional: Get from https://basescan.org/myapikey
BASESCAN_API_KEY=your_basescan_key

# Will be filled after deployment
NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=

# Base mainnet chain ID
NEXT_PUBLIC_CHAIN_ID=8453
```

### Getting Your Keys

**OnchainKit API Key** (Required):
1. Go to https://portal.cdp.coinbase.com/
2. Sign up/login
3. Create new project
4. Copy API key

**Private Key** (For deployment):
1. Open MetaMask or Coinbase Wallet
2. Click account → Settings → Security & Privacy
3. Reveal Private Key
4. ⚠️ NEVER share this key!

**Basescan API Key** (Optional):
1. Go to https://basescan.org/
2. Sign up for account
3. Go to https://basescan.org/myapikey
4. Create new API key

## Step 3: Compile Smart Contract

Compile the Solidity contract:

```bash
npm run compile
```

You should see:
```
Compiled 1 Solidity file successfully
```

This creates:
- `artifacts/` directory with compiled contract
- `typechain-types/` for TypeScript types

**Expected time**: 30 seconds

## Step 4: Deploy to Base Mainnet

**⚠️ Important**: Make sure you have ~0.01 ETH on Base mainnet!

Deploy the contract:

```bash
npm run deploy
```

You'll see output like:
```
Deploying VestingScheduler contract to Base mainnet...
Deploying with account: 0x...
Fee percentage: 2.5 %
Fee collector: 0x...

✅ VestingScheduler deployed to: 0x1234...7890

Add this to your .env file:
NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=0x1234...7890

Waiting for block confirmations...
Verifying contract on Basescan...
✅ Contract verified on Basescan
```

**Copy the contract address** and add it to your `.env`:

```env
NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

**Expected time**: 2-3 minutes

## Step 5: Start Development Server

Run the app locally:

```bash
npm run dev
```

You should see:
```
> vesting-scheduler@0.1.0 dev
> next dev

  ▲ Next.js 14.2.13
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.x:3000

 ✓ Ready in 2.5s
```

Open your browser to **http://localhost:3000**

**Expected time**: 10 seconds

## Step 6: Test the App

### Connect Wallet

1. Click **"Connect"** button in header
2. Select your wallet (Coinbase Wallet recommended)
3. Approve connection
4. You should see your address and balance

### Get Test Tokens

For testing, you need some ERC20 tokens. Options:

**Option A: Use USDC on Base**
- Bridge USDC from Ethereum or buy on Base
- Address: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

**Option B: Deploy Test Token**
- Create simple ERC20 for testing
- Mint yourself tokens
- Use that address

### Create Your First Vesting

1. Fill out the form:
   - **Beneficiary**: Your address (or test address)
   - **Token**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` (USDC)
   - **Amount**: `1000000` (1 USDC with 6 decimals)
   - **Decimals**: `6`
   - **Start Time**: Leave empty (starts now)
   - **Cliff**: `0` days (no cliff for testing)
   - **Duration**: `1` day
   - **Revocable**: Check the box

2. Click **"Create Vesting"**

3. **First Time**: Approve token spending
   - Your wallet will prompt for approval
   - Confirm the transaction
   - Wait for confirmation

4. **Second Transaction**: Create vesting
   - Wallet prompts again
   - Confirm the transaction
   - Wait for confirmation

5. **Success!**
   - You'll see success message
   - Vesting appears in dashboard

### Test Batch Upload

1. Click **"Batch Upload"** tab

2. Click **"Download CSV Template"**

3. Open the downloaded CSV in Excel/Google Sheets

4. Edit the template with your data:
```csv
beneficiary,token,amount,startTime,cliffDuration,duration,revocable
0xYourAddress,0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,1000000,0,0,86400,true
0xFriendAddress,0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,2000000,0,0,172800,false
```

5. Save as CSV file

6. Upload the file in the app

7. Review the preview

8. Approve tokens and create batch

### Test Claiming

1. Wait a few minutes (or use short duration)

2. Go to **"Your Vestings"** dashboard

3. Make sure **"As Beneficiary"** is selected

4. Find vesting with claimable amount > 0

5. Click **"Claim"**

6. Confirm transaction

7. Tokens are sent to your wallet!

### Test Revoking

1. Go to **"Your Vestings"** dashboard

2. Switch to **"As Creator"** view

3. Find a revocable vesting

4. Click **"Revoke"**

5. Confirm the action

6. Transaction executes:
   - Vested amount → beneficiary
   - Remaining → you (creator)

## Step 7: Deploy to Production

### Option A: Deploy to Vercel (Recommended)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/vesting-scheduler
git push -u origin main
```

2. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repo
   - Add environment variables:
     - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
     - `NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS`
     - `NEXT_PUBLIC_BASE_RPC_URL`
     - `NEXT_PUBLIC_CHAIN_ID`
   - Click "Deploy"

3. **Done!** Your app is live at `your-project.vercel.app`

### Option B: Manual Deployment

1. **Build for production**:
```bash
npm run build
```

2. **Test production build**:
```bash
npm start
```

3. **Deploy** to your hosting provider
   - Upload `.next` folder
   - Set environment variables
   - Start with `npm start`

## Common Issues & Solutions

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### "Insufficient funds for gas"
- Need ETH on Base mainnet
- Bridge from Ethereum or buy on exchange
- Minimum ~0.01 ETH recommended

### "Transaction reverted"
- Check token approval
- Verify you have enough tokens
- Ensure addresses are valid
- Check duration is at least 1 day

### "Contract not found"
- Verify `NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS` in `.env`
- Make sure contract deployed successfully
- Check you're on Base mainnet (not testnet)

### "CSV upload fails"
- Check CSV format matches template exactly
- Verify all addresses start with "0x"
- Ensure amounts are in correct units (wei)
- Validate timestamps are not in past

### Frontend won't start
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Wallet won't connect
- Try refreshing page
- Check you're on Base network
- Try different browser
- Clear browser cache

## Next Steps

Now that your app is running:

1. **Customize**:
   - Adjust colors in `tailwind.config.ts`
   - Modify copy in components
   - Add your branding

2. **Configure Fees**:
   - Connect as contract owner
   - Call `setFeePercentage(newBasisPoints)`
   - Example: 500 = 5%, 100 = 1%

3. **Marketing**:
   - Share on Twitter
   - Post in Base community
   - Write announcement blog

4. **Monitor**:
   - Check Basescan for activity
   - Track fees accumulating
   - Monitor user feedback

5. **Withdraw Fees**:
   - Connect as owner
   - Call `withdrawFees(tokenAddress)`
   - Fees sent to fee collector

## Useful Commands

```bash
npm run dev          # Start development
npm run build        # Build for production
npm run start        # Start production server
npm run compile      # Compile contracts
npm run deploy       # Deploy to Base
npm run lint         # Check code quality
```

## Resources

- 📖 [README.md](README.md) - Full documentation
- 🚀 [QUICKSTART.md](QUICKSTART.md) - Quick reference
- 📊 [CSV_FORMAT.md](CSV_FORMAT.md) - CSV guide
- ✨ [FEATURES.md](FEATURES.md) - Feature list
- 🔧 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deploy guide

## Important Addresses

**Base Mainnet**:
- USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- WETH: `0x4200000000000000000000000000000000000006`
- DAI: `0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb`

**Base Explorer**:
- https://basescan.org

**Base Docs**:
- https://docs.base.org

## Getting Help

Need assistance?

1. **Check docs** - Most answers are in the guides
2. **Review code** - Contract and frontend are well-commented
3. **Base Discord** - Active community support
4. **GitHub Issues** - Report bugs or ask questions

## Security Reminders

- ⚠️ Never commit `.env` file
- ⚠️ Keep `PRIVATE_KEY` secret
- ⚠️ Use hardware wallet for mainnet
- ⚠️ Test on testnet first
- ⚠️ Start with small amounts

## Success! 🎉

You now have a fully functional token vesting platform running on Base!

Your users can:
- ✅ Create individual vestings
- ✅ Upload batch CSV files
- ✅ Track all vestings
- ✅ Claim tokens automatically
- ✅ Manage revocable vestings

You can:
- ✅ Earn platform fees
- ✅ Configure fee percentage
- ✅ Withdraw accumulated fees
- ✅ Pause in emergencies

**Happy vesting!** 🚀
