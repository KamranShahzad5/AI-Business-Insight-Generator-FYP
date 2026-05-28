# 🚀 Insightify – Complete Setup Guide

This guide will help you set up Insightify locally and fix the Groq API key error.

## Prerequisites

- **Node.js** 16+ and npm
- **MongoDB Atlas** account (free tier available)
- **Groq API Key** (free tier at https://console.groq.com/)

## Step 1: Get Your API Keys

### Groq API Key (for AI features)

1. Visit https://console.groq.com/
2. Sign up or log in (free tier available)
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy your API key (looks like: `gsk_...`)
6. Save it safely – you'll need it for the `.env` file

### MongoDB Atlas (for database)

1. Visit https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a new project
4. Create a cluster (select free tier)
5. Set up database access (create username/password)
6. Get connection string from "Connect" button
7. Copy the URI (looks like: `mongodb+srv://username:password@cluster.mongodb.net/insightify`)

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd server
npm install
```

### 2.2 Create `.env` File

Create a new file named `.env` in the `server/` folder:

```bash
# server/.env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/insightify
GROQ_API_KEY=gsk_YOUR_ACTUAL_KEY_HERE
JWT_SECRET=generate_a_random_string_here
CLIENT_URL=http://localhost:5173
```

**⚠️ IMPORTANT:**
- Replace `GROQ_API_KEY` with your actual key from console.groq.com
- Replace `MONGO_URI` with your MongoDB connection string
- For `JWT_SECRET`, use any random string (example: `my_super_secret_key_12345`)

### 2.3 Start Backend

```bash
npm run dev
```

✅ You should see:
```
🚀 Server running on port 5000
✅ Connected to MongoDB
✅ Groq API key loaded.
```

**If you get a Groq API key error:**
- Check that `GROQ_API_KEY` is set correctly in `.env`
- Make sure there are no extra spaces or quotes around the key
- Restart the server: `Ctrl+C` then `npm run dev`

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd client
npm install
```

### 3.2 Start Frontend

```bash
npm run dev
```

✅ Frontend will run on `http://localhost:5173`

## Step 4: Test the Application

1. Open http://localhost:5173 in your browser
2. Click **Get Started** or go to **Register**
3. Create an account
4. Click **Generate New Plan**
5. Describe your business idea (minimum 20 characters)
6. Select industry and budget
7. Click **Generate Plan**

If it works, you should see a loading animation and then your generated business plan!

## 🚨 Troubleshooting

### Error: "GROQ_API_KEY is missing or still set to the placeholder"

**Solution:**
1. Open `server/.env`
2. Check that `GROQ_API_KEY=gsk_YOUR_KEY` (replace `YOUR_KEY` with your actual key)
3. Make sure it doesn't have quotes: ❌ `GROQ_API_KEY="gsk_..."` ✅ `GROQ_API_KEY=gsk_...`
4. Restart the server

### Error: "Cannot connect to server"

**Solution:**
1. Make sure backend is running: `npm run dev` in `server/` folder
2. Check that it's running on port 5000
3. Make sure firewall isn't blocking port 5000

### Error: "Invalid Groq API Key"

**Solution:**
1. Verify your key is correct from https://console.groq.com/
2. Make sure you generated an API key (not just viewing dashboard)
3. Check for copy-paste errors (extra spaces, missing characters)

### Error: "MongoDB Connection Error"

**Solution:**
1. Check your MongoDB connection string is correct
2. Make sure your IP is whitelisted in MongoDB Atlas (Settings → Network Access)
3. Verify username/password are correct

### Frontend shows "Cannot connect to server. Make sure the backend is running on port 5000"

**Solution:**
1. Verify backend is running (`npm run dev` in server folder)
2. Check that backend is on port 5000 (not 3000 or another port)
3. Check CORS is enabled in `server/server.js`

## 📱 Mobile Responsiveness

The app is **fully responsive** and works on:
- 📱 Mobile phones (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktop (1024px and up)

Test on mobile:
- Use browser dev tools (F12) → Toggle device toolbar (Ctrl+Shift+M)
- Or open http://localhost:5173 on your phone (if on same network)

## 🌐 Deployment

### Deploy Frontend to Vercel

```bash
cd client
npm run build
# Then connect your GitHub repo to Vercel
```

### Deploy Backend to Render

1. Push your code to GitHub
2. Connect repo to Render
3. Set environment variables in Render dashboard:
   - `GROQ_API_KEY=your_key`
   - `MONGO_URI=your_uri`
   - `JWT_SECRET=your_secret`
   - `CLIENT_URL=https://your-vercel-domain.vercel.app`
4. Render will deploy automatically

## 💡 Tips

- **Keep `.env` secret** – Never commit it to GitHub (it's in `.gitignore`)
- **Free tier limits** – Groq free tier has rate limits, but enough for development
- **MongoDB** – Free tier supports 512MB storage, which is enough for testing
- **Build for production** – Run `npm run build` before deployment

## 📞 Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Look in the console (browser dev tools or terminal)
3. Verify all environment variables are set correctly
4. Make sure all ports (5000, 5173) are available

Good luck! 🚀