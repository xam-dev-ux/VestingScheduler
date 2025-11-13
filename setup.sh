#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis
CHECK="✅"
CROSS="❌"
ROCKET="🚀"
GEAR="⚙️"
LOCK="🔒"
MONEY="💰"
LINK="🔗"

clear

echo -e "${PURPLE}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   __     __        _   _                                      ║
║   \ \   / /__ ___ | |_(_)_ __   __ _                         ║
║    \ \ / / _ \ __|  _| | '_ \ / _` |                        ║
║     \ V /  __\__ \ |_| | | | | (_| |                        ║
║      \_/ \___|___/\__|_|_| |_|\__, |                        ║
║                                |___/                          ║
║                                                                ║
║            Scheduler Setup Assistant                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}Welcome to the Vesting Scheduler Setup Assistant!${NC}"
echo -e "${CYAN}This script will guide you through the entire setup process.${NC}\n"

# Function to pause and wait for user
pause() {
    echo -e "\n${YELLOW}Press ENTER to continue...${NC}"
    read -r
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate Ethereum address
validate_address() {
    if [[ $1 =~ ^0x[a-fA-F0-9]{40}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Step 1: Check Prerequisites
echo -e "${BLUE}${GEAR} Step 1: Checking Prerequisites${NC}"
echo "================================================"

if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}${CHECK} Node.js found: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}${CROSS} Node.js not found!${NC}"
    echo "Please install Node.js v18+ from https://nodejs.org"
    exit 1
fi

if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}${CHECK} npm found: v${NPM_VERSION}${NC}"
else
    echo -e "${RED}${CROSS} npm not found!${NC}"
    exit 1
fi

if command_exists git; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}${CHECK} ${GIT_VERSION}${NC}"
else
    echo -e "${YELLOW}⚠️  Git not found (optional, needed for Vercel)${NC}"
fi

pause

# Step 2: Install Dependencies
echo -e "\n${BLUE}${GEAR} Step 2: Installing Dependencies${NC}"
echo "================================================"

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}node_modules already exists.${NC}"
    echo -e "Do you want to reinstall? (y/n)"
    read -r reinstall
    if [ "$reinstall" = "y" ]; then
        rm -rf node_modules package-lock.json
        npm install
    else
        echo -e "${GREEN}${CHECK} Skipping installation${NC}"
    fi
else
    echo -e "${CYAN}Installing npm packages...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}${CHECK} Dependencies installed successfully!${NC}"
    else
        echo -e "${RED}${CROSS} Installation failed!${NC}"
        exit 1
    fi
fi

pause

# Step 3: Configure Environment Variables
echo -e "\n${BLUE}${GEAR} Step 3: Configure Environment Variables${NC}"
echo "================================================"

if [ -f ".env" ]; then
    echo -e "${YELLOW}.env file already exists.${NC}"
    echo -e "Do you want to reconfigure it? (y/n)"
    read -r reconfig
    if [ "$reconfig" != "y" ]; then
        echo -e "${GREEN}${CHECK} Using existing .env${NC}"
        source .env
        ENV_CONFIGURED=true
    fi
fi

if [ "$ENV_CONFIGURED" != "true" ]; then
    echo -e "${CYAN}Let's configure your environment variables...${NC}\n"

    # OnchainKit API Key
    echo -e "${PURPLE}${LINK} 1. OnchainKit API Key${NC}"
    echo "   Get it from: https://portal.cdp.coinbase.com/"
    echo "   (Create account → New Project → Copy API Key)"
    echo ""
    echo -n "Enter your OnchainKit API Key: "
    read -r ONCHAINKIT_API_KEY

    while [ -z "$ONCHAINKIT_API_KEY" ]; do
        echo -e "${RED}API Key cannot be empty!${NC}"
        echo -n "Enter your OnchainKit API Key: "
        read -r ONCHAINKIT_API_KEY
    done
    echo -e "${GREEN}${CHECK} OnchainKit API Key saved${NC}\n"

    # Private Key
    echo -e "${PURPLE}${LOCK} 2. Wallet Private Key (for deployment)${NC}"
    echo "   ${RED}WARNING: Keep this SECRET! Never share it!${NC}"
    echo "   Get it from MetaMask or Coinbase Wallet:"
    echo "   MetaMask: Settings → Security & Privacy → Reveal Private Key"
    echo "   Must start with 0x and have 66 characters"
    echo ""
    echo -n "Enter your Private Key (or press ENTER to skip for now): "
    read -rs PRIVATE_KEY
    echo ""

    if [ -n "$PRIVATE_KEY" ]; then
        if [[ $PRIVATE_KEY =~ ^0x[a-fA-F0-9]{64}$ ]]; then
            echo -e "${GREEN}${CHECK} Private Key format valid${NC}\n"
        else
            echo -e "${YELLOW}⚠️  Private Key format seems invalid, but saving anyway${NC}\n"
        fi
    else
        echo -e "${YELLOW}⚠️  Skipped - You'll need this for deployment${NC}\n"
    fi

    # Basescan API Key
    echo -e "${PURPLE}${LINK} 3. Basescan API Key (optional, for verification)${NC}"
    echo "   Get it from: https://basescan.org/myapikey"
    echo "   (Create account → API Keys → Create new key)"
    echo ""
    echo -n "Enter your Basescan API Key (or press ENTER to skip): "
    read -r BASESCAN_API_KEY

    if [ -n "$BASESCAN_API_KEY" ]; then
        echo -e "${GREEN}${CHECK} Basescan API Key saved${NC}\n"
    else
        echo -e "${YELLOW}⚠️  Skipped - Contract verification will be manual${NC}\n"
    fi

    # Base RPC URL
    echo -e "${PURPLE}${LINK} 4. Base RPC URL${NC}"
    echo "   Default: https://mainnet.base.org (public RPC)"
    echo "   Or use your own from: https://www.alchemy.com or https://infura.io"
    echo ""
    echo -n "Enter Base RPC URL (or press ENTER for default): "
    read -r BASE_RPC_URL

    if [ -z "$BASE_RPC_URL" ]; then
        BASE_RPC_URL="https://mainnet.base.org"
    fi
    echo -e "${GREEN}${CHECK} Base RPC URL: ${BASE_RPC_URL}${NC}\n"

    # Create .env file
    cat > .env << EOF
# Base Network Configuration
NEXT_PUBLIC_BASE_RPC_URL=${BASE_RPC_URL}
NEXT_PUBLIC_CHAIN_ID=8453

# OnchainKit API Key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=${ONCHAINKIT_API_KEY}

# Deployment Keys (KEEP THESE SECRET!)
PRIVATE_KEY=${PRIVATE_KEY}
BASESCAN_API_KEY=${BASESCAN_API_KEY}

# Contract Address (will be filled after deployment)
NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=

# App Configuration
NEXT_PUBLIC_APP_NAME=Vesting Scheduler
NEXT_PUBLIC_APP_DESCRIPTION=Token vesting platform on Base Network
EOF

    echo -e "${GREEN}${CHECK} .env file created successfully!${NC}"
fi

pause

# Step 4: Compile Smart Contract
echo -e "\n${BLUE}${GEAR} Step 4: Compile Smart Contract${NC}"
echo "================================================"

echo -e "${CYAN}Compiling VestingScheduler.sol...${NC}"
npm run compile

if [ $? -eq 0 ]; then
    echo -e "${GREEN}${CHECK} Smart contract compiled successfully!${NC}"
    if [ -f "artifacts/contracts/VestingScheduler.sol/VestingScheduler.json" ]; then
        CONTRACT_SIZE=$(wc -l < contracts/VestingScheduler.sol)
        echo -e "${GREEN}${CHECK} Contract size: ${CONTRACT_SIZE} lines${NC}"
    fi
else
    echo -e "${RED}${CROSS} Compilation failed!${NC}"
    echo "Please check the contract for errors."
    exit 1
fi

pause

# Step 5: Deploy to Base (optional)
echo -e "\n${BLUE}${ROCKET} Step 5: Deploy to Base Mainnet${NC}"
echo "================================================"

if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${YELLOW}⚠️  No private key configured. Skipping deployment.${NC}"
    echo "You can deploy later by running: npm run deploy"
else
    echo -e "${YELLOW}${MONEY} Deployment will cost ~0.01 ETH in gas fees${NC}"
    echo "Make sure you have ETH on Base mainnet in your wallet!"
    echo ""
    echo "Do you want to deploy now? (y/n)"
    read -r deploy_now

    if [ "$deploy_now" = "y" ]; then
        echo -e "\n${CYAN}Deploying to Base mainnet...${NC}"
        npm run deploy

        if [ $? -eq 0 ]; then
            echo -e "\n${GREEN}${CHECK} Contract deployed successfully!${NC}"
            echo ""
            echo "Please copy the contract address from above and paste it here:"
            echo -n "Contract Address: "
            read -r CONTRACT_ADDRESS

            if validate_address "$CONTRACT_ADDRESS"; then
                # Update .env with contract address
                if grep -q "NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=" .env; then
                    sed -i.bak "s|NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=.*|NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}|" .env
                    rm -f .env.bak
                else
                    echo "NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}" >> .env
                fi
                echo -e "${GREEN}${CHECK} Contract address saved to .env${NC}"
            else
                echo -e "${RED}${CROSS} Invalid address format!${NC}"
                echo "Please manually add it to .env later"
            fi
        else
            echo -e "${RED}${CROSS} Deployment failed!${NC}"
            echo "Check the error messages above."
        fi
    else
        echo -e "${YELLOW}Skipped deployment. You can deploy later with: npm run deploy${NC}"
    fi
fi

pause

# Step 6: Create Farcaster Configuration
echo -e "\n${BLUE}${GEAR} Step 6: Create Farcaster Configuration${NC}"
echo "================================================"

echo -e "${CYAN}Creating farcaster.json for mini app...${NC}\n"

# Get contract address from .env
source .env
FARCASTER_CONTRACT_ADDRESS=${NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS:-"YOUR_CONTRACT_ADDRESS"}

cat > farcaster.json << EOF
{
  "accountAssociation": {
    "header": "eyJmaWQiOjEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgxMjM0NTY3ODkwYWJjZGVmIn0",
    "payload": "eyJkb21haW4iOiJ2ZXN0aW5nLXNjaGVkdWxlci52ZXJjZWwuYXBwIn0",
    "signature": "MHhhYmNkZWYxMjM0NTY3ODkw"
  },
  "frame": {
    "version": "next",
    "imageUrl": "https://vesting-scheduler.vercel.app/og-image.png",
    "button": {
      "title": "Open Vesting Scheduler",
      "action": {
        "type": "launch_frame",
        "name": "Vesting Scheduler",
        "url": "https://vesting-scheduler.vercel.app",
        "splashImageUrl": "https://vesting-scheduler.vercel.app/splash.png",
        "splashBackgroundColor": "#3b82f6"
      }
    }
  },
  "miniApp": {
    "name": "Vesting Scheduler",
    "description": "Create and manage token vesting schedules on Base Network",
    "icon": "https://vesting-scheduler.vercel.app/icon.png",
    "homeUrl": "https://vesting-scheduler.vercel.app",
    "manifestUrl": "https://vesting-scheduler.vercel.app/farcaster.json",
    "version": "1.0.0",
    "screenshots": [
      "https://vesting-scheduler.vercel.app/screenshot-1.png",
      "https://vesting-scheduler.vercel.app/screenshot-2.png"
    ],
    "categories": ["defi", "tools"],
    "chain": {
      "id": 8453,
      "name": "Base",
      "contractAddress": "${FARCASTER_CONTRACT_ADDRESS}"
    }
  },
  "metadata": {
    "title": "Vesting Scheduler",
    "description": "Create customizable token vesting schedules on Base Network with individual or batch creation",
    "image": "https://vesting-scheduler.vercel.app/og-image.png",
    "url": "https://vesting-scheduler.vercel.app"
  }
}
EOF

echo -e "${GREEN}${CHECK} farcaster.json created!${NC}"
echo -e "${YELLOW}Note: Update URLs after deploying to Vercel${NC}"

pause

# Step 7: Test Locally
echo -e "\n${BLUE}${ROCKET} Step 7: Test Application Locally${NC}"
echo "================================================"

echo "Do you want to start the development server now? (y/n)"
read -r start_dev

if [ "$start_dev" = "y" ]; then
    echo -e "\n${CYAN}Starting development server...${NC}"
    echo -e "${YELLOW}The app will open at: ${BLUE}http://localhost:3000${NC}\n"
    echo -e "${PURPLE}Press Ctrl+C to stop the server when done testing${NC}\n"

    pause

    npm run dev
else
    echo -e "${YELLOW}Skipped. Start later with: npm run dev${NC}"
fi

# Step 8: Deploy to Vercel
echo -e "\n${BLUE}${ROCKET} Step 8: Deploy to Vercel${NC}"
echo "================================================"

if ! command_exists git; then
    echo -e "${RED}${CROSS} Git is required for Vercel deployment${NC}"
    echo "Please install Git first: https://git-scm.com/downloads"
    SKIP_VERCEL=true
fi

if [ "$SKIP_VERCEL" != "true" ]; then
    echo -e "${CYAN}Preparing for Vercel deployment...${NC}\n"

    # Check if this is a git repo
    if [ ! -d ".git" ]; then
        echo "This is not a git repository yet."
        echo "Initialize git repository? (y/n)"
        read -r init_git

        if [ "$init_git" = "y" ]; then
            git init
            echo -e "${GREEN}${CHECK} Git repository initialized${NC}"

            # Create .gitignore if not exists
            if [ ! -f ".gitignore" ]; then
                echo "Creating .gitignore..."
                cat > .gitignore << 'EOF'
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# hardhat
cache
artifacts
typechain-types
EOF
            fi

            # Initial commit
            git add .
            git commit -m "Initial commit: Vesting Scheduler"
            echo -e "${GREEN}${CHECK} Initial commit created${NC}"
        fi
    fi

    echo -e "\n${PURPLE}Vercel Deployment Options:${NC}\n"
    echo "1. Deploy via Vercel CLI (requires Vercel account)"
    echo "2. Deploy via GitHub (push to GitHub + import to Vercel)"
    echo "3. Skip Vercel deployment for now"
    echo ""
    echo -n "Choose option (1/2/3): "
    read -r vercel_option

    case $vercel_option in
        1)
            if ! command_exists vercel; then
                echo -e "\n${YELLOW}Vercel CLI not found. Installing...${NC}"
                npm i -g vercel
            fi

            echo -e "\n${CYAN}Deploying to Vercel...${NC}"
            echo -e "${YELLOW}You'll need to login to your Vercel account${NC}\n"

            vercel --prod

            echo -e "\n${GREEN}${CHECK} Deployed to Vercel!${NC}"
            echo -e "${YELLOW}Don't forget to add environment variables in Vercel dashboard:${NC}"
            echo "  - NEXT_PUBLIC_ONCHAINKIT_API_KEY"
            echo "  - NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS"
            echo "  - NEXT_PUBLIC_BASE_RPC_URL"
            echo "  - NEXT_PUBLIC_CHAIN_ID"
            ;;
        2)
            echo -e "\n${CYAN}GitHub Deployment Steps:${NC}"
            echo ""
            echo "1. Create a new repository on GitHub"
            echo "2. Run these commands:"
            echo "   ${BLUE}git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git${NC}"
            echo "   ${BLUE}git branch -M main${NC}"
            echo "   ${BLUE}git push -u origin main${NC}"
            echo ""
            echo "3. Go to https://vercel.com"
            echo "4. Click 'Import Project'"
            echo "5. Select your GitHub repository"
            echo "6. Add environment variables:"
            echo "   - NEXT_PUBLIC_ONCHAINKIT_API_KEY"
            echo "   - NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS"
            echo "   - NEXT_PUBLIC_BASE_RPC_URL"
            echo "   - NEXT_PUBLIC_CHAIN_ID"
            echo "7. Click 'Deploy'"
            echo ""
            echo -e "${YELLOW}After deployment, update farcaster.json with your Vercel URL${NC}"
            ;;
        3)
            echo -e "${YELLOW}Skipped Vercel deployment${NC}"
            ;;
    esac
fi

# Final Summary
echo -e "\n\n"
echo -e "${GREEN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║                    SETUP COMPLETE! 🎉                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}Setup Summary:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check what was completed
[ -f ".env" ] && echo -e "${GREEN}${CHECK} Environment configured (.env)${NC}" || echo -e "${RED}${CROSS} Environment not configured${NC}"
[ -d "node_modules" ] && echo -e "${GREEN}${CHECK} Dependencies installed${NC}" || echo -e "${RED}${CROSS} Dependencies not installed${NC}"
[ -f "artifacts/contracts/VestingScheduler.sol/VestingScheduler.json" ] && echo -e "${GREEN}${CHECK} Contract compiled${NC}" || echo -e "${RED}${CROSS} Contract not compiled${NC}"
[ -n "$CONTRACT_ADDRESS" ] && echo -e "${GREEN}${CHECK} Contract deployed: ${CONTRACT_ADDRESS}${NC}" || echo -e "${YELLOW}⚠️  Contract not deployed yet${NC}"
[ -f "farcaster.json" ] && echo -e "${GREEN}${CHECK} Farcaster config created${NC}" || echo -e "${RED}${CROSS} Farcaster config not created${NC}"

echo ""
echo -e "${CYAN}Next Steps:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo -e "1. ${YELLOW}Deploy contract: ${BLUE}npm run deploy${NC}"
    echo -e "2. ${YELLOW}Update .env with contract address${NC}"
    echo -e "3. ${YELLOW}Test locally: ${BLUE}npm run dev${NC}"
    echo -e "4. ${YELLOW}Deploy to Vercel${NC}"
else
    echo -e "1. ${YELLOW}Test locally: ${BLUE}npm run dev${NC}"
    echo -e "2. ${YELLOW}Deploy to Vercel (see instructions above)${NC}"
    echo -e "3. ${YELLOW}Update farcaster.json with your Vercel URL${NC}"
fi

echo -e "4. ${YELLOW}Add OG images and screenshots for Farcaster${NC}"
echo ""

echo -e "${PURPLE}Useful Commands:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  ${BLUE}npm run dev${NC}      - Start development server"
echo -e "  ${BLUE}npm run build${NC}    - Build for production"
echo -e "  ${BLUE}npm run deploy${NC}   - Deploy contract to Base"
echo -e "  ${BLUE}npm run compile${NC}  - Compile smart contracts"
echo ""

echo -e "${PURPLE}Documentation:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  ${BLUE}README.md${NC}              - Main documentation"
echo -e "  ${BLUE}QUICKSTART.md${NC}          - Quick start guide"
echo -e "  ${BLUE}DEPLOYMENT_GUIDE.md${NC}    - Deployment instructions"
echo -e "  ${BLUE}NEW_UI_SUMMARY.md${NC}      - UI features overview"
echo -e "  ${BLUE}UI_FEATURES.md${NC}         - Detailed UI documentation"
echo ""

echo -e "${GREEN}Thank you for using Vesting Scheduler! 🚀${NC}"
echo -e "${CYAN}For support, check the documentation or open an issue on GitHub.${NC}"
echo ""
