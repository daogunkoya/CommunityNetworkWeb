#!/bin/bash

# Script to switch between local and production environments

echo "🌐 Environment Switcher for MatchGrinder"
echo "========================================"

if [ "$1" = "local" ]; then
    echo "🔄 Switching to LOCAL environment..."
    cp .env.backup .env.production
    sed -i '' 's|VITE_API_URL=https://matchgrinder.com/api|VITE_API_URL=http://localhost:8001/api|' .env
    echo "✅ Switched to LOCAL environment"
    echo "📡 API URL: http://localhost:8001/api"
    echo "🚀 Make sure your local API server is running: php artisan serve --port=8001"
elif [ "$1" = "production" ]; then
    echo "🔄 Switching to PRODUCTION environment..."
    cp .env.production .env
    echo "✅ Switched to PRODUCTION environment"
    echo "📡 API URL: https://matchgrinder.com/api"
else
    echo "❌ Usage: ./switch-env.sh [local|production]"
    echo ""
    echo "Examples:"
    echo "  ./switch-env.sh local      # Switch to local development"
    echo "  ./switch-env.sh production # Switch to production"
    echo ""
    echo "Current environment:"
    if grep -q "localhost:8001" .env; then
        echo "🟢 LOCAL (http://localhost:8001/api)"
    else
        echo "🔴 PRODUCTION (https://matchgrinder.com/api)"
    fi
fi

