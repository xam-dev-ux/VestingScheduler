# Farcaster Mini App Integration Guide

This guide explains how to configure and deploy your Vesting Scheduler as a Farcaster Mini App.

## What is a Farcaster Mini App?

Farcaster Mini Apps are lightweight applications that run within the Farcaster ecosystem, allowing users to interact with your dApp directly from their Farcaster client.

## Prerequisites

Before starting, ensure you have:

- [x] Deployed your contract to Base mainnet
- [x] Deployed your frontend to Vercel
- [x] Created required images (OG image, icon, screenshots)
- [x] Verified your contract on Basescan

## Step 1: Prepare Required Images

Create and optimize these images:

### 1. OG Image (Open Graph)
- **File**: `public/og-image.png`
- **Size**: 1200x630px
- **Purpose**: Social media previews
- **Content**: App logo, title, and tagline

### 2. App Icon
- **File**: `public/icon.png`
- **Size**: 512x512px
- **Purpose**: App launcher icon
- **Content**: Your app logo/brand

### 3. Splash Screen
- **File**: `public/splash.png`
- **Size**: 1200x1200px
- **Purpose**: Loading screen
- **Content**: App logo with background color #3b82f6

### 4. Screenshots (3 required)
- **Files**: `public/screenshot-1.png`, `screenshot-2.png`, `screenshot-3.png`
- **Size**: 1920x1080px (landscape) or 1080x1920px (portrait)
- **Purpose**: App store listing
- **Content**:
  - Screenshot 1: Main interface with hero section
  - Screenshot 2: Dashboard with vesting cards
  - Screenshot 3: Batch upload interface

### Image Creation Tips

```bash
# Using ImageMagick to create placeholder images
convert -size 1200x630 xc:#3b82f6 -pointsize 72 -fill white -gravity center \
  -annotate +0+0 'Vesting\nScheduler' public/og-image.png

convert -size 512x512 xc:#3b82f6 -pointsize 100 -fill white -gravity center \
  -annotate +0+0 'V' public/icon.png

convert -size 1200x1200 xc:#3b82f6 -pointsize 150 -fill white -gravity center \
  -annotate +0+0 'V' public/splash.png
```

Or use tools like:
- Figma (https://figma.com)
- Canva (https://canva.com)
- Photoshop
- GIMP (free)

## Step 2: Configure farcaster.json

The `public/farcaster.json` file is already created. Update it with your actual values:

### Update URLs

Replace all instances of `your-app.vercel.app` with your actual Vercel URL:

```json
{
  "frame": {
    "imageUrl": "https://YOUR-APP.vercel.app/og-image.png",
    "button": {
      "action": {
        "url": "https://YOUR-APP.vercel.app",
        "splashImageUrl": "https://YOUR-APP.vercel.app/splash.png"
      }
    }
  },
  "miniApp": {
    "icon": "https://YOUR-APP.vercel.app/icon.png",
    "homeUrl": "https://YOUR-APP.vercel.app",
    "manifestUrl": "https://YOUR-APP.vercel.app/farcaster.json",
    "screenshots": [
      "https://YOUR-APP.vercel.app/screenshot-1.png",
      "https://YOUR-APP.vercel.app/screenshot-2.png",
      "https://YOUR-APP.vercel.app/screenshot-3.png"
    ]
  }
}
```

### Update Contract Address

Replace `YOUR_CONTRACT_ADDRESS_HERE` with your deployed contract address:

```json
{
  "miniApp": {
    "chain": {
      "id": 8453,
      "name": "Base",
      "network": "mainnet",
      "contractAddress": "0xYOUR_ACTUAL_CONTRACT_ADDRESS"
    }
  }
}
```

### Quick Update Script

```bash
# Replace placeholders in farcaster.json
VERCEL_URL="your-app.vercel.app"
CONTRACT_ADDRESS="0xYourContractAddress"

sed -i.bak "s|your-app.vercel.app|${VERCEL_URL}|g" public/farcaster.json
sed -i.bak "s|YOUR_CONTRACT_ADDRESS_HERE|${CONTRACT_ADDRESS}|g" public/farcaster.json

rm public/farcaster.json.bak
echo "✓ farcaster.json updated!"
```

## Step 3: Validate Your Configuration

### Test Locally

```bash
# Start dev server
npm run dev

# Visit in browser
open http://localhost:3000/farcaster.json

# Should return valid JSON without errors
```

### Validate JSON

```bash
# Using jq (install: brew install jq)
cat public/farcaster.json | jq .

# Should output formatted JSON without errors
```

### Check Image Accessibility

```bash
# All these should return 200 OK
curl -I https://your-app.vercel.app/og-image.png
curl -I https://your-app.vercel.app/icon.png
curl -I https://your-app.vercel.app/splash.png
curl -I https://your-app.vercel.app/screenshot-1.png
```

## Step 4: Deploy to Vercel

### Using the Deploy Script

```bash
./deploy-vercel.sh
```

### Manual Deployment

```bash
# Build locally
npm run build

# Test build
npm start

# Deploy to Vercel
vercel --prod
```

### Verify Deployment

1. Visit your Vercel URL
2. Check `/farcaster.json` endpoint
3. Verify all images load correctly
4. Test the onboarding flow
5. Test creating a vesting

## Step 5: Register with Farcaster

### Option A: Farcaster Developer Portal

1. Go to https://warpcast.com/~/developers
2. Sign in with your Farcaster account
3. Click "Register Mini App"
4. Fill in the form:
   - **Name**: Vesting Scheduler
   - **Manifest URL**: https://your-app.vercel.app/farcaster.json
   - **Description**: Token vesting platform on Base
   - **Category**: DeFi, Tools
5. Submit for review

### Option B: Programmatic Registration

```bash
# Using Farcaster API
curl -X POST https://api.warpcast.com/v2/mini-apps \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "manifestUrl": "https://your-app.vercel.app/farcaster.json"
  }'
```

## Step 6: Account Association

The account association in `farcaster.json` links your app to your Farcaster account.

### Generate Account Association

You need to generate valid account association data:

```typescript
// Example using @farcaster/hub-nodejs
import { makeUserDataAdd } from '@farcaster/hub-nodejs';

const header = {
  fid: YOUR_FID, // Your Farcaster ID
  type: 'custody',
  key: '0x...' // Your custody key
};

const payload = {
  domain: 'your-app.vercel.app'
};

// Sign and generate header, payload, signature
// Update farcaster.json with real values
```

### Get Your Farcaster ID

1. Go to https://warpcast.com/~/settings
2. Find your FID (Farcaster ID)
3. Use it to generate account association

## Step 7: Testing Your Mini App

### Test in Warpcast

1. Open Warpcast mobile app
2. Go to "Apps" section
3. Search for "Vesting Scheduler"
4. Launch the mini app
5. Test all functionality:
   - Onboarding flow
   - Wallet connection
   - Create vesting
   - Batch upload
   - Dashboard
   - Claim tokens

### Test Frames

```bash
# Test frame rendering
curl https://your-app.vercel.app/farcaster.json | jq .frame
```

### Test Deep Links

```bash
# Should open your mini app
open "farcaster://mini-app?url=https://your-app.vercel.app"
```

## Common Issues & Solutions

### Issue: Images Not Loading

**Problem**: 404 errors for images

**Solution**:
```bash
# Ensure images are in public/ directory
ls public/*.png

# Check Vercel deployment includes images
vercel logs

# Rebuild and redeploy
npm run build
vercel --prod
```

### Issue: Invalid farcaster.json

**Problem**: JSON parsing errors

**Solution**:
```bash
# Validate JSON
cat public/farcaster.json | jq .

# Common issues:
# - Trailing commas
# - Missing quotes
# - Invalid URLs
# - Wrong contract address format
```

### Issue: Mini App Not Appearing

**Problem**: Can't find app in Warpcast

**Solution**:
1. Check registration status in developer portal
2. Ensure manifest URL is accessible
3. Wait for approval (can take 24-48 hours)
4. Verify account association is correct

### Issue: Wallet Connection Fails

**Problem**: Can't connect wallet in mini app

**Solution**:
1. Check OnchainKit configuration in `app/providers.tsx`
2. Verify API keys in Vercel environment variables
3. Test wallet connection on regular web version
4. Check browser console for errors

## Best Practices

### Performance

1. **Optimize Images**
   ```bash
   # Using ImageOptim or similar
   imageoptim public/*.png

   # Or use next/image for automatic optimization
   ```

2. **Minimize Bundle Size**
   ```bash
   # Analyze bundle
   npm run build
   # Check .next/static for size
   ```

3. **Enable Caching**
   - Add cache headers in `next.config.js`
   - Use CDN for static assets

### Security

1. **Validate Input**: All user inputs in forms
2. **Rate Limiting**: Prevent abuse
3. **HTTPS Only**: Ensure all URLs use HTTPS
4. **Contract Verification**: Verify on Basescan

### User Experience

1. **Loading States**: Show loading indicators
2. **Error Messages**: Clear, actionable errors
3. **Mobile First**: Optimize for mobile
4. **Onboarding**: Keep it short and clear

## Monitoring & Analytics

### Add Analytics

```typescript
// Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Monitor Usage

- Vercel Analytics: Real-time traffic
- Basescan: Contract interactions
- Farcaster Analytics: Mini app installs

## Maintenance

### Regular Updates

1. **Update Dependencies**
   ```bash
   npm update
   npm audit fix
   ```

2. **Monitor Contract**
   - Check for unusual activity
   - Monitor fee accumulation
   - Track total vestings created

3. **Update Documentation**
   - Keep README current
   - Update screenshots
   - Add new features to farcaster.json

### Handling Issues

1. **Bug Reports**: Use GitHub Issues
2. **User Support**: Discord/Telegram channel
3. **Contract Updates**: Deploy new version, update manifest

## Resources

### Documentation

- Farcaster Docs: https://docs.farcaster.xyz
- Base Docs: https://docs.base.org
- OnchainKit: https://onchainkit.xyz
- Vercel Docs: https://vercel.com/docs

### Tools

- Farcaster Hub: https://github.com/farcasterxyz/hub-monorepo
- Warpcast: https://warpcast.com
- Base Explorer: https://basescan.org

### Community

- Farcaster Discord: https://discord.gg/farcaster
- Base Discord: https://discord.gg/buildonbase
- /base channel on Warpcast

## Checklist

Before going live:

- [ ] Contract deployed to Base mainnet
- [ ] Contract verified on Basescan
- [ ] Frontend deployed to Vercel
- [ ] All images created and uploaded
- [ ] farcaster.json updated with correct URLs
- [ ] farcaster.json updated with contract address
- [ ] All images accessible (test URLs)
- [ ] Manifest validates without errors
- [ ] Onboarding flow tested
- [ ] Wallet connection tested
- [ ] Create vesting tested
- [ ] Batch upload tested
- [ ] Dashboard tested
- [ ] Claim functionality tested
- [ ] Mobile experience tested
- [ ] Registered with Farcaster
- [ ] Account association configured
- [ ] Analytics enabled
- [ ] Documentation updated

## Next Steps

After deployment:

1. **Promote Your App**
   - Cast about your app on Farcaster
   - Share in relevant channels
   - Write a launch post

2. **Gather Feedback**
   - Monitor user comments
   - Track analytics
   - Fix bugs quickly

3. **Iterate**
   - Add requested features
   - Improve UX based on feedback
   - Update regularly

## Support

Need help?

- Check documentation in this repo
- Open issue on GitHub
- Ask in Base Discord
- Post in /base on Warpcast

---

**Good luck with your Farcaster Mini App! 🚀**
