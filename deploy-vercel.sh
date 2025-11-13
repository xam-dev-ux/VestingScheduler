#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo -e "${PURPLE}"
cat << "EOF"
╔════════════════════════════════════════════════════╗
║                                                    ║
║       Vercel Deployment Assistant                 ║
║       Vesting Scheduler                           ║
║                                                    ║
╚════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}This script will guide you through deploying to Vercel${NC}\n"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Git repository not initialized.${NC}"
    echo "Initialize now? (y/n)"
    read -r init_git

    if [ "$init_git" = "y" ]; then
        git init
        echo -e "${GREEN}✓ Git initialized${NC}"

        git add .
        git commit -m "Initial commit: Vesting Scheduler"
        echo -e "${GREEN}✓ Initial commit created${NC}\n"
    else
        echo -e "${RED}Git is required for Vercel deployment${NC}"
        exit 1
    fi
fi

echo -e "${CYAN}Choose deployment method:${NC}\n"
echo "1. Vercel CLI (recommended - fastest)"
echo "2. GitHub + Vercel Dashboard"
echo "3. Cancel"
echo ""
read -p "Enter option (1/2/3): " deploy_method

case $deploy_method in
    1)
        echo -e "\n${CYAN}Deploying via Vercel CLI...${NC}\n"

        # Check if vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
            npm i -g vercel
        fi

        # Source .env to get variables
        if [ -f ".env" ]; then
            source .env
        fi

        echo -e "${CYAN}Logging in to Vercel...${NC}"
        vercel login

        echo -e "\n${CYAN}Deploying to production...${NC}\n"

        # Deploy with environment variables
        vercel --prod \
            -e NEXT_PUBLIC_BASE_RPC_URL="${NEXT_PUBLIC_BASE_RPC_URL:-https://mainnet.base.org}" \
            -e NEXT_PUBLIC_CHAIN_ID=8453 \
            -e NEXT_PUBLIC_ONCHAINKIT_API_KEY="${NEXT_PUBLIC_ONCHAINKIT_API_KEY}" \
            -e NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS="${NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS}"

        if [ $? -eq 0 ]; then
            echo -e "\n${GREEN}✓ Deployment successful!${NC}\n"

            echo -e "${YELLOW}Post-deployment steps:${NC}"
            echo "1. Copy your Vercel URL from above"
            echo "2. Update public/farcaster.json with your URL"
            echo "3. Add OG images to public/ directory"
            echo "4. Redeploy if needed: vercel --prod"

        else
            echo -e "\n${RED}✗ Deployment failed${NC}"
            exit 1
        fi
        ;;

    2)
        echo -e "\n${CYAN}Deploying via GitHub + Vercel Dashboard...${NC}\n"

        echo "Step 1: Create GitHub Repository"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "1. Go to https://github.com/new"
        echo "2. Create a new repository"
        echo "3. Copy the repository URL"
        echo ""
        read -p "Enter your GitHub repository URL: " repo_url

        if [ -n "$repo_url" ]; then
            echo -e "\n${CYAN}Adding remote and pushing...${NC}"
            git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"
            git branch -M main
            git push -u origin main

            echo -e "${GREEN}✓ Code pushed to GitHub${NC}\n"
        fi

        echo "Step 2: Import to Vercel"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "1. Go to https://vercel.com/new"
        echo "2. Click 'Import Git Repository'"
        echo "3. Select your repository"
        echo "4. Configure project:"
        echo "   - Framework Preset: Next.js"
        echo "   - Build Command: npm run build"
        echo "   - Output Directory: .next"
        echo ""
        echo "5. Add Environment Variables:"

        if [ -f ".env" ]; then
            source .env
            echo ""
            echo "   Copy these values:"
            echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "   NEXT_PUBLIC_BASE_RPC_URL"
            echo "   Value: ${NEXT_PUBLIC_BASE_RPC_URL:-https://mainnet.base.org}"
            echo ""
            echo "   NEXT_PUBLIC_CHAIN_ID"
            echo "   Value: 8453"
            echo ""
            echo "   NEXT_PUBLIC_ONCHAINKIT_API_KEY"
            echo "   Value: ${NEXT_PUBLIC_ONCHAINKIT_API_KEY}"
            echo ""
            echo "   NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS"
            echo "   Value: ${NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS}"
            echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        fi

        echo ""
        echo "6. Click 'Deploy'"
        echo ""
        echo -e "${YELLOW}Press ENTER when deployment is complete...${NC}"
        read -r

        echo -e "\n${GREEN}✓ Deployment process initiated${NC}"
        ;;

    3)
        echo -e "${YELLOW}Deployment cancelled${NC}"
        exit 0
        ;;

    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

# Post-deployment instructions
echo -e "\n${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Post-Deployment Checklist:${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
echo "1. Update Farcaster Configuration"
echo "   - Edit public/farcaster.json"
echo "   - Replace all 'your-app.vercel.app' with your actual URL"
echo "   - Update contract address"
echo ""

echo "2. Add Images (Required for Farcaster)"
echo "   Create and add these files to public/ directory:"
echo "   - og-image.png (1200x630px) - Open Graph image"
echo "   - icon.png (512x512px) - App icon"
echo "   - splash.png (1200x1200px) - Splash screen"
echo "   - screenshot-1.png (1920x1080px) - Main interface"
echo "   - screenshot-2.png (1920x1080px) - Dashboard view"
echo "   - screenshot-3.png (1920x1080px) - Batch upload"
echo ""

echo "3. Test Your Deployment"
echo "   - Visit your Vercel URL"
echo "   - Test wallet connection"
echo "   - Test onboarding flow"
echo "   - Test creating a vesting"
echo ""

echo "4. Configure Custom Domain (Optional)"
echo "   - Go to Vercel Dashboard → Settings → Domains"
echo "   - Add your custom domain"
echo "   - Update DNS records"
echo "   - Update farcaster.json with new domain"
echo ""

echo "5. Register with Farcaster"
echo "   - Go to Farcaster developer portal"
echo "   - Submit your farcaster.json URL"
echo "   - Wait for approval"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Deployment Complete! 🎉${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${CYAN}Need to redeploy?${NC}"
echo "Run: vercel --prod"
echo ""

echo -e "${CYAN}Need help?${NC}"
echo "Check: DEPLOYMENT_GUIDE.md"
echo ""
