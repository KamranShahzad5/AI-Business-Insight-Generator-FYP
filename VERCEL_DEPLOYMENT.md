# 🚀 Vercel Deployment Guide

This guide helps you deploy both frontend and backend to Vercel successfully.

## Part 1: Deploy Frontend to Vercel

### Prerequisites

- GitHub account with your repository pushed
- Vercel account (https://vercel.com/)

### Steps

1. **Visit Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Your Repository**
   - Select "GitHub" as the source
   - Select your repository: `AI-Business-Insight-Generator-FYP`
   - Click "Import"

3. **Configure Project Settings**
   - **Project Name**: `ai-business-insight-frontend` (or any name)
   - **Framework Preset**: Select "Vite"
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist` (should be auto-detected)

4. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add this variable:
     ```
     Key: VITE_API_URL
     Value: https://your-backend-url.onrender.com/api
     ```
   - Replace `your-backend-url` with your actual Render backend URL
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Once done, you'll get a URL like: `https://ai-business-insight-frontend-xxxxx.vercel.app`

### ✅ Frontend Deployment Complete!

Your frontend is now live at that URL.

---

## Part 2: Deploy Backend to Render

### Prerequisites

- GitHub account with your repository pushed
- Render account (https://render.com/)

### Steps

1. **Visit Render Dashboard**
   - Go to https://dashboard.render.com/
   - Click "New" → "Web Service"

2. **Connect GitHub Repository**
   - Click "Connect account" and authorize GitHub
   - Select your repository
   - Click "Connect"

3. **Configure Service**
   - **Name**: `ai-business-insight-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Instance Type**: Free (or Starter if you want better performance)

4. **Add Environment Variables**
   - Go to **Environment** section
   - Add these variables:
     ```
     GROQ_API_KEY = your_actual_groq_key_from_console.groq.com
     MONGO_URI = your_mongodb_connection_string
     JWT_SECRET = generate_a_random_string
     CLIENT_URL = https://your-vercel-frontend-url
     PORT = 5000
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment
   - You'll get a URL like: `https://ai-business-insight-backend.onrender.com`

### ✅ Backend Deployment Complete!

---

## Part 3: Connect Frontend to Backend

Once backend is deployed, update frontend environment variables:

1. **Go to Vercel Dashboard**
   - Select your frontend project
   - Go to **Settings** → **Environment Variables**
   - Update `VITE_API_URL`:
     ```
     https://ai-business-insight-backend.onrender.com/api
     ```

2. **Redeploy Frontend**
   - Go to **Deployments**
   - Click the latest deployment
   - Click "Redeploy"

---

## 🚨 Common Deployment Issues

### "Cannot connect to server" error on Vercel

**Problem**: Frontend can't reach backend

**Solution**:
1. Verify backend URL is correct in Vercel environment variables
2. Check that backend is actually running on Render
3. Make sure `VITE_API_URL` includes `/api` suffix
4. Verify CORS is enabled in backend:
   ```javascript
   app.use(cors({
     origin: ['your-vercel-url', 'another-url'],
     credentials: true,
   }));
   ```

### "GROQ_API_KEY is missing" on Render

**Problem**: Groq API key not found in environment

**Solution**:
1. Go to Render dashboard → Select backend project
2. Go to **Settings** → **Environment**
3. Verify `GROQ_API_KEY` is set correctly
4. Make sure it's your actual key from https://console.groq.com/
5. Redeploy: Go to **Deployments** → Click "Deploy" on latest commit

### "Build failed" on Vercel

**Problem**: Frontend build failed

**Solution**:
1. Check the build logs in Vercel
2. Common issues:
   - Missing `/api` in `VITE_API_URL`
   - Missing environment variables
   - Node version mismatch
3. Try redeploying:
   - Go to **Deployments** → Select previous deployment → Click "Redeploy"

### "MongoDB Connection Error" on Render

**Problem**: Backend can't connect to MongoDB

**Solution**:
1. Verify `MONGO_URI` is correct in Render environment
2. Go to MongoDB Atlas → **Network Access**
3. Add Render's IP to whitelist:
   - Go to your Render deployment
   - Copy the **IP address**
   - Add it to MongoDB Atlas Network Access
4. Alternatively, allow all IPs temporarily (less secure):
   - Go to MongoDB Atlas → Settings → Network Access
   - Click "Add IP Address"
   - Enter `0.0.0.0/0` (allows all IPs)

### "Build takes too long" on Vercel

**Problem**: Vercel build timeout

**Solution**:
1. Upgrade to Vercel Pro (allows longer builds)
2. Or optimize dependencies:
   ```bash
   npm install # Remove node_modules
   npm install --only=production
   ```

---

## 📊 Testing Your Deployment

### Test Frontend

1. Open your Vercel URL in browser
2. Try to register a new account
3. Try to generate a business plan
4. Check browser console for errors (F12)

### Test Backend

1. Open terminal
2. Run:
   ```bash
   curl https://your-backend-url/api/health
   ```
3. You should see:
   ```json
   {
     "status": "ok",
     "groqKeySet": true,
     "jwtSecretSet": true,
     "mongoUri": "set"
   }
   ```

### Check Logs

**Frontend (Vercel)**:
- Go to project → **Deployments** → Click deployment → **Logs**

**Backend (Render)**:
- Go to project → **Logs**

---

## 🔐 Security Checklist

Before going live:

- [ ] GROQ_API_KEY is set in Render (not in code)
- [ ] JWT_SECRET is a strong random string
- [ ] MONGO_URI is only accessible by your backend
- [ ] CLIENT_URL in backend matches your Vercel URL
- [ ] VITE_API_URL in frontend matches your Render URL
- [ ] `.env` files are in `.gitignore` (not committed to GitHub)
- [ ] MongoDB IP whitelist is set correctly

---

## 📱 Test Mobile Responsiveness

1. Open your deployed frontend URL on a phone
2. Test:
   - Registration/Login
   - Dashboard layout on small screens
   - Plan generation
   - Sidebar collapse on mobile

---

## 🎉 You're Live!

Your application is now deployed on Vercel (frontend) and Render (backend)!

Share your URL with friends and start generating business plans! 🚀

---

## 📞 Need Help?

If you encounter issues:

1. **Check error messages** - They usually tell you what's wrong
2. **Check logs** - Vercel and Render have detailed logs
3. **Verify environment variables** - Most issues are missing or incorrect env vars
4. **Test locally first** - Make sure it works on localhost before deploying
5. **Check API connectivity** - Use curl to test backend endpoints

Good luck! 🚀