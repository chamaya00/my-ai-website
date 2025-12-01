from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import anthropic
from serpapi import GoogleSearch
import json
import base64
import re

load_dotenv()

app = FastAPI(title="AI Clothing Recommender API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

if not ANTHROPIC_API_KEY:
    print("WARNING: ANTHROPIC_API_KEY not set in environment variables")

if not SERPAPI_KEY:
    print("WARNING: SERPAPI_KEY not set in environment variables")


class AnalyzeRequest(BaseModel):
    image: str  # Base64 encoded image


class ClothingFeatures(BaseModel):
    type: str
    color: List[str]
    style: List[str]
    pattern: str
    material: str
    brand: Optional[str] = None
    description: str


class AnalyzeResponse(BaseModel):
    features: ClothingFeatures


class SearchRequest(BaseModel):
    features: ClothingFeatures


class SearchResult(BaseModel):
    title: str
    price: str
    link: str
    image: str
    source: str
    snippet: Optional[str] = None


class SearchResponse(BaseModel):
    results: List[SearchResult]


def extract_image_data(image_data: str) -> tuple[str, str]:
    """Extract media type and base64 data from data URL"""
    if image_data.startswith('data:'):
        # Format: data:image/jpeg;base64,/9j/4AAQ...
        match = re.match(r'data:([^;]+);base64,(.+)', image_data)
        if match:
            media_type = match.group(1)
            data = match.group(2)
            return media_type, data

    # If no data URL prefix, assume it's already base64
    return "image/jpeg", image_data


@app.get("/")
def read_root():
    return {
        "message": "AI Clothing Recommender API",
        "endpoints": ["/api/analyze", "/api/search"]
    }


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_image(request: AnalyzeRequest):
    """Analyze clothing image using Claude Vision API"""

    if not ANTHROPIC_API_KEY:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not configured")

    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

        # Extract image data
        media_type, image_data = extract_image_data(request.image)

        # Create the prompt for Claude
        prompt = """Analyze this clothing item in detail. Extract the following information:

1. Type of clothing (e.g., t-shirt, jeans, dress, jacket, etc.)
2. Main colors (list up to 3)
3. Style keywords (e.g., casual, formal, vintage, modern, sporty, etc.)
4. Pattern (e.g., solid, striped, floral, plaid, etc.)
5. Material/fabric (e.g., cotton, denim, leather, silk, etc.)
6. Brand (if visible in the image)
7. A brief description of the item

Return the response in the following JSON format:
{
    "type": "clothing type",
    "color": ["color1", "color2"],
    "style": ["style1", "style2", "style3"],
    "pattern": "pattern description",
    "material": "material type",
    "brand": "brand name or null",
    "description": "Brief description of the clothing item"
}

Only return the JSON, no additional text."""

        # Call Claude API with vision
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": image_data,
                            },
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ],
                }
            ],
        )

        # Extract the response
        response_text = message.content[0].text

        # Parse JSON from response
        # Sometimes Claude wraps JSON in markdown code blocks
        json_match = re.search(r'```(?:json)?\s*(\{.*\})\s*```', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_str = response_text

        features_data = json.loads(json_str)

        # Validate and create ClothingFeatures object
        features = ClothingFeatures(**features_data)

        return AnalyzeResponse(features=features)

    except anthropic.APIError as e:
        raise HTTPException(status_code=500, detail=f"Anthropic API error: {str(e)}")
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")


@app.post("/api/search", response_model=SearchResponse)
async def search_similar_items(request: SearchRequest):
    """Search for similar clothing items using Google Shopping"""

    if not SERPAPI_KEY:
        raise HTTPException(status_code=500, detail="SERPAPI_KEY not configured")

    try:
        features = request.features

        # Build search query from features
        query_parts = [features.type]

        # Add primary color
        if features.color:
            query_parts.append(features.color[0])

        # Add pattern if not solid
        if features.pattern and features.pattern.lower() != "solid":
            query_parts.append(features.pattern)

        # Add a style keyword
        if features.style:
            query_parts.append(features.style[0])

        search_query = " ".join(query_parts)

        # Search using SerpAPI Google Shopping
        params = {
            "engine": "google_shopping",
            "q": search_query,
            "api_key": SERPAPI_KEY,
            "num": 20,  # Get up to 20 results
        }

        search = GoogleSearch(params)
        results_data = search.get_dict()

        # Parse results
        results = []
        shopping_results = results_data.get("shopping_results", [])

        for item in shopping_results[:12]:  # Limit to 12 results
            result = SearchResult(
                title=item.get("title", ""),
                price=item.get("price", "N/A"),
                link=item.get("link", ""),
                image=item.get("thumbnail", ""),
                source=item.get("source", "Unknown"),
                snippet=item.get("snippet", None)
            )
            results.append(result)

        return SearchResponse(results=results)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
