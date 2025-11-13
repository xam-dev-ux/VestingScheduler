#!/bin/bash

echo "================================================"
echo "  Vesting Scheduler - Installation Script"
echo "================================================"
echo ""

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js v18+"
    exit 1
fi

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm found: $NPM_VERSION"
else
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo ""
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please edit .env with your keys"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "Compiling smart contracts..."
npm run compile

if [ $? -eq 0 ]; then
    echo "✅ Contracts compiled successfully"
else
    echo "❌ Failed to compile contracts"
    exit 1
fi

echo ""
echo "================================================"
echo "  Installation Complete! 🎉"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your keys"
echo "2. Deploy contract: npm run deploy"
echo "3. Start dev server: npm run dev"
echo ""
echo "Read GETTING_STARTED.md for detailed instructions"
echo ""
