# Insightify – AI Business Plan Generator

A full-stack AI-powered application that generates comprehensive business plans, financial forecasts, and risk analyses in seconds.

## 🚀 Features

- **AI Business Plan Generation** – Powered by Groq API (Llama 3.1 8B)
- **Smart Task Breakdown** – Auto-generated prioritized task lists
- **Cost Estimation** – Visual cost breakdowns with financial projections
- **Risk Analysis** – Severity-rated risks with mitigation strategies
- **AI Chat Assistant** – Ask anything about your business plan
- **Financial Insights** – Interactive Chart.js visualizations
- **Mobile Responsive** – Works perfectly on all devices

## 📋 Setup Instructions

### 1. Get Your Groq API Key

- Visit [console.groq.com](https://console.groq.com/)
- Sign up or log in (free tier available)
- Generate an API key
- Save it for backend setup

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/insightify
GROQ_API_KEY=your_actual_groq_api_key_here
JWT_SECRET=your_secret_jwt_key_change_in_production
CLIENT_URL=http://localhost:5173
```

**Important:** 
- Replace `GROQ_API_KEY` with your actual key from console.groq.com
- Replace `MONGO_URI` with your MongoDB Atlas connection string
- Generate a secure `JWT_SECRET` (use a random string)

Start the backend:
```bash
npm run dev
```

The backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`

## 🌐 Mobile Responsiveness

The application is fully responsive with:
- Tailwind CSS for responsive design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Viewport meta tag configured
- Touch-friendly UI components

## 🏗️ Architecture

```
insightify/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/         # Landing, Login, Register, Dashboard, NewPlan, PlanView
│   │   ├── components/    # Reusable components
│   │   ├── context/       # AppContext for state management
│   │   └── utils/         # Utilities
│   └── package.json
├── server/                 # Express.js backend
│   ├── routes/            # API routes (auth, plans, ai, market)
│   ├── models/            # MongoDB schemas
│   ├── middleware/        # Auth middleware
│   └── package.json
└── README.md
```

## 🔧 Tech Stack

**Frontend:**
- React 19
- Vite (fast bundler)
- TailwindCSS (styling)
- Framer Motion (animations)
- React Router (routing)
- React Hot Toast (notifications)
- Chart.js (data visualization)

**Backend:**
- Express.js (server)
- MongoDB + Mongoose (database)
- Groq API (AI generation)
- JWT (authentication)

## 🚨 Troubleshooting

### "GROQ_API_KEY is missing" error
- Ensure you have a `.env` file in the `server/` folder
- Add your actual Groq API key from https://console.groq.com/

### Backend won't start
- Check if MongoDB URI is correct
- Ensure all environment variables are set in `.env`
- Run `npm install` to install dependencies

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS origin in `server/server.js`
- Frontend should be on `http://localhost:5173`

## 📦 Deployment

**Frontend:** Deploy to Vercel
```bash
npm run build
# Deploy the dist/ folder to Vercel
```

**Backend:** Deploy to Render or Vercel Serverless
- Set environment variables in deployment platform
- Ensure MongoDB Atlas is configured for your IP

## 📝 License

MIT