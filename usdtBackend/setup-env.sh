#!/bin/bash

# Setup environment variables for USDT Backend
echo "Setting up environment variables..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📝 Please create a .env file with your configuration:"
    echo "   cp .env.example .env"
    echo "   # Then edit .env with your actual values"
    exit 1
fi

# Load environment variables from .env file
echo "📄 Loading environment variables from .env file..."
source .env

echo "✅ Environment variables loaded successfully!"
echo ""
echo "📧 Email Configuration:"
echo "  AWS Access Key: ${AWS_ACCESS_KEY_ID:0:8}..."
echo "  AWS Region: $AWS_REGION"
echo "  From Email: $FROM_EMAIL"
echo ""
echo "🚀 You can now start the server with: npm start"
echo "📝 Contact form emails will be sent to: admin@secureusdt.com"
