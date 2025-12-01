# Deploy from iPhone using Google Cloud Shell

This guide shows you how to deploy and test the AI Clothing Recommender using **only your iPhone** and Google Cloud Console.

## What You'll Use

- **Google Cloud Shell**: A free browser-based terminal (works on iPhone Safari/Chrome)
- **Google Cloud Run**: Serverless hosting (free tier available)
- Your iPhone browser

## Prerequisites

1. A Google Cloud account ([Sign up free](https://cloud.google.com/free))
2. Your API keys:
   - Anthropic API key from [console.anthropic.com](https://console.anthropic.com/)
   - SerpAPI key from [serpapi.com](https://serpapi.com/)

## Step-by-Step Deployment (From iPhone)

### Step 1: Open Google Cloud Console

1. On your iPhone, open Safari or Chrome
2. Go to: **https://console.cloud.google.com**
3. Sign in with your Google account

### Step 2: Create or Select a Project

1. At the top of the page, click the project dropdown
2. Click "**NEW PROJECT**"
3. Name it: `clothing-recommender` (or any name you like)
4. Click "**CREATE**"
5. Wait a few seconds, then select your new project

### Step 3: Activate Cloud Shell

1. Look for the **terminal icon** at the top-right of the console (looks like: `>_`)
2. Tap it to open **Cloud Shell**
3. A terminal will appear at the bottom of your screen
4. Wait for it to say: `yourname@cloudshell:~$`

**Pro Tip for iPhone**: You can tap the "Open in new window" button to get a full-screen terminal that's easier to use on mobile!

### Step 4: Clone Your Repository

In Cloud Shell, run these commands:

```bash
# Clone your repo
git clone https://github.com/chamaya00/my-ai-website.git

# Go into the directory
cd my-ai-website

# Check the files are there
ls
```

You should see: `backend`, `frontend`, `README.md`, etc.

### Step 5: Set Your API Keys

Run these commands, **replacing with your actual keys**:

```bash
# Set Anthropic API key (replace sk-ant-xxx with your real key)
export ANTHROPIC_API_KEY="sk-ant-your-key-here"

# Set SerpAPI key (replace with your real key)
export SERPAPI_KEY="your-serpapi-key-here"

# Verify they're set (should show your keys)
echo $ANTHROPIC_API_KEY
echo $SERPAPI_KEY
```

**Important**: Keep this Cloud Shell window open! If you close it, you'll need to set the keys again.

### Step 6: Set Your GCP Project

```bash
# Replace PROJECT_ID with your actual project ID
gcloud config set project YOUR_PROJECT_ID

# To find your project ID, you can run:
gcloud projects list
```

### Step 7: Run the Deployment Script

This single command will deploy everything:

```bash
# Make the script executable
chmod +x deploy-to-gcp.sh

# Run the deployment
./deploy-to-gcp.sh
```

**What happens now:**
1. Enables required Google Cloud APIs (~30 seconds)
2. Builds and deploys the backend (~3-5 minutes)
3. Builds and deploys the frontend (~3-5 minutes)
4. Configures everything automatically

**Total time: ~8-10 minutes**

While it's running, you'll see lots of output. Don't worry - just let it finish!

### Step 8: Get Your App URL

When deployment finishes, you'll see:

```
✅ Deployment Complete!
🌐 Your app is live at:
https://clothing-recommender-frontend-xxxxx.run.app
```

**Copy that URL!** This is your live app.

### Step 9: Test on Your iPhone

1. **Copy the frontend URL** from the terminal
2. Open **Safari** on your iPhone (or any browser)
3. **Paste the URL** and go to it
4. You should see: **"AI Clothing Finder"**
5. **Test it:**
   - Tap "Upload" or drag a clothing photo from your Photos
   - Wait for AI analysis
   - Tap "Find Similar Items"
   - See the results!

## Quick Commands Reference

### View Your Deployed Apps

```bash
# List all your Cloud Run services
gcloud run services list
```

### Get the URLs Again

```bash
# Get backend URL
gcloud run services describe clothing-recommender-backend --region us-central1 --format 'value(status.url)'

# Get frontend URL
gcloud run services describe clothing-recommender-frontend --region us-central1 --format 'value(status.url)'
```

### View Logs (For Debugging)

```bash
# Backend logs
gcloud run logs read clothing-recommender-backend --region us-central1 --limit 50

# Frontend logs
gcloud run logs read clothing-recommender-frontend --region us-central1 --limit 50
```

### Redeploy After Changes

If you make code changes:

```bash
cd ~/my-ai-website
git pull  # Get latest changes

# Set API keys again
export ANTHROPIC_API_KEY="your-key"
export SERPAPI_KEY="your-key"

# Redeploy
./deploy-to-gcp.sh
```

### Delete Everything (To Save Costs)

```bash
# Delete both services
gcloud run services delete clothing-recommender-backend --region us-central1
gcloud run services delete clothing-recommender-frontend --region us-central1
```

## Troubleshooting

### "Permission denied" Error

```bash
# Enable billing for your project
# Go to: console.cloud.google.com/billing
# Link a billing account (free tier available)
```

### "API not enabled" Error

The script should enable APIs automatically, but if it fails:

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### Deployment Takes Forever

- First deployment is slower (~10 min) - subsequent ones are faster
- Cloud Shell might timeout - just run the script again, it will continue

### Can't Find Project ID

```bash
gcloud projects list
```

Look for the "PROJECT_ID" column.

### Cloud Shell Disconnected

If you lose connection:
1. Refresh the page
2. Cloud Shell will reconnect
3. Run `cd ~/my-ai-website` to get back to your folder
4. Re-export your API keys if needed

### App Shows "Failed to analyze"

Check backend logs:
```bash
gcloud run logs read clothing-recommender-backend --region us-central1 --limit 20
```

Common issues:
- API keys not set correctly
- Anthropic API quota exceeded
- Image too large (max 10MB)

## Cost Information

### Free Tier Includes:
- **Cloud Run**: 2 million requests/month FREE
- **Cloud Build**: 120 build-minutes/day FREE
- **Anthropic**: $5 credit (~250-500 image analyses)
- **SerpAPI**: 100 searches/month FREE

### Typical Usage:
- Each test: ~$0.01-0.02
- 100 tests: ~$1-2
- Well within free tiers for personal use!

### Monitor Costs:
Go to: console.cloud.google.com/billing

## Tips for iPhone Users

### Better Cloud Shell Experience:
1. Tap the "Pop out" button for full-screen terminal
2. Rotate to landscape for more space
3. Use external keyboard if available

### Copy/Paste on iPhone:
- **Tap and hold** in terminal to paste
- **Triple-tap** to select whole lines
- Use the **Cloud Shell clipboard** button (top-right)

### Save Your App URL:
- **Add to Home Screen** in Safari for quick access
- **Bookmark it** so you don't lose it

## Next Steps

Now that your app is live:

1. **Share the URL** with friends to test
2. **Upload different clothing photos** to test accuracy
3. **Check the logs** to see how it's working
4. **Customize the UI** (edit files in Cloud Shell Editor)

## Using Cloud Shell Editor (Bonus)

Want to edit code from your iPhone?

1. In Cloud Shell, click the **pencil icon** (top-right)
2. A VS Code-like editor opens in your browser
3. Navigate to your files: `my-ai-website/`
4. Edit and save
5. Redeploy with `./deploy-to-gcp.sh`

## Questions?

- Check logs: `gcloud run logs read SERVICE_NAME --region us-central1`
- View services: `gcloud run services list`
- Delete and start over: `gcloud run services delete SERVICE_NAME --region us-central1`

Happy deploying! 🚀📱
