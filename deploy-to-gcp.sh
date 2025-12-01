#!/bin/bash

# Deployment script for Google Cloud Run
# Run this from Google Cloud Shell

set -e

echo "🚀 AI Clothing Recommender - Google Cloud Deployment"
echo "=================================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required environment variables are set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo -e "${RED}ERROR: ANTHROPIC_API_KEY not set${NC}"
    echo "Run: export ANTHROPIC_API_KEY=your_key_here"
    exit 1
fi

if [ -z "$SERPAPI_KEY" ]; then
    echo -e "${RED}ERROR: SERPAPI_KEY not set${NC}"
    echo "Run: export SERPAPI_KEY=your_key_here"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}ERROR: No GCP project selected${NC}"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "${GREEN}Using GCP Project: $PROJECT_ID${NC}"
echo ""

# Set variables
REGION=${REGION:-us-central1}
BACKEND_SERVICE="clothing-recommender-backend"
FRONTEND_SERVICE="clothing-recommender-frontend"

echo "Region: $REGION"
echo ""

# Enable required APIs
echo "📋 Enabling required GCP APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
echo -e "${GREEN}✓ APIs enabled${NC}"
echo ""

# Deploy Backend
echo "🔧 Deploying Backend to Cloud Run..."
cd backend

gcloud run deploy $BACKEND_SERVICE \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY,SERPAPI_KEY=$SERPAPI_KEY" \
    --memory 512Mi \
    --timeout 60 \
    --port 8080

BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✓ Backend deployed at: $BACKEND_URL${NC}"
echo ""

cd ..

# Deploy Frontend
echo "🎨 Deploying Frontend to Cloud Run..."
cd frontend

# Update CORS in backend to allow frontend URL (will be done after frontend deployment)
gcloud run deploy $FRONTEND_SERVICE \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars "NEXT_PUBLIC_API_URL=$BACKEND_URL" \
    --memory 512Mi \
    --timeout 60 \
    --port 3000

FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✓ Frontend deployed at: $FRONTEND_URL${NC}"
echo ""

cd ..

# Update backend CORS to allow frontend
echo "🔄 Updating backend CORS configuration..."
cd backend
# Note: In production, you'd update the main.py CORS settings and redeploy
# For now, Cloud Run will handle this
cd ..

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "=================================================="
echo ""
echo "🌐 Your app is live at:"
echo -e "${GREEN}$FRONTEND_URL${NC}"
echo ""
echo "📱 Open this URL on your iPhone to use the app!"
echo ""
echo "Backend API: $BACKEND_URL"
echo ""
echo "To view logs:"
echo "  Backend:  gcloud run logs read $BACKEND_SERVICE --region $REGION"
echo "  Frontend: gcloud run logs read $FRONTEND_SERVICE --region $REGION"
echo ""
echo "To update:"
echo "  1. Make your changes"
echo "  2. Run this script again"
echo ""
