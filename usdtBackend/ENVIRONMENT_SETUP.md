# Environment Setup for SecureUSDT Backend

This document explains how to set up environment variables for both development and production environments.

## Quick Setup

### For Development (Local)
```bash
# Run the development setup script
./setup-env-development.sh

# Or manually create .env file with:
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### For Production
```bash
# Run the production setup script
./setup-env-production.sh

# Or manually create .env file with:
NODE_ENV=production
FRONTEND_URL=https://secureusdt.com
```

## Environment Variables

### Required Variables

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `NODE_ENV` | `development` | `production` | Environment mode |
| `FRONTEND_URL` | `http://localhost:5173` | `https://secureusdt.com` | Frontend URL for email links |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/secureusdt` |
| `PORT` | Server port | `5002` |
| `AWS_ACCESS_KEY_ID` | AWS SES access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS SES secret key | `...` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:5173,https://secureusdt.com` |

## How It Works

The backend automatically detects the environment and sets the appropriate frontend URL:

```javascript
const frontendUrl = process.env.FRONTEND_URL || 
  (process.env.NODE_ENV === 'production' ? 
    'https://secureusdt.com' : 
    'http://localhost:5173'
  );
```

### Email Verification Links

- **Development**: `http://localhost:5173/verify-email?token=...`
- **Production**: `https://secureusdt.com/verify-email?token=...`

## Troubleshooting

### Check Current Environment
```bash
# Check if .env file exists
ls -la .env

# Check environment variables
cat .env

# Check what URL is being generated (check server logs)
# Look for: "Generated verification link: ..."
```

### Common Issues

1. **Wrong URL in emails**: Check `FRONTEND_URL` in .env file
2. **CORS errors**: Check `ALLOWED_ORIGINS` includes your frontend URL
3. **Email not sending**: Check AWS credentials and region

## Deployment

### For Production Deployment

1. Set environment variables on your server:
   ```bash
   export NODE_ENV=production
   export FRONTEND_URL=https://secureusdt.com
   ```

2. Or use a .env file on the server:
   ```bash
   NODE_ENV=production
   FRONTEND_URL=https://secureusdt.com
   ```

3. Restart your server after setting environment variables

### For Docker Deployment

Create a docker-compose.yml with environment variables:
```yaml
services:
  backend:
    environment:
      - NODE_ENV=production
      - FRONTEND_URL=https://secureusdt.com
```

## Testing

To test email verification URLs:

1. **Development**: Register a user and check the email link
2. **Production**: Deploy and test with a real email address
3. **Check logs**: Look for "Generated verification link:" in server logs
