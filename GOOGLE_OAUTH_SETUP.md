# 🔐 Google Sign-In Setup Guide

## Step 1: Google Cloud Console (5 minutes)

### 1.1 Create OAuth Credentials
1. Go to: https://console.cloud.google.com/
2. Select your project or create new one
3. Navigate: **APIs & Services** → **Credentials**
4. Click: **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose: **Web application**

### 1.2 Configure Authorized Domains
**CRITICAL:** Add your Vercel deployment URL

In "Authorized JavaScript origins" add:
- `https://farm-fresh-selling-platform.vercel.app`
- `https://your-actual-vercel-url.vercel.app` (check your Vercel dashboard)

### 1.3 Copy Client ID
Copy the generated Client ID (format: `xxxxx-xxxxx.apps.googleusercontent.com`)

## Step 2: Vercel Environment Variables

Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

Add these 3 variables:
```
MONGODB_URI=mongodb+srv://prasathramakrishnan005_db_user:w2sHRgxAitPaBvoD@farm-fresh.v7dgiuo.mongodb.net/?retryWrites=true&w=majority&appName=farm-fresh
JWT_SECRET=your-random-secret-key-here
VITE_GOOGLE_CLIENT_ID=your-new-google-client-id.apps.googleusercontent.com
```

## Step 3: Deploy
```bash
git add .
git commit -m "Add Google OAuth support"
git push origin main
```

## ✅ What Works After Setup
- Email/password login ✅
- Google Sign-In ✅
- Product management ✅
- Data persistence ✅
- All authentication features ✅

## 🔍 Find Your Vercel URL
1. Go to Vercel Dashboard
2. Click your project
3. Copy the URL from the deployment (usually shows at top)
4. Use this exact URL in Google Cloud Console

## ⚠️ Common Issues
- **"Access blocked"**: Domain not added to Google OAuth
- **"Invalid client"**: Wrong Client ID in environment variables
- **Login fails**: Check browser console for errors

Your Google Sign-In will work perfectly after these steps!
