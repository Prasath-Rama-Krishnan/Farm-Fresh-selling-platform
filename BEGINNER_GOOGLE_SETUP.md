# 🔰 Complete Beginner's Guide - Google Sign-In Setup

## 📋 What We're Doing
Setting up Google "Sign in with Google" button for your website. Takes 10 minutes, completely free.

---

## 🚀 PART 1: Google Cloud Console Setup

### Step 1: Open Google Cloud Console
1. **Open your browser** (Chrome, Firefox, etc.)
2. **Go to:** https://console.cloud.google.com/
3. **Sign in** with your Google account (same one you use for Gmail)

### Step 2: Create a Project
1. **You'll see a dropdown** at the top that says "Select a project"
2. **Click on it** → **Click "New Project"**
3. **Project name:** Type "Farm Fresh Platform" 
4. **Click "Create"** (wait 30 seconds)
5. **Make sure your new project is selected** (you'll see it in the top bar)

### Step 3: Enable Google+ API
1. **Look for the hamburger menu** (3 lines) on the left
2. **Click:** APIs & Services → **Library**
3. **Search box:** Type "Google+ API"
4. **Click on "Google+ API"** → **Click "Enable"**
5. **Wait for it to enable** (30 seconds)

### Step 4: Create OAuth Credentials
1. **Go back to:** APIs & Services → **Credentials** (left sidebar)
2. **Click the blue button:** "Create Credentials"
3. **Select:** "OAuth 2.0 Client ID"
4. **If asked about consent screen:** Click "Configure Consent Screen"
   - Choose "External" → Click "Create"
   - **App name:** "Farm Fresh Platform"
   - **User support email:** Your email
   - **Developer contact:** Your email
   - **Click "Save and Continue"** (skip other steps)
5. **Back to creating OAuth Client ID:**
   - **Application type:** Choose "Web application"
   - **Name:** "Farm Fresh Web Client"

### Step 5: Add Your Website URL (CRITICAL!)
1. **Find your Vercel URL first:**
   - Open new tab → Go to https://vercel.com/
   - Sign in → Click your project
   - **Copy the URL** (looks like: `https://farm-fresh-selling-platform-abc123.vercel.app`)

2. **Back in Google Cloud Console:**
   - **Authorized JavaScript origins** section
   - **Click "Add URI"**
   - **Paste your Vercel URL** (NO TRAILING SLASH!)
   - **Correct:** `https://farm-fresh-selling-platform.vercel.app`
   - **Wrong:** `https://farm-fresh-selling-platform.vercel.app/`
   
3. **Also add to Authorized redirect URIs:**
   - **Click "Add URI"** in redirect section
   - **Add:** `https://farm-fresh-selling-platform.vercel.app`
   - **Add:** `https://farm-fresh-selling-platform.vercel.app/login`
   
4. **Click "Create"**

### Step 6: Copy Your Client ID
1. **You'll see a popup** with your credentials
2. **Copy the "Client ID"** (looks like: `123456789-abcdef.apps.googleusercontent.com`)
3. **Save it in notepad** - you'll need it next!

---

## 🔧 PART 2: Vercel Environment Variables

### Step 1: Open Vercel Dashboard
1. **Go to:** https://vercel.com/
2. **Sign in** → **Click your project name**

### Step 2: Add Environment Variables
1. **Click "Settings"** (top menu)
2. **Click "Environment Variables"** (left sidebar)
3. **Add these 3 variables one by one:**

**Variable 1:**
- **Name:** `MONGODB_URI`
- **Value:** `mongodb+srv://prasathramakrishnan005_db_user:w2sHRgxAitPaBvoD@farm-fresh.v7dgiuo.mongodb.net/?retryWrites=true&w=majority&appName=farm-fresh`
- **Click "Save"**

**Variable 2:**
- **Name:** `JWT_SECRET`
- **Value:** `my-super-secret-random-key-12345-farm-fresh`
- **Click "Save"**

**Variable 3:**
- **Name:** `VITE_GOOGLE_CLIENT_ID`
- **Value:** `paste-your-google-client-id-here.apps.googleusercontent.com`
- **Click "Save"**

---

## 📤 PART 3: Deploy Your Changes

### Step 1: Push to GitHub
1. **Open your VS Code** (or terminal)
2. **Run these commands:**
```bash
git add .
git commit -m "Add Google OAuth support"
git push origin main
```

### Step 2: Wait for Deployment
1. **Go back to Vercel** → Your project dashboard
2. **Wait for the deployment** (you'll see it building)
3. **When it's done** (green checkmark), **click the URL**

---

## ✅ Testing Your Setup

### Test 1: Regular Login
1. **Go to your website** → **Click "Login"**
2. **Try email/password login** → Should work!

### Test 2: Google Sign-In
1. **On login page** → **Click "Sign in with Google" button**
2. **Choose your Google account** → Should work!
3. **You should be logged in** and redirected to homepage

---

## 🆘 If Something Goes Wrong

### "Access blocked: authorization_error"
- **Problem:** Your Vercel URL not added to Google Cloud Console
- **Fix:** Go back to Google Cloud Console → Add your exact Vercel URL

### "Invalid client ID"
- **Problem:** Wrong Client ID in Vercel environment variables
- **Fix:** Copy Client ID again from Google Cloud Console

### Google button doesn't appear
- **Problem:** Environment variable not set
- **Fix:** Check Vercel environment variables are saved correctly

---

## 🎉 Success!
Your website now has:
- ✅ Email/password login
- ✅ Google Sign-In
- ✅ Database storage
- ✅ Full authentication

**Total time:** 10 minutes
**Cost:** $0 (completely free)
