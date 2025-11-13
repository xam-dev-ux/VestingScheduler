# Vesting Scheduler - Feature Overview

## Core Features

### 1. Smart Contract (VestingScheduler.sol)

**Lines of Code**: 400+ lines

**Key Capabilities**:
- ✅ Create individual vesting schedules
- ✅ Batch creation of multiple vestings
- ✅ Linear vesting with cliff periods
- ✅ Configurable fee system (basis points)
- ✅ Revocable vestings option
- ✅ Claim vested tokens
- ✅ Emergency pause functionality
- ✅ Fee withdrawal mechanism
- ✅ Complete event logging

**Security Features**:
- OpenZeppelin contracts (Ownable, ReentrancyGuard, Pausable)
- SafeERC20 for secure token transfers
- Input validation on all functions
- Protection against reentrancy attacks
- Emergency pause for critical situations

**Contract Functions**:
```solidity
// Creation
createVesting(beneficiary, token, amount, startTime, cliff, duration, revocable)
createBatchVesting(arrays...)

// Management
claim(vestingId)
revokeVesting(vestingId)

// Queries
getVestingDetails(vestingId)
getClaimableAmount(vestingId)
getBeneficiaryVestings(address)
getCreatorVestings(address)

// Admin
setFeePercentage(basisPoints)
setFeeCollector(address)
withdrawFees(token)
pause() / unpause()
```

### 2. Individual Vesting Creation

**User Interface**:
- Clean, intuitive form interface
- Real-time validation
- Token decimal configuration
- Date/time picker for start time
- Days-to-seconds automatic conversion
- Revocable checkbox option
- Success/error feedback

**Parameters**:
- Beneficiary address
- ERC20 token address
- Amount with configurable decimals
- Optional start time (default: immediate)
- Cliff duration (in days)
- Total duration (in days)
- Revocable flag

**Workflow**:
1. User fills form with vesting parameters
2. Clicks "Create Vesting"
3. Wallet prompts for token approval (first time)
4. Confirms vesting creation transaction
5. Platform fee deducted automatically
6. Vesting schedule created on-chain
7. Dashboard updates with new vesting

### 3. Batch Vesting Upload

**CSV Upload**:
- Drag-and-drop or file selection
- Real-time parsing and validation
- Preview before submission
- Detailed error reporting
- Template download feature

**CSV Format**:
```csv
beneficiary,token,amount,startTime,cliffDuration,duration,revocable
0x...,0x...,1000000000,0,2592000,31536000,true
```

**Features**:
- ✅ Upload unlimited vestings in one file
- ✅ Validate all entries before submission
- ✅ Show preview with total amounts
- ✅ Single transaction for entire batch
- ✅ Gas optimization for bulk operations
- ✅ Detailed validation messages

**Validation**:
- Address format verification
- Amount positivity check
- Duration minimum (1 day)
- Cliff ≤ duration validation
- Start time not in past
- Boolean format for revocable

### 4. Vesting Dashboard

**Views**:
- As Beneficiary: See vestings where you receive tokens
- As Creator: See vestings you created

**Vesting Card Display**:
- Vesting ID and token address
- Total amount and claimed amount
- Claimable amount (real-time)
- Progress bar visualization
- Start, cliff, and end dates
- Revocable/revoked status
- Action buttons (Claim/Revoke)

**Features**:
- ✅ Real-time claimable calculation
- ✅ Visual progress indicators
- ✅ Filterable by role (beneficiary/creator)
- ✅ Detailed date information
- ✅ One-click claim functionality
- ✅ Revoke with confirmation
- ✅ Responsive grid layout

### 5. Fee System

**Configurable Fees**:
- Basis points system (100 = 1%)
- Default: 250 basis points (2.5%)
- Maximum: 1000 basis points (10%)
- Owner-only configuration

**Fee Collection**:
- Automatic deduction on vesting creation
- Accumulated per token
- Owner can withdraw anytime
- Separate fee collector address
- Transparent fee display in UI

**Fee Transparency**:
- Displayed on homepage
- Shown before transaction
- Calculated automatically
- Per-token tracking

### 6. Token Management

**Supported Tokens**:
- Any ERC20 token on Base
- Automatic decimal handling
- Popular tokens pre-configured:
  - USDC: 6 decimals
  - WETH: 18 decimals
  - DAI: 18 decimals

**Token Operations**:
- Approval workflow
- Safe transfer mechanisms
- Claimable amount calculation
- Multi-token support per user

### 7. Wallet Integration

**Coinbase Smart Wallet**:
- OnchainKit integration
- One-click connect
- Smart wallet features
- Gas sponsorship support
- Seamless UX

**Wallet Features**:
- Display address and balance
- Network verification
- Transaction history
- Disconnect option
- Avatar and name display

## Technical Architecture

### Frontend Stack
```
Next.js 14 (App Router)
├── TypeScript
├── TailwindCSS
├── OnchainKit
├── Wagmi v2
├── Viem
└── RainbowKit
```

### Smart Contract Stack
```
Solidity 0.8.20
├── OpenZeppelin Contracts
├── Hardhat
├── TypeChain
└── Hardhat Verify
```

### Key Libraries
- **papaparse**: CSV parsing
- **date-fns**: Date formatting
- **wagmi**: Ethereum hooks
- **viem**: TypeScript Ethereum library

## User Flows

### Flow 1: Create Single Vesting
```
1. Connect Wallet
2. Fill Vesting Form
3. Approve Token (if first time)
4. Confirm Transaction
5. View in Dashboard
```

### Flow 2: Batch Create
```
1. Connect Wallet
2. Download CSV Template
3. Fill CSV with Vestings
4. Upload CSV File
5. Review Preview
6. Approve Tokens
7. Confirm Batch Transaction
8. View All in Dashboard
```

### Flow 3: Claim Tokens
```
1. Connect as Beneficiary
2. View Dashboard
3. Find Claimable Vesting
4. Click Claim
5. Confirm Transaction
6. Receive Tokens
```

### Flow 4: Revoke Vesting
```
1. Connect as Creator
2. View Created Vestings
3. Find Revocable Vesting
4. Click Revoke
5. Confirm Action
6. Beneficiary Gets Vested Amount
7. Creator Gets Remaining
```

## Advanced Features

### 1. Cliff Periods
- No tokens claimable during cliff
- Full cliff amount unlocks at cliff end
- Linear vesting continues after cliff

### 2. Linear Vesting
- Tokens unlock proportionally over time
- Per-second calculation
- Claim anytime after cliff
- No vesting schedule limits

### 3. Revocable Vestings
- Creator can cancel
- Vested amount goes to beneficiary
- Unvested returns to creator
- Cannot revoke non-revocable vestings

### 4. Gas Optimization
- Batch operations save gas
- Efficient storage patterns
- Minimal on-chain data
- Single transaction for batch

### 5. Event Logging
All actions emit events:
- VestingCreated
- BatchVestingCreated
- TokensClaimed
- VestingRevoked
- FeePercentageUpdated
- FeeCollectorUpdated
- FeesWithdrawn

## Mobile Responsive

- ✅ Mobile-first design
- ✅ Touch-friendly UI
- ✅ Responsive grid layouts
- ✅ Mobile wallet support
- ✅ Optimized for small screens

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast support

## Performance

- Server-side rendering (SSR)
- Optimized bundle size
- Lazy loading components
- Efficient re-renders
- Cached RPC calls

## Future Enhancements

Potential features for v2:
- [ ] Multiple token support per vesting
- [ ] Non-linear vesting curves
- [ ] Milestone-based vesting
- [ ] Delegation of claim rights
- [ ] Vesting NFTs
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Multi-chain support
- [ ] DAO governance for fees

## Use Cases

### 1. Team Token Distribution
Distribute tokens to team members with cliff and vesting schedules.

### 2. Investor Allocations
Create vesting schedules for investors with customizable parameters.

### 3. Employee Compensation
Set up employee token compensation with standard vesting terms.

### 4. Contributor Rewards
Reward contributors with vested tokens over time.

### 5. Partnership Agreements
Implement partnership token distributions with milestones.

### 6. Grant Programs
Distribute grants with vesting conditions.

## Benefits

### For Creators
- ✅ Easy batch creation
- ✅ Configurable parameters
- ✅ Revoke option for flexibility
- ✅ Track all vestings
- ✅ Transparent fee structure

### For Beneficiaries
- ✅ Claim anytime
- ✅ Real-time tracking
- ✅ Transparent vesting schedule
- ✅ On-chain guarantees
- ✅ No trust required

### For Platform
- ✅ Automated fee collection
- ✅ Configurable fee structure
- ✅ Multi-token support
- ✅ Emergency controls
- ✅ Transparent operations

## Integration Capabilities

The platform can integrate with:
- DAOs (governance tokens)
- ICO/IDO platforms
- Payroll systems
- Grant management tools
- Token launch platforms
- Multi-sigs (for creators)

## Compliance Ready

Features that support compliance:
- Complete on-chain records
- Event logs for auditing
- Transparent fee structure
- Revocable options for compliance
- Time-based restrictions
- Address whitelisting (via creators)
