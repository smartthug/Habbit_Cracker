# Login Flow Debug Guide

## Issues Found and Fixed

### 1. **Cookie Path Missing** ✅ FIXED
**Problem**: Cookies were set without explicit `path: "/"`, which could cause them to not be available across all routes.

**Fix**: Added `path: "/"` to both `accessToken` and `refreshToken` cookie settings in both `signup()` and `login()` functions.

### 2. **Redirect Timing Issue** ✅ FIXED
**Problem**: Using `window.location.href` immediately after setting cookies might not give enough time for cookies to be set before the redirect.

**Fix**: 
- Changed to `window.location.replace()` (cleaner redirect, no back button)
- Added a small 100ms delay using `setTimeout()` to ensure cookies are set
- Improved error handling with try-catch

### 3. **Middleware Route Handling** ✅ IMPROVED
**Problem**: Middleware wasn't explicitly handling `/auth/signup` route.

**Fix**: Updated middleware to explicitly check for both `/auth/login` and `/auth/signup` in the no-token redirect logic.

### 4. **Loading State Management** ✅ FIXED
**Problem**: Loading state was being set to false before redirect, which could cause UI issues.

**Fix**: Don't reset loading state on successful login - let the redirect happen naturally.

## Debug Steps

### Step 1: Verify Cookie Setting
After login, check if cookies are set:
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Check Cookies → `http://localhost:3000`
4. Look for `accessToken` and `refreshToken` cookies

**OR** use the test endpoint:
```
GET http://localhost:3000/api/auth/test-cookie
```

### Step 2: Check Middleware
1. Check browser console for any middleware errors
2. Verify middleware is allowing `/dashboard` route
3. Check Network tab to see if redirect is happening

### Step 3: Verify JWT Token
1. Copy the `accessToken` cookie value
2. Decode it at https://jwt.io
3. Verify it contains `userId` and `email`
4. Check expiration time

### Step 4: Check Server Logs
Look for:
- Database connection errors
- JWT generation errors
- Cookie setting errors

## Common Issues

### Issue: Cookies Not Being Set
**Possible Causes**:
1. `secure: true` in development (should be `false` or use `process.env.NODE_ENV === "production"`)
2. SameSite restrictions
3. Browser blocking cookies

**Solution**: 
- Ensure `secure` is only `true` in production
- Check browser cookie settings
- Try in incognito mode

### Issue: Middleware Blocking Redirect
**Possible Causes**:
1. Token not being read correctly
2. Token verification failing
3. Middleware running before cookie is set

**Solution**:
- Check middleware logs
- Verify token format
- Ensure cookie path is `/`

### Issue: Infinite Redirect Loop
**Possible Causes**:
1. Middleware redirecting authenticated users from `/auth/login` to `/dashboard`
2. Dashboard redirecting unauthenticated users to `/auth/login`

**Solution**:
- Check middleware logic for authenticated users on auth pages
- Verify `getCurrentUser()` is working correctly

## Testing Checklist

- [ ] Signup creates user in MongoDB
- [ ] Signup sets cookies correctly
- [ ] Signup redirects to dashboard
- [ ] Login validates credentials
- [ ] Login sets cookies correctly
- [ ] Login redirects to dashboard
- [ ] Middleware allows access to `/dashboard` when authenticated
- [ ] Middleware redirects to `/auth/login` when not authenticated
- [ ] Middleware redirects authenticated users away from `/auth/login`
- [ ] Cookies persist across page refreshes
- [ ] Logout clears cookies
- [ ] Logout redirects to login

## Code Changes Summary

### `app/actions/auth.ts`
- Added `path: "/"` to all cookie settings

### `app/auth/login/page.tsx`
- Changed redirect to `window.location.replace()`
- Added 100ms delay before redirect
- Improved error handling

### `app/auth/signup/page.tsx`
- Changed redirect to `window.location.replace()`
- Added 100ms delay before redirect
- Improved error handling

### `middleware.ts`
- Improved route handling for `/auth/signup`
- Better static file exclusion

### `app/api/auth/test-cookie/route.ts` (NEW)
- Debug endpoint to check cookie status

## Next Steps if Still Not Working

1. **Check Environment Variables**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/habit-cracker
   JWT_SECRET=your-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-here
   NODE_ENV=development
   ```

2. **Verify MongoDB Connection**:
   - Ensure MongoDB is running
   - Check connection string is correct
   - Test connection manually

3. **Check Browser Console**:
   - Look for JavaScript errors
   - Check Network tab for failed requests
   - Verify redirect is happening

4. **Test Cookie Endpoint**:
   ```
   GET /api/auth/test-cookie
   ```
   Should return:
   ```json
   {
     "hasAccessToken": true,
     "hasRefreshToken": true,
     "accessTokenLength": 200+,
     "refreshTokenLength": 200+
   }
   ```

5. **Check Server Terminal**:
   - Look for any error messages
   - Check for database connection issues
   - Verify JWT secret is set
