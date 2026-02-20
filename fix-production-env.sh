#!/bin/bash

# Script to fix production environment configuration
# This script ensures the .env file is configured correctly for production

echo "🔧 Fixing production environment configuration..."

# Backup current .env file
if [ -f .env ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "📋 Backed up current .env file"
fi

# Create production-ready .env file
cat > .env << 'EOF'
# Environment Variables for Production
# This file configures the app to use the production API server

# API Configuration - Production API endpoint
# For local development, uncomment and modify the line below:
# VITE_API_URL=http://localhost:8001/api
# VITE_API_URL=http://192.168.1.231:8001/api

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=295547045070-gkkmh48hvu0pca0blvoj3h3oo0uegada.apps.googleusercontent.com

# App Configuration
VITE_APP_NAME=MatchGrinder
VITE_APP_VERSION=1.0.0
EOF

echo "✅ Created production-ready .env file"
echo "📝 Note: VITE_API_URL is commented out, so the app will use the production API by default"
echo ""
echo "🚀 For local development, uncomment and set:"
echo "   VITE_API_URL=http://localhost:8001/api"
echo ""
echo "📱 For mobile testing, use your computer's IP:"
echo "   VITE_API_URL=http://192.168.1.XXX:8001/api"

