# Vercel Deployment Guide - Habit Cracker

This guide provides detailed steps to deploy your Habit Cracker application to Vercel.

## Prerequisites

1. **GitHub Account** (or GitLab/Bitbucket)
2. **Vercel Account** (free tier is sufficient)
3. **MongoDB Atlas Account** (for cloud database) or existing MongoDB connection string
4. **Node.js** installed locally (for testing builds)

---

## Step 1: Prepare Your Code

### 1.1 Ensure Your Code is Ready

1. **Test your build locally:**
   ```bash
   npm run build
   ```
   If this fails, fix any errors before deploying.

2. **Commit all changes to Git:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   ```

### 1.2 Create `.gitignore` (if not exists)

Make sure `.gitignore` includes:
```
node_modules/
.env.local
.env*.local
.next/
.vercel/
```

---

## Step 2: Push to GitHub

### 2.1 Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it (e.g., `habit-cracker`)
3. **Don't** initialize with README, .gitignore, or license (if you already have code)

### 2.2 Push Your Code

```bash
# If you haven't initialized git yet
git init

# Add your remote (replace with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/habit-cracker.git

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Set Up MongoDB Atlas (Cloud Database)

Since Vercel doesn't host databases, you need a cloud MongoDB instance.

### 3.1 Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the FREE tier - M0)
4. Choose a cloud provider and region (closest to your users)

### 3.2 Configure Database Access

1. Go to **Database Access** → **Add New Database User**
2. Create a username and password (save these!)
3. Set privileges to **Read and write to any database**
4. Click **Add User**

### 3.3 Configure Network Access

1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (or add Vercel's IP ranges)
3. Click **Confirm**

### 3.4 Get Your Connection String

1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Replace `<password>` with your database user password
5. Add your database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/habit-cracker`

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/habit-cracker?retryWrites=true&w=majority
```

---

## Step 4: Deploy to Vercel

### 4.1 Sign Up / Log In to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up with your GitHub account (recommended) or email

### 4.2 Import Your Project

1. Click **Add New** → **Project**
2. Import your GitHub repository (`habit-cracker`)
3. Vercel will auto-detect it's a Next.js project

### 4.3 Configure Project Settings

Vercel should auto-detect:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (or `next build`)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install`

**Verify these settings are correct!**

### 4.4 Add Environment Variables

**This is critical!** Add these environment variables in Vercel:

1. Click **Environment Variables** section
2. Add each variable:

   **Variable 1:**
   - **Name:** `MONGODB_URI`
   - **Value:** Your MongoDB Atlas connection string (from Step 3.4)
   - **Environment:** Production, Preview, Development (select all)

   **Variable 2:**
   - **Name:** `JWT_SECRET`
   - **Value:** A long, random, secure string (generate one)
   - **Environment:** Production, Preview, Development (select all)
   - **Tip:** Generate with: `openssl rand -base64 32` or use an online generator

   **Variable 3:**
   - **Name:** `JWT_REFRESH_SECRET`
   - **Value:** A different long, random, secure string
   - **Environment:** Production, Preview, Development (select all)

   **Variable 4 (Optional):**
   - **Name:** `NODE_ENV`
   - **Value:** `production`
   - **Environment:** Production only

### 4.5 Deploy

1. Click **Deploy**
2. Wait for the build to complete (usually 2-5 minutes)
3. You'll see build logs in real-time

---

## Step 5: Verify Deployment

### 5.1 Check Build Logs

- If build fails, check the logs for errors
- Common issues:
  - Missing environment variables
  - Build errors in your code
  - TypeScript errors

### 5.2 Test Your Application

1. Once deployed, Vercel provides a URL like: `https://habit-cracker.vercel.app`
2. Visit the URL and test:
   - Sign up a new user
   - Log in
   - Create a habit
   - Test all features

### 5.3 Check Function Logs

1. Go to Vercel Dashboard → Your Project → **Functions** tab
2. Check for any runtime errors
3. Monitor API routes and server actions

---

## Step 6: Configure Custom Domain (Optional)

### 6.1 Add Domain in Vercel

1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `habitcracker.com`)
3. Follow Vercel's DNS configuration instructions

### 6.2 Update DNS Records

Add the DNS records Vercel provides to your domain registrar.

---

## Step 7: Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] MongoDB connection is working
- [ ] Authentication (signup/login) works
- [ ] Habits can be created and tracked
- [ ] Ideas can be saved
- [ ] Cookies are working (check browser DevTools)
- [ ] No console errors in browser
- [ ] Mobile responsiveness works

---

## Troubleshooting Common Issues

### Issue: "MongoDB connection error"

**Solutions:**
- Verify `MONGODB_URI` is set correctly in Vercel
- Check MongoDB Atlas Network Access allows all IPs
- Ensure database user has correct permissions
- Test connection string locally first

### Issue: "JWT_SECRET is not defined"

**Solutions:**
- Verify all environment variables are added in Vercel
- Make sure variables are set for **Production** environment
- Redeploy after adding variables

### Issue: "Build failed"

**Solutions:**
- Check build logs in Vercel dashboard
- Run `npm run build` locally to catch errors
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors

### Issue: "Cookies not working"

**Solutions:**
- Verify `secure: true` is used in production (should be automatic)
- Check domain settings in cookie configuration
- Ensure SameSite is set correctly for production

### Issue: "API routes return 500 errors"

**Solutions:**
- Check Function logs in Vercel dashboard
- Verify database connection
- Check environment variables are accessible
- Review server-side code for errors

---

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Vercel will automatically:
   - Detect the push
   - Build your application
   - Deploy to production

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | ✅ Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/habit-cracker` |
| `JWT_SECRET` | ✅ Yes | Secret for access tokens | `your-super-secret-key-here` |
| `JWT_REFRESH_SECRET` | ✅ Yes | Secret for refresh tokens | `your-refresh-secret-key-here` |
| `NODE_ENV` | ⚠️ Optional | Environment mode | `production` |

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## Quick Deploy Command (Alternative Method)

If you prefer using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check Vercel function logs
3. Test locally with production environment variables
4. Review Vercel documentation
5. Check MongoDB Atlas connection status

---

**Good luck with your deployment! 🚀**
