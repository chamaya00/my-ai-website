# AI Clothing Recommender

An intelligent web app that helps you find similar clothing items online. Upload a photo of clothing you love, and our AI will analyze it and search for similar items across online retailers.

## 🚀 Quick Start Options

### Deploy to Vercel (Recommended - Easiest!)
**Serverless, zero-config deployment.** The entire app (frontend + backend) runs on Vercel.

🚀 **[Vercel Deployment Guide →](VERCEL_DEPLOYMENT.md)** (2 minutes)
📊 **[Cost Analysis →](VERCEL_COST_ANALYSIS.md)** (Plan limits & pricing)

### Deploy from iPhone (Alternative - Google Cloud)
**No laptop needed!** Deploy directly from Google Cloud Shell on your iPhone.

📱 **[iPhone Quick Start Guide →](QUICKSTART_IPHONE.md)** (5 minutes)
📱 **[Detailed iPhone Deployment Guide →](DEPLOY_FROM_IPHONE.md)** (Complete instructions)

### Run Locally (For Development)
See the [Local Development Setup](#quick-start) section below.

## Features

- **AI Vision Analysis**: Uses Claude AI to analyze clothing items and extract features like type, color, style, pattern, and material
- **Smart Search**: Automatically searches Google Shopping for similar items based on AI analysis
- **Beautiful UI**: Modern, responsive interface built with Next.js and Tailwind CSS
- **Fast Results**: Parallel processing and caching for quick results
- **Mobile Friendly**: Works perfectly on iPhone and all mobile devices

## Architecture

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (TypeScript serverless functions)
- **AI**: Anthropic Claude 3.5 Sonnet (Vision)
- **Search**: SerpAPI (Google Shopping)
- **Deployment**: Vercel (recommended) or Google Cloud Run

> **Note:** The backend has been converted from Python FastAPI to Next.js API Routes for seamless Vercel deployment. The Python backend in `/backend` is deprecated but kept for reference.

## Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- SerpAPI key ([Get one here](https://serpapi.com/))

## Quick Start (Local Development)

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd my-ai-website/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
SERPAPI_KEY=your_serpapi_key
```

### 4. Run Development Server

```bash
npm run dev
```

The app will start on `http://localhost:3000`

### 5. Usage

1. Open `http://localhost:3000` in your browser
2. Upload a photo of a clothing item you like
3. Wait for AI analysis (a few seconds)
4. Click "Find Similar Items"
5. Browse the curated results from online retailers

## Project Structure

```
my-ai-website/
├── frontend/                      # Next.js app (frontend + backend)
│   ├── app/
│   │   ├── api/                   # 🆕 Next.js API Routes (serverless functions)
│   │   │   ├── analyze/
│   │   │   │   └── route.ts      # Claude Vision API endpoint
│   │   │   └── search/
│   │   │       └── route.ts      # SerpAPI endpoint
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Main page with state management
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ImageUpload.tsx       # Drag-and-drop image upload
│   │   ├── ClothingAnalysis.tsx  # AI analysis display
│   │   └── SearchResults.tsx     # Results grid
│   ├── .env.example              # Environment variables template
│   ├── .env.local                # Local env vars (create this, gitignored)
│   ├── vercel.json               # 🆕 Vercel deployment config
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                       # ⚠️ DEPRECATED - Python FastAPI (legacy)
│   ├── main.py                   # Old Python backend (kept for reference)
│   └── requirements.txt
│
├── VERCEL_DEPLOYMENT.md          # 🆕 Vercel deployment guide
├── VERCEL_COST_ANALYSIS.md       # 🆕 Cost analysis & plan limits
└── README.md                      # This file
```

## API Endpoints

### POST /api/analyze
Analyze a clothing image using AI vision.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "features": {
    "type": "t-shirt",
    "color": ["blue", "white"],
    "style": ["casual", "modern"],
    "pattern": "solid",
    "material": "cotton",
    "brand": "Nike",
    "description": "A casual blue t-shirt with a modern fit"
  }
}
```

### POST /api/search
Search for similar items based on clothing features.

**Request:**
```json
{
  "features": {
    "type": "t-shirt",
    "color": ["blue"],
    "style": ["casual"],
    "pattern": "solid",
    "material": "cotton",
    "description": "A casual blue t-shirt"
  }
}
```

**Response:**
```json
{
  "results": [
    {
      "title": "Classic Blue T-Shirt",
      "price": "$29.99",
      "link": "https://...",
      "image": "https://...",
      "source": "Amazon",
      "snippet": "100% cotton blue t-shirt"
    }
  ]
}
```

## API Keys Setup

### Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Add to `backend/.env` as `ANTHROPIC_API_KEY`

### SerpAPI Key

1. Go to [SerpAPI](https://serpapi.com/)
2. Sign up for a free account (100 searches/month free)
3. Find your API key in the dashboard
4. Add to `backend/.env` as `SERPAPI_KEY`

## Development

All development happens in the `frontend/` directory:

```bash
cd frontend

npm run dev      # Start dev server (port 3000)
npm run build    # Build for production
npm run start    # Start production server locally
npm run lint     # Run linter
```

The Next.js dev server includes:
- Hot module replacement (HMR) for instant updates
- API routes running serverlessly at `/api/*`
- TypeScript type checking
- Tailwind CSS compilation

## Troubleshooting

### API Key Errors
- Check that your `.env.local` file exists in the `frontend/` directory
- Verify that API keys are correct and have no extra spaces
- Ensure variable names match: `ANTHROPIC_API_KEY` and `SERPAPI_KEY`
- Restart dev server after changing environment variables
- Ensure you have credits/quota remaining on both APIs

### Image Upload Issues
- Supported formats: JPG, PNG, GIF, WebP
- Max file size: 10MB
- Make sure the image clearly shows the clothing item

### No Search Results
- Try a different photo with clearer clothing
- Check that SerpAPI key is valid and has remaining quota
- Some clothing types may have limited results

## Future Enhancements

- [ ] Add user authentication and saved wardrobe
- [ ] Implement vector similarity search with CLIP
- [ ] Support multiple clothing items in one image
- [ ] Add price range filters
- [ ] Implement favorite/save functionality
- [ ] Add more shopping sources (individual retailer APIs)
- [ ] Mobile app version
- [ ] Style preference learning over time

## Tech Stack Details

- **Frontend Framework**: Next.js 14 (App Router)
- **Backend**: Next.js API Routes (Serverless Functions)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **AI SDK**: @anthropic-ai/sdk (Official Anthropic SDK)
- **AI Model**: Claude 3.5 Sonnet (Vision)
- **Search SDK**: serpapi (Node.js)
- **Search API**: SerpAPI (Google Shopping)
- **Language**: TypeScript (full-stack)
- **Deployment**: Vercel (recommended) or Google Cloud Run

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
