# Production Build Testing Guide

## Issue Identified
The `/games` page was crashing with:
```
TypeError: Cannot read properties of undefined (reading 'length')
```

## Root Cause
The `allEvents` variable was undefined during initial render, causing the component to crash when trying to access `allEvents.filter()` and `allEvents.length`.

## Fix Applied
Added null safety checks in `Games.tsx`:
- Line 94: Added `|| !allEvents` check
- Line 95: Added `|| []` fallback
- Line 105: Added `|| !allEvents` check

## How to Test

### 1. Build for Production
```bash
cd /Users/daniel/Documents/development/CommunitySport/CommunityNetworkWeb
npm run build
```

### 2. Preview Production Build Locally
```bash
npm run preview
```
This will serve the production build at `http://localhost:4173` (or similar)

### 3. Test the /games Page
- Navigate to `/games`
- Check if the page loads without crashing
- Verify it shows:
  - ✅ Loading state initially
  - ✅ Games list after loading
  - ✅ Filters and search work
  - ✅ Sport categories load correctly
  - ✅ No console errors

### 4. Test Different States
**When Logged Out:**
- Should show login prompt

**When Logged In (with interests):**
- Should show games filtered by interests
- Sport dropdown should show user's interests
- Blue banner showing "Showing sports for your interests"

**When Logged In (no interests):**
- Should show all sports
- Yellow banner prompting to set interests

### 5. Deploy to Production
If local preview works:
```bash
# Deploy your production build
# (use your deployment method)
```

### 6. Monitor Production
Check browser console for:
- ✅ No JavaScript errors
- ✅ API calls succeeding (200 status)
- ✅ Data loading correctly

## Quick Diagnostic Script

Open browser console on production and run:
```javascript
// Check if React is rendering
console.log('React root:', document.getElementById('root'));

// Check API base URL
console.log('API URL:', window.localStorage.getItem('api_url') || 'default');

// Check auth status
console.log('Auth token:', window.localStorage.getItem('auth_token') ? 'Present' : 'Missing');

// Check for React errors
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});
```

## Rollback Plan
If issues persist:
1. Check the exact line number in the error
2. Map minified code back to source using source maps
3. Look for other undefined access patterns

## Additional Safety Checks Added
All `.length` accesses in `Games.tsx` are now safe:
- ✅ `availableGameTypes.length` - initialized to `[]`
- ✅ `sportsCategories.length` - returns `[]` if undefined
- ✅ `events.length` - checked with `&&` operator
- ✅ `allEvents.length` - now has null checks


