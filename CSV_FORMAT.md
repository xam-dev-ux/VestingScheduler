# CSV Format Guide for Batch Vesting

This guide explains how to format your CSV file for batch vesting creation.

## Required Columns

Your CSV file must include these 7 columns in this exact order:

1. **beneficiary** - Ethereum address of the recipient
2. **token** - ERC20 token contract address
3. **amount** - Amount in smallest unit (wei)
4. **startTime** - Unix timestamp or 0 for immediate start
5. **cliffDuration** - Cliff period in seconds
6. **duration** - Total vesting duration in seconds
7. **revocable** - true or false

## Column Details

### beneficiary
- **Format**: Ethereum address (0x followed by 40 hex characters)
- **Example**: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
- **Notes**: Must be a valid Ethereum address

### token
- **Format**: Ethereum address (0x followed by 40 hex characters)
- **Example**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` (USDC on Base)
- **Notes**: Must be a deployed ERC20 token contract

### amount
- **Format**: Integer in smallest token unit
- **Example**: `1000000000` (1000 USDC with 6 decimals)
- **Notes**:
  - For 18 decimal tokens: multiply by 10^18
  - For 6 decimal tokens (USDC): multiply by 10^6
  - For 8 decimal tokens: multiply by 10^8

### startTime
- **Format**: Unix timestamp (seconds since Jan 1, 1970) or 0
- **Example**: `1704067200` (Jan 1, 2024) or `0` (start now)
- **Notes**:
  - Use `0` to start vesting immediately
  - Use future timestamp to schedule start date
  - Cannot be in the past

### cliffDuration
- **Format**: Integer (seconds)
- **Example**: `2592000` (30 days)
- **Common Values**:
  - 0 = No cliff
  - 86400 = 1 day
  - 2592000 = 30 days
  - 7776000 = 90 days
  - 31536000 = 1 year
- **Notes**: Must be less than or equal to total duration

### duration
- **Format**: Integer (seconds)
- **Example**: `31536000` (1 year)
- **Common Values**:
  - 86400 = 1 day (minimum)
  - 2592000 = 30 days
  - 7776000 = 90 days
  - 15552000 = 180 days (6 months)
  - 31536000 = 365 days (1 year)
  - 63072000 = 730 days (2 years)
  - 94608000 = 1095 days (3 years)
  - 126144000 = 1460 days (4 years)
- **Notes**: Must be at least 86400 (1 day)

### revocable
- **Format**: boolean (true or false)
- **Example**: `true` or `false`
- **Notes**:
  - `true` = Creator can revoke the vesting
  - `false` = Vesting cannot be cancelled

## Example CSV

```csv
beneficiary,token,amount,startTime,cliffDuration,duration,revocable
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,1000000000,0,2592000,31536000,true
0x1234567890123456789012345678901234567890,0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,5000000000,1704067200,0,15552000,false
0x9876543210987654321098765432109876543210,0x4200000000000000000000000000000000000006,1000000000000000000,1735689600,7776000,31536000,true
```

## Explanation of Example

**Row 1:**
- Beneficiary: 0x742d...
- Token: USDC (6 decimals)
- Amount: 1,000 USDC (1,000,000,000 / 10^6)
- Start: Immediately (0)
- Cliff: 30 days
- Duration: 1 year
- Revocable: Yes

**Row 2:**
- Beneficiary: 0x1234...
- Token: USDC
- Amount: 5,000 USDC
- Start: Jan 1, 2024 (specific date)
- Cliff: None (0)
- Duration: 6 months
- Revocable: No

**Row 3:**
- Beneficiary: 0x9876...
- Token: WETH (18 decimals)
- Amount: 1 ETH (1 * 10^18)
- Start: Jan 1, 2025
- Cliff: 90 days
- Duration: 1 year
- Revocable: Yes

## Time Conversion Reference

### Days to Seconds
```
1 day = 86,400 seconds
7 days = 604,800 seconds
30 days = 2,592,000 seconds
90 days = 7,776,000 seconds
180 days = 15,552,000 seconds
365 days = 31,536,000 seconds
730 days = 63,072,000 seconds
1095 days = 94,608,000 seconds
```

### Decimal Conversion

**For 18 decimal tokens (ETH, WETH, DAI):**
- 1 token = 1000000000000000000
- 0.1 token = 100000000000000000
- 10 tokens = 10000000000000000000

**For 6 decimal tokens (USDC, USDT):**
- 1 token = 1000000
- 0.1 token = 100000
- 10 tokens = 10000000
- 1000 tokens = 1000000000

**For 8 decimal tokens:**
- 1 token = 100000000
- 0.1 token = 10000000
- 10 tokens = 1000000000

## Common Token Addresses on Base

```csv
Token,Address,Decimals
USDC,0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,6
WETH,0x4200000000000000000000000000000000000006,18
DAI,0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb,18
```

## Validation Rules

The CSV parser will validate:
1. All addresses are valid (0x + 40 hex characters)
2. All amounts are positive numbers
3. Duration is at least 86400 (1 day)
4. Cliff duration ≤ total duration
5. Start time is not in the past (if specified)
6. Revocable is true or false

## Common Mistakes

❌ **Wrong decimal places**
```csv
beneficiary,token,amount,startTime,cliffDuration,duration,revocable
0x123...,0xUSDC...,1000,0,0,86400,false
```
✅ **Correct** (for USDC with 6 decimals):
```csv
beneficiary,token,amount,startTime,cliffDuration,duration,revocable
0x123...,0xUSDC...,1000000000,0,0,86400,false
```

❌ **Using days instead of seconds**
```csv
beneficiary,token,amount,startTime,cliffDuration,duration,revocable
0x123...,0xUSDC...,1000000000,0,30,365,false
```
✅ **Correct**:
```csv
beneficiary,token,amount,startTime,cliffDuration,duration,revocable
0x123...,0xUSDC...,1000000000,0,2592000,31536000,false
```

❌ **Invalid address format**
```csv
beneficiary,token,amount,startTime,cliffDuration,duration,revocable
123abc,0xUSDC,1000000000,0,0,86400,false
```
✅ **Correct**:
```csv
beneficiary,token,amount,startTime,cliffDuration,duration,revocable
0x0123456789012345678901234567890123456789,0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913,1000000000,0,0,86400,false
```

## Tips

1. **Download the template** from the app - it includes example data
2. **Test with small amounts** first
3. **Verify all addresses** before uploading
4. **Double-check decimal places** for each token
5. **Use a spreadsheet** (Excel, Google Sheets) to calculate, then export to CSV
6. **Keep a backup** of your CSV file

## Tools for CSV Creation

### Using Google Sheets
1. Create your data in Google Sheets
2. File → Download → Comma Separated Values (.csv)
3. Upload to the app

### Using Excel
1. Create your data in Excel
2. File → Save As → CSV (Comma delimited)
3. Upload to the app

### Using JavaScript/Python
For bulk generation, you can script CSV creation:

```javascript
// JavaScript example
const vestings = [
  {
    beneficiary: '0x...',
    token: '0x...',
    amount: '1000000000',
    startTime: '0',
    cliffDuration: '2592000',
    duration: '31536000',
    revocable: 'true'
  }
];

const csv = [
  'beneficiary,token,amount,startTime,cliffDuration,duration,revocable',
  ...vestings.map(v => `${v.beneficiary},${v.token},${v.amount},${v.startTime},${v.cliffDuration},${v.duration},${v.revocable}`)
].join('\n');

console.log(csv);
```

## Need Help?

- Check the [README](README.md) for more information
- Open an issue on GitHub
- Join the Base Discord for community support
