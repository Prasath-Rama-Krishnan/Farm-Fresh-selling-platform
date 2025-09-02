# Complete Deployment Guide for Farm Fresh Platform

## 🚀 Quick Setup for Production

### 1. MongoDB Atlas Setup (FREE)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account and cluster
3. Get connection string: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/farmfresh`
4. Whitelist all IPs (0.0.0.0/0) for Vercel

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Add authorized domains:
   - `https://your-vercel-app.vercel.app`
   - `https://farm-fresh-selling-platform.vercel.app`

### 3. Vercel Environment Variables
Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/farmfresh
JWT_SECRET=your-super-secret-random-string-here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NODE_ENV=production
```

### 4. Deploy Commands
```bash
git add .
git commit -m "Production ready deployment"
git push origin main
```

## 🔧 Current Issues Fixed
- ✅ JWT token authentication
- ✅ CORS configuration for production
- ✅ MongoDB connection with timeout
- ✅ API endpoints properly configured
- ✅ Environment-aware configuration

## 🌐 What Works Now
- User registration and login
- Google OAuth (after domain setup)
- Product CRUD operations
- Persistent data storage
- Serverless backend on Vercel

## 📝 Next Steps
1. Set up MongoDB Atlas (5 minutes)
2. Configure Google OAuth domain
3. Add environment variables to Vercel
4. Your site will work fully!
