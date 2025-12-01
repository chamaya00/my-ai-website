import { getJson } from 'serpapi';
import { NextRequest, NextResponse } from 'next/server';

// Types matching the Python Pydantic models
interface ClothingFeatures {
  type: string;
  color: string[];
  style: string[];
  pattern: string;
  material: string;
  brand?: string;
  description: string;
}

interface SearchRequest {
  features: ClothingFeatures;
}

interface SearchResult {
  title: string;
  price: string;
  link: string;
  image: string;
  source: string;
  snippet?: string;
}

interface SearchResponse {
  results: SearchResult[];
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from environment
    const apiKey = process.env.SERPAPI_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'SERPAPI_KEY not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: SearchRequest = await request.json();

    if (!body.features) {
      return NextResponse.json(
        { error: 'Features are required' },
        { status: 400 }
      );
    }

    const features = body.features;

    // Build search query from features
    const queryParts: string[] = [features.type];

    // Add primary color
    if (features.color && features.color.length > 0) {
      queryParts.push(features.color[0]);
    }

    // Add pattern if not solid
    if (features.pattern && features.pattern.toLowerCase() !== 'solid') {
      queryParts.push(features.pattern);
    }

    // Add a style keyword
    if (features.style && features.style.length > 0) {
      queryParts.push(features.style[0]);
    }

    const searchQuery = queryParts.join(' ');

    // Search using SerpAPI Google Shopping
    const params = {
      engine: 'google_shopping',
      q: searchQuery,
      api_key: apiKey,
      num: 20, // Get up to 20 results
    };

    // Perform the search
    const resultsData = await getJson(params);

    // Parse results
    const results: SearchResult[] = [];
    const shoppingResults = resultsData.shopping_results || [];

    for (const item of shoppingResults.slice(0, 12)) {
      // Limit to 12 results
      const result: SearchResult = {
        title: item.title || '',
        price: item.price || 'N/A',
        link: item.link || '',
        image: item.thumbnail || '',
        source: item.source || 'Unknown',
        snippet: item.snippet || undefined,
      };
      results.push(result);
    }

    const response: SearchResponse = {
      results,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: `Error searching: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
