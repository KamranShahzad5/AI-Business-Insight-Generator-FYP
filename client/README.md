# Insightify — AI Business Plan Generator (MERN + Gemini)

## 🔧 Fixes Applied

### Problem 1: Plan generation failed (API key error)
- **Root cause**: `GEMINI_API_KEY` was set in `backend/.env` but the backend was using model `gemini-1.5-flash` which may have quota issues, AND the `.env` was missing `JWT_SECRET` (auth broke silently).
- **Fix**: Updated model to `gemini-2.0-flash` (stable, free tier). Added `JWT_SECRET` to `.env`. Added friendly error messages for invalid/quota-exceeded API keys.

### Problem 2: Auth (Login / Register) was not hitting the backend
- **Root cause**: `Login.jsx` and `Register.jsx` were using local `localStorage`-based simulation instead of calling `POST /api/auth/login` and `POST /api/auth/register`.
- **Fix**: Both pages now call the real backend endpoints via `api.login()` and `api.register()`.

### Problem 3: Frontend couldn't reach the backend
- **Root cause**: No `VITE_API_URL` set in the frontend root `.env`.
- **Fix**: Added `FYP/.env` with `VITE_API_URL=http://localhost:5000/api`.

### Problem 4: Plans were stored only in localStorage, not MongoDB
- **Root cause**: `AppContext.jsx` used local simulation for register/login and never called `api.addPlan()`.
- **Fix**: `AppContext.jsx` now calls real backend for auth and syncs plans to MongoDB, with localStorage as a graceful fallback.

### Problem 5: Gemini JSON parsing was fragile
- **Fix**: Improved `cleanJSON()` helper in `backend/routes/ai.js` to strip markdown fences reliably. Added validation for incomplete AI responses.

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`) OR MongoDB Atlas URI
- A **Google Gemini API key** from https://aistudio.google.com/app/apikey

---

### Step 1: Backend Setup

```bash
cd backend
npm install

# Edit backend/.env and set your keys:
# GEMINI_API_KEY=your_real_key_here
# JWT_SECRET=any_random_secret_string
# MONGO_URI=mongodb://localhost:27017/fyp_db
# PORT=5000

npm start
# or for development with auto-reload:
npx nodemon server.js
```

You should see:
```
✅ Gemini API key loaded.
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

---

### Step 2: Frontend Setup

```bash
# From the project root (FYP/)
npm install

# The .env file should already have:
# VITE_API_URL=http://localhost:5000/api

npm run dev
```

Open http://localhost:5173

---

### Step 3: Verify Everything Works

1. Visit http://localhost:5000/api/health — should show `{"status":"ok","geminiKeySet":true,...}`
2. Register a new account
3. Click "New Plan", describe your idea, click Generate
4. The plan should generate in 5–10 seconds using Gemini

---

## 📁 Project Structure

```
FYP/
├── backend/                  # Node.js + Express API
│   ├── .env                  # ⚠️ Set your keys here
│   ├── server.js             # Entry point
│   ├── routes/
│   │   ├── ai.js             # POST /api/ai/generate, /api/ai/chat
│   │   ├── auth.js           # POST /api/auth/register, /login
│   │   └── plans.js          # CRUD /api/plans
│   ├── models/
│   │   ├── User.js
│   │   └── Plan.js
│   └── middleware/
│       └── auth.js           # JWT verification
├── src/                      # React frontend
│   ├── .env                  # VITE_API_URL=http://localhost:5000/api
│   ├── pages/
│   │   ├── NewPlan.jsx       # Plan creation form
│   │   ├── PlanView.jsx      # Plan detail view
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx         # ✅ Fixed: calls real backend
│   │   └── Register.jsx      # ✅ Fixed: calls real backend
│   ├── utils/
│   │   ├── api.js            # ✅ Fixed: all fetch calls to backend
│   │   └── aiEngine.js       # ✅ Fixed: generateFullPlan → backend only
│   └── context/
│       └── AppContext.jsx    # ✅ Fixed: async auth + plan sync
└── package.json
```

---

## 🔑 Getting a Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into `backend/.env` as `GEMINI_API_KEY=...`

The free tier supports ~60 requests/minute on `gemini-2.0-flash`.

---

## ❓ Common Errors

| Error | Fix |
|-------|-----|
| `Your Gemini API key is invalid` | Get a new key from aistudio.google.com |
| `Gemini API quota exceeded` | Wait 1 minute or check billing at console.cloud.google.com |
| `Cannot connect to server` | Make sure `npm start` is running in the `backend/` folder |
| `MongoDB connection error` | Run `mongod` locally or set a MongoDB Atlas URI in `backend/.env` |
| `Token is not valid` | Clear localStorage and log in again |

---

## 🆕 New Features Added

### Feature 1: Market Research Tab (AI + Google Search)
Each business plan now has a **Market Research** tab that pulls real-time data:
- **Market Size** — current size, 5-year projection, CAGR, data source
- **Industry Trends** — 4 live trends with direction (up/down) and impact
- **Competitor Analysis** — 4-5 real competitors with strengths, weaknesses, market share
- **Target Audience** — segment, age range, location, pain points, buying behavior
- **SWOT Analysis** — Strengths, Weaknesses, Opportunities, Threats
- **Entry Barriers** — with strategy to overcome each
- **Regulatory Notes** — compliance requirements for the industry

**How it works:** Uses Gemini 2.0 Flash with Google Search grounding to fetch real market data.

**New file:** `src/components/plan/MarketResearchTab.jsx`
**New backend route:** `backend/routes/market.js` → `POST /api/market/research`
**Added to:** `backend/server.js`, `src/utils/api.js`, `src/pages/PlanView.jsx`

---

### Feature 2: Analytics Dashboard Tab
Each business plan now has an **Analytics** tab with:
- **4 KPI Cards** — Task completion rate, High-risk count, Startup cost, Monthly burn
- **Revenue vs Cost Projection** — Line chart across 3 years
- **Startup Cost Breakdown** — Bar chart by category
- **Monthly Cost Distribution** — Doughnut chart
- **Task Status** — Doughnut (Todo / In Progress / Completed)
- **Tasks by Priority** — Bar chart (High / Medium / Low)
- **Risk Severity Distribution** — Doughnut + detailed list
- **Revenue Milestones** — Year 1, 2, 3 targets

**New file:** `src/components/plan/AnalyticsDashboard.jsx`
**Added to:** `src/pages/PlanView.jsx`
