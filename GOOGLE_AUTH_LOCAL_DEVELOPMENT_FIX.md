# Google Authentication - Local Development Fix

## Problem

Google authentication works on production (`matchgrinder.com`) but fails on localhost with these errors:

```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
Failed to load resource: the server responded with a status of 403
Server did not send the correct CORS headers.
```

## Root Cause

Your Google OAuth Client ID is only configured to work with `https://matchgrinder.com`. Google requires you to **explicitly whitelist** each domain/origin that can use your OAuth client.

## Solution

Add localhost origins to your Google Cloud Console OAuth configuration.

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Select your project (the one for MatchGrinder)
3. Navigate to **APIs & Services** → **Credentials**

### Step 2: Find Your OAuth 2.0 Client ID

1. Look for your OAuth 2.0 Client ID (starts with something like `295547045070-...`)
2. Click on it to edit

### Step 3: Add Localhost Origins

In the **Authorized JavaScript origins** section, add these URIs:

```
http://localhost:8080
http://localhost:5173
http://localhost:3000
http://127.0.0.1:8080
http://127.0.0.1:5173
```

**Explanation:**
- `localhost:8080` - Your current dev server port (from the error)
- `localhost:5173` - Vite's default dev server port
- `localhost:3000` - Common dev server port
- `127.0.0.1` versions - Some browsers treat localhost and 127.0.0.1 differently

### Step 4: Add Authorized Redirect URIs (If Needed)

If you're also using OAuth redirect flow, add these to **Authorized redirect URIs**:

```
http://localhost:8080/auth/callback
http://localhost:5173/auth/callback
http://localhost:3000/auth/callback
http://127.0.0.1:8080/auth/callback
http://127.0.0.1:5173/auth/callback
```

### Step 5: Save Changes

1. Click **Save** at the bottom
2. Wait 5-10 minutes for changes to propagate (Google's cache)

### Step 6: Clear Browser Cache

1. Open Chrome DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use: `Ctrl+Shift+Delete` → Clear cookies and cached files

### Step 7: Test Google Sign-In

1. Go to `http://localhost:8080/signin` (or your dev port)
2. Click "Continue with Google"
3. You should now see the Google account selector
4. No more 403 errors

## Visual Guide

### Before (Error State):
```
┌─────────────────────────────────────────┐
│  Google Cloud Console                   │
│  ─────────────────────────────────────  │
│  Authorized JavaScript origins:         │
│  ✓ https://matchgrinder.com            │
│  ✗ http://localhost (MISSING!)         │
└─────────────────────────────────────────┘
         ↓
    ❌ 403 Error on localhost
```

### After (Working State):
```
┌─────────────────────────────────────────┐
│  Google Cloud Console                   │
│  ─────────────────────────────────────  │
│  Authorized JavaScript origins:         │
│  ✓ https://matchgrinder.com            │
│  ✓ http://localhost:8080               │
│  ✓ http://localhost:5173               │
│  ✓ http://127.0.0.1:8080               │
└─────────────────────────────────────────┘
         ↓
    ✅ Google Auth works on localhost
```

## Alternative: Use Separate Client ID for Development

For better security, you can create a **separate OAuth Client ID** for development:

### Benefits:
- ✅ Keep production credentials secure
- ✅ Different callback URLs for dev/prod
- ✅ Easier to manage permissions
- ✅ Can revoke dev credentials without affecting production

### How to Set Up:

1. **Create New OAuth Client ID**:
   - Go to Google Cloud Console → Credentials
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Application type: **Web application**
   - Name: "MatchGrinder - Development"

2. **Configure Origins**:
   - Authorized JavaScript origins:
     ```
     http://localhost:8080
     http://localhost:5173
     http://localhost:3000
     http://127.0.0.1:8080
     ```

3. **Update Your `.env` File**:
   ```bash
   # .env (for local development)
   VITE_GOOGLE_CLIENT_ID=YOUR-DEV-CLIENT-ID.apps.googleusercontent.com
   VITE_API_URL=http://localhost:8001/api
   ```

4. **Production `.env`**:
   ```bash
   # .env.production (for production build)
   VITE_GOOGLE_CLIENT_ID=YOUR-PROD-CLIENT-ID.apps.googleusercontent.com
   VITE_API_URL=https://matchgrinder.com/api
   ```

## Troubleshooting

### Still Getting 403 After Adding Origins?

1. **Wait 5-10 minutes** - Google caches OAuth config
2. **Check the exact port** - Make sure you're running on the port you added
3. **Use HTTP not HTTPS** - localhost uses http:// not https://
4. **Clear cookies** - Old authentication cookies can cause issues
5. **Check browser console** - Look for the exact origin being rejected

### Check Your Current Dev Server Port:

```bash
# When you run npm run dev, look for this line:
  ➜  Local:   http://localhost:5173/
```

Add that exact port to Google Cloud Console.

### Error: "redirect_uri_mismatch"?

This means you need to add redirect URIs. Go back to Step 4 above.

### Error: "invalid_client"?

This means your `VITE_GOOGLE_CLIENT_ID` in `.env` doesn't match any OAuth client in your Google project.

## Other Console Errors (Unrelated to Google Auth)

The other errors in your console are from **third-party services** (not related to your Google authentication issue):

### 1. **Lindy.ai Errors** (Can Ignore)
```
RelayNetwork: No data returned for operation `AppInitializersQuery`
Refused to frame 'https://consentcdn.cookiebot.com/'
```
These are from an embedded Lindy.ai chat widget. Not related to your auth.

### 2. **Ad Blockers** (`ERR_BLOCKED_BY_CLIENT`)
```
POST https://pagead2.googlesyndication.com/ccm/collect ... net::ERR_BLOCKED_BY_CLIENT
GET https://px.ads.linkedin.com/collect ... net::ERR_BLOCKED_BY_CLIENT
```
These are being blocked by your ad blocker or privacy extension. Also not related to your Google auth.

### 3. **CSP Violations**
```
Refused to connect to 'https://region1.google-analytics.com/g/collect'
```
Content Security Policy violations from embedded services. Not affecting your auth flow.

## Verification Steps

After making the changes, verify it works:

### 1. Check Console for Success Logs:
```
✅ Google response: {credential: "eyJhbG...", select_by: "fedcm"}
✅ Google user payload: {iss: "https://accounts.google.com", email: "user@gmail.com", ...}
✅ 📤 OUTGOING REQUEST
✅ 📥 INCOMING RESPONSE (SUCCESS)
✅ 🔐 Social Auth Response: {status: 200, data: {...}}
```

### 2. No More 403 Errors:
```
❌ BEFORE: Failed to load resource: the server responded with a status of 403
✅ AFTER: Google authentication popup appears normally
```

### 3. Test the Full Flow:
1. Click "Continue with Google" on localhost
2. Google account selector appears
3. Select account
4. Redirects properly (new user → registration, existing → dashboard)

## Quick Reference

| Environment | Origin | Client ID Source |
|------------|--------|-----------------|
| Production | `https://matchgrinder.com` | Production OAuth Client |
| Development | `http://localhost:8080` | Same or Dev OAuth Client |
| Dev (Vite) | `http://localhost:5173` | Same or Dev OAuth Client |

## Summary

**The Issue**: Your Google OAuth Client ID doesn't allow `http://localhost:8080` as an origin.

**The Fix**: Add localhost origins in Google Cloud Console → APIs & Services → Credentials → Your OAuth Client ID → Authorized JavaScript origins.

**Time to Fix**: 2 minutes + 5-10 minutes for Google cache to update.

**After Fix**: Google authentication will work on both production AND localhost! 🎉

---

**Last Updated**: November 3, 2025  
**Status**: Ready to Implement



