#!/bin/bash

# Kill existing server processes
echo "🔄 Stopping existing server processes..."
pkill -f "node.*server.js" || true
pkill -f "nodemon.*server.js" || true
sleep 2

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📝 Please create a .env file with your configuration:"
    echo "   cp .env.example .env"
    echo "   # Then edit .env with your actual values"
    exit 1
fi

# Load environment variables from .env file
echo "🔧 Loading environment variables from .env file..."
source .env

echo "✅ Environment variables loaded:"
echo "  AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID:0:8}..."
echo "  AWS_REGION: $AWS_REGION"
echo "  PORT: $PORT"
echo ""

# Start the server
echo "🚀 Starting server with environment variables..."
echo "📧 Contact form emails will be sent to: admin@secureusdt.com"
echo ""

# Start server in background
nohup node server.js > server.log 2>&1 &
SERVER_PID=$!

echo "✅ Server started with PID: $SERVER_PID"
echo "📝 Logs are being written to: server.log"
echo ""
echo "🧪 Test the contact form with:"
echo "curl -X POST http://localhost:5002/api/contact \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"mobileNumber\":\"+1234567890\",\"subject\":\"Test Subject\",\"message\":\"Test message\"}'"
echo ""
echo "📧 Check your email for test emails"
