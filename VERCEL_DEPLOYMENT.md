# Vercel Deployment Guide

This guide will help you deploy your AI Clothing Finder application to Vercel with Next.js serverless functions.

## ✅ What Changed?

The FastAPI Python backend has been converted to Next.js API Routes (TypeScript serverless functions):

- ✅ `backend/main.py` → `frontend/app/api/analyze/route.ts` + `frontend/app/api/search/route.ts`
- ✅ Python dependencies → Node.js packages (`@anthropic-ai/sdk`, `serpapi`)
- ✅ Frontend API calls updated to use relative paths (`/api/*` instead of `http://localhost:8000/api/*`)
- ✅ Environment variables configured for Vercel

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Anthropic API Key** - Get from [console.anthropic.com](https://console.anthropic.com/)
3. **SerpAPI Key** - Get from [serpapi.com](https://serpapi.com/)
4. **GitHub Repository** - Your code should be in a GitHub repo

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Convert backend to Next.js API routes for Vercel"
   git push
   ```

2. **Import your project to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Choose the repository: `my-ai-website`

3. **Configure the project:**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Add Environment Variables:**
   In the "Environment Variables" section, add:

   | Name | Value |
   |------|-------|
   | `ANTHROPIC_API_KEY` | Your Anthropic API key |
   | `SERPAPI_KEY` | Your SerpAPI key |

   Make sure to add them for **Production**, **Preview**, and **Development** environments.

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Navigate to frontend directory:**
   ```bash
   cd /home/user/my-ai-website/frontend
   ```

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Add environment variables:**
   ```bash
   vercel env add ANTHROPIC_API_KEY production
   # Paste your API key when prompted

   vercel env add SERPAPI_KEY production
   # Paste your API key when prompted
   ```

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Local Development

To test the Next.js API routes locally:

1. **Navigate to frontend directory:**
   ```bash
   cd /home/user/my-ai-website/frontend
   ```

2. **Create `.env.local` file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Add your API keys to `.env.local`:**
   ```env
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   SERPAPI_KEY=your_serpapi_key
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

The following environment variables are required:

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `ANTHROPIC_API_KEY` | Claude API key for image analysis | [console.anthropic.com](https://console.anthropic.com/) |
| `SERPAPI_KEY` | SerpAPI key for Google Shopping search | [serpapi.com](https://serpapi.com/) |

## Project Structure

```
my-ai-website/
├── frontend/
│   ├── app/
│   │   ├── api/                    # ✨ NEW: Next.js API Routes
│   │   │   ├── analyze/
│   │   │   │   └── route.ts        # Claude Vision API endpoint
│   │   │   └── search/
│   │   │       └── route.ts        # SerpAPI endpoint
│   │   ├── layout.tsx
│   │   └── page.tsx                # ✏️ Updated: Uses /api/* instead of localhost:8000
│   ├── components/
│   ├── .env.example                # ✏️ Updated: API keys instead of API_URL
│   ├── .env.local                  # 🔒 Add this (gitignored)
│   ├── next.config.js
│   ├── package.json                # ✏️ Updated: Added @anthropic-ai/sdk, serpapi
│   ├── vercel.json                 # ✨ NEW: Vercel configuration
│   └── ...
└── backend/                        # ⚠️ DEPRECATED: No longer needed
    └── main.py                      # Can be deleted after migration
```

## Vercel Configuration

The `vercel.json` file configures serverless function settings:

```json
{
  "functions": {
    "app/api/analyze/route.ts": {
      "memory": 2048,        // 2GB RAM for Claude API calls
      "maxDuration": 60      // 60 seconds timeout (max on free tier)
    },
    "app/api/search/route.ts": {
      "memory": 1024,        // 1GB RAM for SerpAPI calls
      "maxDuration": 30      // 30 seconds timeout
    }
  }
}
```

## Troubleshooting

### Build Fails

**Error:** `Module not found: @anthropic-ai/sdk`
- **Solution:** Make sure `package.json` includes the dependencies. Run `npm install` locally first.

**Error:** `ANTHROPIC_API_KEY not configured`
- **Solution:** Add environment variables in Vercel dashboard under Settings → Environment Variables

### API Errors

**Error:** `ANTHROPIC_API_KEY not configured`
- **Solution:** Verify environment variables are set in Vercel dashboard
- Go to your project → Settings → Environment Variables
- Make sure the variables are added to the correct environment (Production/Preview/Development)
- Redeploy if you just added them

**Error:** `Failed to analyze image`
- **Solution:** Check your Anthropic API key is valid and has credits
- Verify you're on the correct Claude API tier (see VERCEL_COST_ANALYSIS.md)

**Error:** `SERPAPI_KEY not configured`
- **Solution:** Add SerpAPI key in Vercel environment variables
- Verify your SerpAPI account has available searches

### Function Timeout

**Error:** `FUNCTION_INVOCATION_TIMEOUT`
- **Solution:** Claude API calls can take 5-10 seconds
- Free tier allows up to 60 seconds timeout (configured in vercel.json)
- If still timing out, check your Anthropic API status

### Large Response Payload

**Error:** `FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE`
- **Solution:** Response exceeds 4.5MB limit
- This shouldn't happen with our use case (JSON responses are small)
- If it does, consider using streaming responses

## Monitoring & Limits

### Vercel Dashboard

Monitor your usage at [vercel.com/dashboard](https://vercel.com/dashboard):

1. **Functions** - View invocation count, duration, errors
2. **Bandwidth** - Track data transfer
3. **Analytics** - See visitor metrics
4. **Logs** - Debug errors in real-time

### Usage Alerts

Set up alerts to avoid hitting limits:

1. Go to Project Settings → Usage
2. Configure email alerts at 80% of your plan limits

### Stay Within Limits

Refer to `VERCEL_COST_ANALYSIS.md` for detailed limit analysis:

- **Vercel Hobby Plan:** ~22,500 sessions/month
- **Claude Free Tier:** ~1,750 sessions/month (bottleneck!)
- **Claude Tier 1:** ~17,500 sessions/month

**Recommendation:** Start with Claude Tier 1 ($100/month) + Vercel Hobby (free)

## Updating Your Deployment

### Via Git Push (Automatic)

Vercel automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push
```

Vercel will automatically build and deploy your changes.

### Via Vercel CLI

```bash
cd frontend
vercel --prod
```

## Custom Domain (Optional)

1. Go to your project → Settings → Domains
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Wait for SSL certificate provisioning (~1 minute)

## Rolling Back

If something breaks:

1. Go to Vercel Dashboard → Deployments
2. Find a previous working deployment
3. Click the three dots → "Promote to Production"

## Support & Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js API Routes:** [nextjs.org/docs/app/building-your-application/routing/route-handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- **Anthropic API Docs:** [docs.anthropic.com](https://docs.anthropic.com/)
- **SerpAPI Docs:** [serpapi.com/docs](https://serpapi.com/docs)

## Next Steps

1. ✅ Deploy to Vercel
2. 📊 Monitor usage in Vercel and Anthropic dashboards
3. 💰 Upgrade Claude API tier if needed (see cost analysis)
4. 🚀 Add custom domain (optional)
5. 🔒 Implement rate limiting to prevent abuse
6. 💾 Add caching to reduce API costs

---

**Need help?** Check `VERCEL_COST_ANALYSIS.md` for detailed cost and limit information.
