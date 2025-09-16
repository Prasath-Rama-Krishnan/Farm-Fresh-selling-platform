# Vercel Deployment Guide

## Prerequisites
1. MongoDB Atlas account (https://www.mongodb.com/cloud/atlas/register)
2. Vercel account (https://vercel.com/signup)
3. GitHub account (https://github.com/signup)

## Setup Instructions

### 1. MongoDB Setup
1. Create a new cluster in MongoDB Atlas
2. Add your current IP address to the IP Access List
3. Create a database user with read/write access
4. Get your connection string (replace password and database name)

### 2. Environment Variables
Set these in your Vercel project settings:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT token signing
- `NODE_ENV`: Set to "production"

### 3. Deploy to Vercel
1. Push your code to a GitHub repository
2. Import the repository to Vercel
3. Configure the following settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 4. Configure Vercel
1. Go to Project Settings > Environment Variables
2. Add the environment variables from step 2
3. Set the following in Project Settings > Build & Development Settings:
   - Root Directory: (leave empty)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 5. Deploy
1. Commit and push your changes to trigger a new deployment
2. Your application will be available at `your-project-name.vercel.app`

## Troubleshooting
- If you get CORS errors, ensure your frontend URL is allowed in the CORS settings
- Check Vercel logs for deployment errors
- Verify environment variables are correctly set in Vercel
- Ensure MongoDB IP whitelist includes Vercel's IP ranges
