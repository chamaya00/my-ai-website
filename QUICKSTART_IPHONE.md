# iPhone Quick Start (5 Minutes)

The fastest way to get your AI Clothing Recommender running from your iPhone.

## Before You Start

Get these ready:
- ✅ Anthropic API key: [console.anthropic.com](https://console.anthropic.com/)
- ✅ SerpAPI key: [serpapi.com](https://serpapi.com/)

## 1. Open Cloud Shell

On iPhone Safari/Chrome:
1. Go to **console.cloud.google.com**
2. Create/select a project
3. Click the **terminal icon** (`>_`) at top-right
4. Tap **"Open in new window"** for full screen

## 2. Clone & Deploy

Copy/paste these commands **one at a time**:

```bash
# Clone the repo
git clone https://github.com/chamaya00/my-ai-website.git
cd my-ai-website
```

```bash
# Set your API keys (REPLACE WITH YOUR REAL KEYS!)
export ANTHROPIC_API_KEY="sk-ant-YOUR-KEY-HERE"
export SERPAPI_KEY="YOUR-SERPAPI-KEY-HERE"
```

```bash
# Set your GCP project (find PROJECT_ID with: gcloud projects list)
gcloud config set project YOUR_PROJECT_ID
```

```bash
# Deploy everything (takes ~8 minutes)
chmod +x deploy-to-gcp.sh
./deploy-to-gcp.sh
```

## 3. Open Your App

When it finishes, copy the URL that looks like:
```
https://clothing-recommender-frontend-xxxxx.run.app
```

**Open that URL in Safari** → Upload a clothing photo → Test it! 🎉

## That's It!

Your AI clothing finder is now live and accessible from any device.

---

**Need help?** See [DEPLOY_FROM_IPHONE.md](DEPLOY_FROM_IPHONE.md) for detailed instructions.

**To delete:**
```bash
gcloud run services delete clothing-recommender-backend --region us-central1
gcloud run services delete clothing-recommender-frontend --region us-central1
```
