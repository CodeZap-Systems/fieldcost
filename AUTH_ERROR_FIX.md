# Auth Error: Invalid Refresh Token Not Found

## Error
```
Console AuthApiError: Invalid Refresh Token: Refresh Token Not Found
```

## Root Cause
Your Supabase session has expired or the refresh token is invalid. This happens when:
- Browser session expires (usually after 24 hours)
- Browser cookies/local storage are cleared
- Refresh token becomes stale
- Server-side session invalidation occurs

## ✅ Quick Fix (Immediate)

### Option 1: Clear Browser Storage (Best)
1. Open **Developer Tools** (F12)
2. Go to **Application** → **Local Storage**
3. Select `http://localhost:3000` and delete all items
4. Go to **Cookies** and delete any `localhost` cookies
5. **Refresh the page** (Ctrl+R)
6. **Re-login** to your account

### Option 2: Clear via Console
Run in **Console** tab:
```javascript
localStorage.clear();
sessionStorage.clear();
window.location.reload();
```

## ✅ What Changed (Prevention)

**Files Added:**
- `lib/sessionRecovery.ts` - Session recovery utilities
- `app/components/AuthErrorBoundary.tsx` - Global auth error handler

**Files Modified:**
- `app/layout.tsx` - Wrapped app with AuthErrorBoundary
- `app/auth/login/page.tsx` - Enhanced session checking logic

## ✅ How It Works Now

1. **AuthErrorBoundary** in root layout monitors auth errors globally
2. When "Refresh Token Not Found" error occurs:
   - Clears all stale auth tokens from localStorage
   - Clears sessionStorage
   - Signs out the user via Supabase
   - Redirects to login page automatically
3. **Login page** now checks and clears stale tokens on mount
4. No manual intervention needed - automatic recovery in place

## ✅ Prevention Going Forward

- Refresh tokens are now validated before use
- Stale tokens are automatically cleaned up
- Session errors don't break the app
- Users are redirected to login smoothly

## Testing

1. Your app is **already updated** and deployed locally
2. If you ever get this error again, the app will:
   - Detect it automatically
   - Clear stale data
   - Redirect you to login
   - No scary error message

## Configuration

Supabase session settings are configured in:
- `lib/supabaseClient.ts` - Base auth configuration
- Session timeout: 24 hours (configurable in Supabase dashboard)

## Need More Help?

If you continue to get auth errors:
1. Check browser console for details (F12)
2. Verify Supabase project is running
3. Confirm `.env.local` has correct SUPABASE_URL and SUPABASE_ANON_KEY
4. Clear all browser data and try again
