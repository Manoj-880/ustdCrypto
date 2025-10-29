#!/bin/bash

# Development Environment Setup Script for SecureUSDT Backend
# Run this script to set up environment variables for local development

echo "Setting up development environment variables..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    touch .env
fi

# Add development environment variables
cat >> .env << EOF

# Development Configuration
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
PORT=5002

# Add your other development environment variables here:
# MONGODB_URI=mongodb://localhost:27017/secureusdt
# AWS_ACCESS_KEY_ID=your_aws_access_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret_key
# AWS_REGION=us-east-1
# ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Cron Job Configuration (profit distribution)
# Schedule format: "minute hour day month weekday"
# Default: "0 9 * * *" (9:00 AM IST daily)
# PROFIT_CRON_SCHEDULE=0 9 * * *
# CRON_TIMEZONE=Asia/Kolkata
# USE_INTERVAL_BACKUP=false

EOF

echo "Development environment variables added to .env file"
echo "Please edit .env file to add your actual development values"
echo "Don't forget to restart your server after updating environment variables"
