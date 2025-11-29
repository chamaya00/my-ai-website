# Setup Guide - AI Clothing Recommender

This guide will walk you through setting up the AI Clothing Recommender from scratch.

## Step-by-Step Setup

### Step 1: Get Your API Keys

#### Anthropic API Key (for AI Vision)

1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in with your account
3. Click on "API Keys" in the left sidebar
4. Click "Create Key"
5. Give it a name like "Clothing Recommender"
6. Copy the API key (it starts with `sk-ant-`)
7. Save it somewhere safe - you'll need it soon!

**Note**: New accounts get $5 in free credits. Each image analysis costs about $0.01-0.02.

#### SerpAPI Key (for Shopping Search)

1. Visit [https://serpapi.com/](https://serpapi.com/)
2. Click "Register" and create a free account
3. After logging in, you'll see your API key on the dashboard
4. Copy the API key
5. Save it - you'll need it in the next step!

**Note**: Free accounts get 100 searches per month, which is perfect for testing.

### Step 2: Backend Setup

Open your terminal and navigate to the backend directory:

```bash
cd backend
```

#### Create a Python Virtual Environment

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

#### Install Python Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI (web framework)
- Anthropic (Claude AI client)
- SerpAPI (Google Shopping client)
- And other dependencies

#### Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in your text editor:
   ```bash
   # On macOS/Linux
   nano .env

   # Or use your favorite editor
   code .env  # VS Code
   vim .env   # Vim
   ```

3. Replace the placeholder values with your actual API keys:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
   SERPAPI_KEY=your-serpapi-key-here
   ```

4. Save and close the file

#### Start the Backend Server

```bash
python main.py
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Leave this terminal running and open a new one for the frontend.

### Step 3: Frontend Setup

In a **new terminal window**, navigate to the frontend directory:

```bash
cd frontend
```

#### Install Node.js Dependencies

```bash
npm install
```

This will install:
- Next.js
- React
- Tailwind CSS
- Axios (for API calls)
- Lucide React (for icons)

This may take a few minutes.

#### Start the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.2.18
- Local:        http://localhost:3000
```

### Step 4: Test the Application

1. Open your browser and go to: **http://localhost:3000**

2. You should see the AI Clothing Finder interface

3. **Test with a sample image:**
   - Find any clothing photo on your computer (or search Google for "blue t-shirt" and save an image)
   - Drag and drop it into the upload area, or click to browse
   - Wait a few seconds for the AI analysis
   - Click "Find Similar Items"
   - Browse the results!

## Verification Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Both API keys configured in `.env`
- [ ] Image upload works
- [ ] AI analysis completes successfully
- [ ] Search results appear

## Common Issues and Solutions

### Issue: "ANTHROPIC_API_KEY not configured"

**Solution**:
- Make sure you created the `.env` file in the `backend/` directory
- Check that the API key is correct (starts with `sk-ant-`)
- Restart the backend server after adding the key

### Issue: "SERPAPI_KEY not configured"

**Solution**:
- Make sure you added the SerpAPI key to `.env`
- Verify the key is correct (copy it from serpapi.com dashboard)
- Restart the backend server

### Issue: Backend won't start - "Address already in use"

**Solution**:
Port 8000 is already in use. Kill the process:

**On macOS/Linux:**
```bash
lsof -ti:8000 | xargs kill -9
```

**On Windows:**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

Then restart the backend.

### Issue: Frontend shows "Failed to analyze image"

**Solution**:
- Check that the backend is running (you should see it in the other terminal)
- Make sure the backend is on port 8000
- Check browser console (F12) for detailed error messages
- Verify your Anthropic API key has available credits

### Issue: "No results found" when searching

**Possible causes**:
- Your SerpAPI free quota might be exhausted (check serpapi.com dashboard)
- The clothing item might be too specific
- Try with a more common clothing item (like "blue t-shirt")

### Issue: CORS errors in browser console

**Solution**:
- Make sure frontend is on port 3000 and backend on port 8000
- Restart both servers
- Clear browser cache

## Testing Tips

### Good Test Images:
- Clear, well-lit photos
- Single clothing item visible
- Common items (t-shirts, jeans, dresses work best)
- Stock photos from clothing websites work great

### Images to Avoid:
- Multiple clothing items in one photo
- Blurry or dark photos
- Very niche or custom items
- Photos where clothing is not the main focus

## Development Workflow

1. **Making Changes to Frontend:**
   - Edit files in `frontend/`
   - Changes auto-reload in browser
   - Check browser console for errors (F12)

2. **Making Changes to Backend:**
   - Edit `backend/main.py`
   - Server auto-reloads
   - Check terminal for errors

3. **Debugging:**
   - Backend: Check the terminal running `python main.py`
   - Frontend: Check browser console (F12)
   - Network tab (F12) shows API calls

## Next Steps

Once everything is working:

1. **Experiment with different images** - Try various clothing types
2. **Customize the UI** - Edit Tailwind classes in the React components
3. **Adjust search parameters** - Modify the search query building in `backend/main.py`
4. **Add features** - Check the README for enhancement ideas

## Getting Help

If you're stuck:

1. Check the error messages carefully
2. Verify all prerequisites are installed (Node.js, Python, etc.)
3. Make sure both servers are running
4. Check that API keys are valid and have available credits
5. Look at the browser console and backend terminal for specific errors

## API Usage and Costs

- **Anthropic**: ~$0.01-0.02 per image analysis (you get $5 free)
- **SerpAPI**: 100 free searches/month

With free tiers:
- ~250-500 image analyses
- 100 shopping searches
- Perfect for testing and personal use!

Enjoy building with AI!
