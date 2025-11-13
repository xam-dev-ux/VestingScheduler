# Scripts & Deployment Guide

Complete guide for all setup and deployment scripts.

## Available Scripts

### 1. setup.sh - Complete Setup Assistant 🚀

**Purpose**: Interactive setup wizard that guides you through the entire configuration process.

**What it does**:
- ✅ Checks prerequisites (Node.js, npm, git)
- ✅ Installs dependencies
- ✅ Configures environment variables (.env)
- ✅ Compiles smart contract
- ✅ Deploys to Base mainnet (optional)
- ✅ Creates farcaster.json
- ✅ Tests locally (optional)
- ✅ Guides Vercel deployment

**Usage**:
```bash
./setup.sh
```

**When to use**: First time setup or complete reconfiguration

---

### 2. deploy-vercel.sh - Vercel Deployment 📦

**Purpose**: Dedicated script for deploying to Vercel with proper configuration.

**What it does**:
- ✅ Initializes git if needed
- ✅ Offers CLI or GitHub deployment
- ✅ Sets environment variables
- ✅ Provides post-deployment checklist
- ✅ Guides image upload
- ✅ Farcaster configuration tips

**Usage**:
```bash
./deploy-vercel.sh
```

**When to use**: When you're ready to deploy to production

---

### 3. INSTALL.sh - Quick Install 📥

**Purpose**: Fast installation of dependencies and basic setup.

**What it does**:
- ✅ Checks Node.js and npm
- ✅ Installs dependencies
- ✅ Creates .env from template
- ✅ Compiles contracts

**Usage**:
```bash
./INSTALL.sh
```

**When to use**: Quick setup without interactive configuration

---

## NPM Scripts

All available npm commands:

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Smart Contracts
```bash
npm run compile      # Compile Solidity contracts
npm run deploy       # Deploy to Base mainnet
```

---

## Step-by-Step Workflows

### Workflow 1: First Time Setup (Recommended)

For new users starting from scratch:

```bash
# 1. Run the complete setup assistant
./setup.sh

# Follow the prompts to:
# - Install dependencies
# - Configure environment variables
# - Compile contract
# - Deploy contract (optional)
# - Test locally

# 2. When ready, deploy to Vercel
./deploy-vercel.sh

# 3. Update farcaster.json with your Vercel URL
nano public/farcaster.json

# 4. Add images to public/ directory
# - og-image.png
# - icon.png
# - splash.png
# - screenshot-*.png

# 5. Redeploy
vercel --prod
```

---

### Workflow 2: Quick Development Setup

For developers who want manual control:

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Edit .env manually
nano .env

# 4. Compile contracts
npm run compile

# 5. Start development
npm run dev
```

---

### Workflow 3: Deploy Contract Only

When you only need to deploy the smart contract:

```bash
# 1. Ensure .env has PRIVATE_KEY
nano .env

# 2. Compile
npm run compile

# 3. Deploy
npm run deploy

# 4. Copy contract address and add to .env
# NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=0x...
```

---

### Workflow 4: Deploy Frontend Only

When contract is already deployed:

```bash
# 1. Ensure .env has contract address
nano .env

# 2. Build
npm run build

# 3. Deploy to Vercel
./deploy-vercel.sh
```

---

## Environment Variables Reference

### Required for Frontend

```env
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key_here
NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=0x...
```

### Required for Deployment

```env
PRIVATE_KEY=0x...
BASESCAN_API_KEY=your_key_here
```

### How to Get Keys

**OnchainKit API Key**:
1. Visit: https://portal.cdp.coinbase.com/
2. Create account → New project → Copy API key

**Private Key**:
1. MetaMask: Settings → Security & Privacy → Reveal Private Key
2. ⚠️ NEVER share this or commit to git

**Basescan API Key**:
1. Visit: https://basescan.org/myapikey
2. Sign up → API Keys → Create new key

---

## Troubleshooting

### Script Won't Run

**Problem**: `Permission denied`

**Solution**:
```bash
chmod +x setup.sh
chmod +x deploy-vercel.sh
chmod +x INSTALL.sh
```

### Dependencies Fail to Install

**Problem**: npm install errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Contract Compilation Fails

**Problem**: Hardhat errors

**Solution**:
```bash
# Check Node.js version (need v18+)
node --version

# Reinstall hardhat
npm install --save-dev hardhat

# Try again
npm run compile
```

### Deployment Fails

**Problem**: Transaction reverts or fails

**Solution**:
1. Check you have ETH on Base mainnet
2. Verify private key is correct (64 hex chars)
3. Check RPC URL is correct
4. Try with more gas: Edit `hardhat.config.ts`

### Vercel Build Fails

**Problem**: Build errors on Vercel

**Solution**:
1. Check environment variables are set
2. Ensure build works locally: `npm run build`
3. Check Vercel logs for specific errors
4. Verify Next.js version compatibility

---

## Advanced Usage

### Custom RPC URL

If you want to use your own RPC:

```bash
# Get from Alchemy, Infura, or QuickNode
# Add to .env:
NEXT_PUBLIC_BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### Custom Fee Percentage

Default is 2.5% (250 basis points). To change:

```typescript
// In scripts/deploy.ts, line 11:
const feePercentage = 100; // 1%
// Or
const feePercentage = 500; // 5%
```

### Deploy to Testnet

To test on Base Sepolia first:

```bash
# 1. Update hardhat.config.ts
# Change network to: baseSepolia

# 2. Get testnet ETH
# Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

# 3. Deploy
npx hardhat run scripts/deploy.ts --network baseSepolia
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Automated Testing

Add to `package.json`:

```json
{
  "scripts": {
    "test": "npm run compile && npm run build"
  }
}
```

---

## Script Customization

### Modify setup.sh

To add custom steps:

```bash
# Edit setup.sh
nano setup.sh

# Add before final summary:
echo -e "\n${BLUE}Custom Step${NC}"
# Your custom commands here
```

### Add New Script

Create custom deployment script:

```bash
#!/bin/bash
# custom-deploy.sh

echo "Running custom deployment..."
npm run build
# Your custom steps
```

Make executable:
```bash
chmod +x custom-deploy.sh
```

---

## Security Best Practices

### Never Commit Secrets

```bash
# Ensure .gitignore includes:
.env
.env.local
.env.*.local
```

### Use Environment Variables

```bash
# In scripts, never hardcode:
# ❌ BAD
PRIVATE_KEY="0x123..."

# ✅ GOOD
PRIVATE_KEY="${PRIVATE_KEY}"
```

### Verify Before Deploy

```bash
# Always check values:
echo "Deploying to: ${NEXT_PUBLIC_BASE_RPC_URL}"
echo "Contract: ${NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS}"
read -p "Continue? (y/n) " confirm
```

---

## Quick Reference

### One-Line Commands

```bash
# Complete setup
./setup.sh

# Deploy to Vercel
./deploy-vercel.sh

# Rebuild and deploy
npm run build && vercel --prod

# Check deployment
curl https://your-app.vercel.app/farcaster.json | jq .

# View contract on Basescan
open https://basescan.org/address/YOUR_CONTRACT_ADDRESS
```

### Useful Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
alias vs-dev='cd /path/to/baseapp4 && npm run dev'
alias vs-build='cd /path/to/baseapp4 && npm run build'
alias vs-deploy='cd /path/to/baseapp4 && ./deploy-vercel.sh'
```

---

## Support

If scripts fail or you need help:

1. Check this guide
2. Review error messages
3. Check documentation:
   - README.md
   - DEPLOYMENT_GUIDE.md
   - FARCASTER_GUIDE.md
4. Open GitHub issue
5. Ask in Discord/Telegram

---

## Summary

**For first-time users**: Run `./setup.sh` and follow prompts

**For quick deploy**: Run `./deploy-vercel.sh`

**For development**: Run `npm run dev`

**For production build**: Run `npm run build`

All scripts are designed to be user-friendly with colored output, progress indicators, and helpful error messages.

Happy deploying! 🚀
