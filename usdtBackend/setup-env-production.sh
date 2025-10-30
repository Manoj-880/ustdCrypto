#!/bin/bash

# Production Environment Setup Script for SecureUSDT Backend
# Run this script to set up environment variables for production

echo "Setting up production environment variables..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    touch .env
fi

# Add production environment variables
cat >> .env << EOF

# Production Configuration
NODE_ENV=production
FRONTEND_URL=https://secureusdt.com
PORT=5002

# Add your other production environment variables here:
# MONGODB_URI=your_production_mongodb_uri
# AWS_ACCESS_KEY_ID=your_aws_access_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret_key
# AWS_REGION=us-east-1
# ALLOWED_ORIGINS=https://secureusdt.com,https://www.secureusdt.com

# Cron Job Configuration (profit distribution)
# Schedule format: "minute hour day month weekday"
# UTC-based schedule to run when IST is 9:00 AM → 03:30 UTC
PROFIT_CRON_SCHEDULE_UTC=30 3 * * *
# If you still use timezone-based cron, you can set the below instead
# PROFIT_CRON_SCHEDULE=0 9 * * *
# CRON_TIMEZONE=Asia/Kolkata
# USE_INTERVAL_BACKUP=false

EOF

echo "Production environment variables added to .env file"
echo "Please edit .env file to add your actual production values"
echo "Don't forget to restart your server after updating environment variables"
