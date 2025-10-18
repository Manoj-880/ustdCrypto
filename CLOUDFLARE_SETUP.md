# Cloudflare Turnstile Setup Instructions

## 1. Get Cloudflare Turnstile Keys

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Turnstile" in the left sidebar
3. Click "Add Site"
4. Enter your domain name
5. Choose the appropriate settings:
   - **Widget Mode**: Managed (recommended)
   - **Pre-clearance**: Optional
   - **Widget Appearance**: Light or Dark
6. Click "Create"
7. Copy your **Site Key** and **Secret Key**

## 2. Update Environment Variables

Add these to your `.env` file in the backend:

```env
# Cloudflare Turnstile Configuration
TURNSTILE_SITE_KEY=your_turnstile_site_key_here
TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here
```

## 3. Update Frontend Configuration

In `client/src/pages/static/ContactPage.jsx`, replace `YOUR_TURNSTILE_SITE_KEY` with your actual site key:

```jsx
<div
  className="cf-turnstile"
  data-sitekey="YOUR_ACTUAL_SITE_KEY_HERE"
  data-callback="onTurnstileSuccess"
  data-error-callback="onTurnstileError"
  data-expired-callback="onTurnstileExpired"
  data-theme="light"
  data-size="normal"
/>
```

## 4. Test the Implementation

1. Start your backend server
2. Start your frontend development server
3. Navigate to the contact page
4. Fill out the form
5. Complete the Turnstile challenge
6. Submit the form

## 5. Production Considerations

- Make sure your domain is added to Cloudflare Turnstile
- Use environment variables for all keys
- Monitor Turnstile analytics in Cloudflare dashboard
- Consider implementing rate limiting for additional protection

## Features Implemented

- ✅ Cloudflare Turnstile widget integration
- ✅ Frontend validation (submit button disabled until verified)
- ✅ Backend token verification
- ✅ Error handling and user feedback
- ✅ Automatic widget reset on errors
- ✅ Responsive design
- ✅ Loading states

## Security Benefits

- Prevents automated bot submissions
- Reduces spam and malicious form submissions
- User-friendly alternative to traditional CAPTCHAs
- Cloudflare's advanced bot detection
- No user interaction required in most cases
