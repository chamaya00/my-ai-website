import Anthropic from '@anthropic-ai/sdk';
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

interface AnalyzeRequest {
  image: string; // Base64 encoded image
}

interface AnalyzeResponse {
  features: ClothingFeatures;
}

/**
 * Extract media type and base64 data from data URL
 */
function extractImageData(imageData: string): { mediaType: string; data: string } {
  if (imageData.startsWith('data:')) {
    // Format: data:image/jpeg;base64,/9j/4AAQ...
    const match = imageData.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      return {
        mediaType: match[1],
        data: match[2],
      };
    }
  }

  // If no data URL prefix, assume it's already base64
  return {
    mediaType: 'image/jpeg',
    data: imageData,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: AnalyzeRequest = await request.json();

    if (!body.image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Initialize Anthropic client
    const client = new Anthropic({ apiKey });

    // Extract image data
    const { mediaType, data } = extractImageData(body.image);

    // Create the prompt for Claude
    const prompt = `Analyze this clothing item in detail. Extract the following information:

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

Only return the JSON, no additional text.`;

    // Call Claude API with vision
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: data,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    // Extract the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON from response
    // Sometimes Claude wraps JSON in markdown code blocks
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : responseText;

    let featuresData: ClothingFeatures;
    try {
      featuresData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse AI response', details: responseText },
        { status: 500 }
      );
    }

    // Validate the response has required fields
    if (!featuresData.type || !featuresData.color || !featuresData.style) {
      return NextResponse.json(
        { error: 'Invalid response from AI', details: featuresData },
        { status: 500 }
      );
    }

    const response: AnalyzeResponse = {
      features: featuresData,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error analyzing image:', error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Anthropic API error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: `Error analyzing image: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
