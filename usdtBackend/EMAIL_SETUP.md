# Amazon SES Email Service Setup

This document explains how to configure Amazon SES for sending deposit confirmation emails.

## Prerequisites

1. AWS Account with SES service enabled
2. Verified email address or domain in Amazon SES
3. AWS IAM user with SES permissions

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# AWS SES Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
FROM_EMAIL=noreply@yourdomain.com
```

## AWS SES Setup Steps

### 1. Create IAM User
1. Go to AWS IAM Console
2. Create a new user with programmatic access
3. Attach the `AmazonSESFullAccess` policy (or create a custom policy with minimal permissions)

### 2. Verify Email Address
1. Go to Amazon SES Console
2. Navigate to "Verified identities"
3. Click "Create identity"
4. Choose "Email address" and enter your sender email
5. Verify the email by clicking the verification link sent to your inbox

### 3. Move Out of Sandbox (Optional)
- By default, SES is in sandbox mode (can only send to verified emails)
- To send to any email address, request production access in SES console

## Custom Policy for SES (Minimal Permissions)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
```

## Testing

The email service will automatically send confirmation emails when:
- A successful USDT deposit is processed
- The user has a valid email address in the database
- AWS credentials are properly configured

## Email Template

The deposit confirmation email includes:
- Professional HTML and text versions
- Transaction details (amount, TX ID, date)
- User-friendly design
- Responsive layout

## Troubleshooting

- Check AWS credentials are correct
- Ensure the FROM_EMAIL is verified in SES
- Check CloudWatch logs for SES errors
- Verify the region matches your SES setup
