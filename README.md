# AI Clothing Recommender

An intelligent web app that helps you find similar clothing items online. Upload a photo of clothing you love, and our AI will analyze it and search for similar items across online retailers.

## Features

- **AI Vision Analysis**: Uses Claude AI to analyze clothing items and extract features like type, color, style, pattern, and material
- **Smart Search**: Automatically searches Google Shopping for similar items based on AI analysis
- **Beautiful UI**: Modern, responsive interface built with Next.js and Tailwind CSS
- **Fast Results**: Parallel processing and caching for quick results

## Architecture

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Python FastAPI with async support
- **AI**: Anthropic Claude 3.5 Sonnet (Vision)
- **Search**: SerpAPI (Google Shopping)

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- SerpAPI key ([Get one here](https://serpapi.com/))

## Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd my-ai-website
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your API keys:
# ANTHROPIC_API_KEY=your_key_here
# SERPAPI_KEY=your_key_here

# Run the backend
python main.py
```

The backend will start on `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Usage

1. Open `http://localhost:3000` in your browser
2. Upload a photo of a clothing item you like
3. Wait for AI analysis (a few seconds)
4. Click "Find Similar Items"
5. Browse the curated results from online retailers

## Project Structure

```
my-ai-website/
├── frontend/                 # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main page with state management
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── ImageUpload.tsx  # Drag-and-drop image upload
│   │   ├── ClothingAnalysis.tsx  # AI analysis display
│   │   └── SearchResults.tsx     # Results grid
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                  # FastAPI backend
│   ├── main.py              # Main API application
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # API keys (create from .env.example)
│
└── README.md                # This file
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

### Frontend Development

```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
```

### Backend Development

```bash
cd backend
source venv/bin/activate
python main.py   # Start dev server with auto-reload

# Or use uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Troubleshooting

### CORS Errors
Make sure the backend is running on port 8000 and the frontend on port 3000. The CORS middleware is configured for these ports.

### API Key Errors
- Check that your `.env` file exists in the `backend/` directory
- Verify that API keys are correct and have no extra spaces
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
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Backend Framework**: FastAPI
- **AI Model**: Claude 3.5 Sonnet
- **Search API**: SerpAPI (Google Shopping)
- **Language**: TypeScript (frontend), Python 3.9+ (backend)

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
