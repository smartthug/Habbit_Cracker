# Login Troubleshooting Guide

## Current Issue
- Login button causes page reload but stays on login page
- Tokens are not being created/set

## What I've Fixed

### 1. **Form Submission Handling** ✅
- Changed from manual async handler to `useTransition` hook (Next.js 14 best practice)
- Added proper `e.preventDefault()` and `e.stopPropagation()`
- Removed form action to prevent default submission

### 2. **Added Comprehensive Logging** ✅
- Server-side logging in `app/actions/auth.ts`
- Client-side logging in `app/auth/login/page.tsx`
- All logs prefixed with `[LOGIN]` or `[CLIENT]` for easy identification

### 3. **Improved Error Handling** ✅
- Better error messages
- Proper error state management
- Fallback error handling

### 4. **Debug Endpoints** ✅
- `/api/auth/test-cookie` - Check if cookies are set
- `/api/auth/debug-login` - Detailed login state debugging

## How to Debug

### Step 1: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Try to login
4. Look for logs starting with `[CLIENT]` or `[LOGIN]`

**Expected logs:**
```
[CLIENT] Attempting login...
[CLIENT] Login result: { success: true, user: {...} }
[CLIENT] Login successful, redirecting...
```

**If you see errors:**
- Check what the error message says
- Look for database connection errors
- Check for JWT generation errors

### Step 2: Check Server Terminal
Look for server-side logs:
```
[LOGIN] Starting login process...
[LOGIN] Email: user@example.com
[LOGIN] Validation passed
[LOGIN] Database connected
[LOGIN] User found: user@example.com
[LOGIN] Password verified
[LOGIN] Tokens generated
[LOGIN] Cookies set successfully
[LOGIN] Returning success
```

**If logs stop at a certain point:**
- That's where the error is happening
- Check the error message

### Step 3: Check Cookies
1. After attempting login, open DevTools
2. Go to Application → Cookies → `http://localhost:3000`
3. Look for `accessToken` and `refreshToken`

**OR** visit: `http://localhost:3000/api/auth/debug-login`

**Expected response:**
```json
{
  "hasAccessToken": true,
  "hasRefreshToken": true,
  "accessTokenValue": "eyJhbGciOiJIUzI1NiIs...",
  "refreshTokenValue": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Step 4: Check Environment Variables
Make sure `.env.local` exists and has:
```env
MONGODB_URI=mongodb://localhost:27017/habit-cracker
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
NODE_ENV=development
```

**Important:**
- `JWT_SECRET` and `JWT_REFRESH_SECRET` must be set
- MongoDB must be running
- Connection string must be correct

### Step 5: Check MongoDB Connection
1. Make sure MongoDB is running
2. Check if you can connect:
   ```bash
   mongosh mongodb://localhost:27017/habit-cracker
   ```
3. Verify users exist:
   ```javascript
   use habit-cracker
   db.users.find()
   ```

## Common Issues and Solutions

### Issue: "Database connection error"
**Solution:**
- Start MongoDB: `mongod` or use MongoDB service
- Check `MONGODB_URI` in `.env.local`
- Verify MongoDB is listening on the correct port

### Issue: "JWT_SECRET is not defined"
**Solution:**
- Create `.env.local` file in project root
- Add `JWT_SECRET=your-secret-key`
- Restart Next.js dev server

### Issue: "Invalid email or password"
**Solution:**
- Verify user exists in database
- Check password is correct
- Verify password was hashed during signup

### Issue: Cookies not being set
**Possible causes:**
1. Browser blocking cookies
2. `secure: true` in development (should be `false`)
3. SameSite restrictions

**Solution:**
- Check browser cookie settings
- Try incognito mode
- Verify `secure` is only `true` in production

### Issue: Page reloads but stays on login
**Possible causes:**
1. Form is submitting normally (not using server action)
2. Server action is failing silently
3. Redirect is being blocked

**Solution:**
- Check browser console for errors
- Check server terminal for errors
- Verify `useTransition` is working
- Check if cookies are actually set

## Testing Checklist

- [ ] MongoDB is running
- [ ] `.env.local` file exists with correct values
- [ ] User exists in database
- [ ] Browser console shows login attempt
- [ ] Server terminal shows login process
- [ ] Cookies are set after login
- [ ] Redirect happens to `/dashboard`
- [ ] Dashboard loads successfully

## Next Steps

1. **Try logging in again** and check:
   - Browser console for `[CLIENT]` logs
   - Server terminal for `[LOGIN]` logs
   - Cookies in DevTools

2. **If still not working:**
   - Share the console logs
   - Share the server terminal output
   - Share the response from `/api/auth/debug-login`

3. **Check these files:**
   - `app/actions/auth.ts` - Login server action
   - `app/auth/login/page.tsx` - Login page component
   - `lib/db.ts` - Database connection
   - `lib/jwt.ts` - JWT token generation
   - `middleware.ts` - Route protection

## Quick Test

Run this in browser console after attempting login:
```javascript
fetch('/api/auth/debug-login')
  .then(r => r.json())
  .then(console.log)
```

This will show you the current cookie state.
