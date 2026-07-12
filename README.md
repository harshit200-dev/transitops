# TransitOps — Smart Transport Operations Platform

A production-style fleet management SaaS built for hackathons.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Recharts
- **Backend**: Node.js + Express.js
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT + bcrypt
- **AI**: OpenAI GPT-3.5

## Project Structure
```
transitops/
├── frontend/          # React + Vite app
└── backend/           # Express API
```

## Setup

### 1. Database (Supabase)
1. Create a project at [supabase.com](https://supabase.com)
2. Run `backend/schema.sql` in the Supabase SQL Editor
3. Copy your Project URL and Service Role Key

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_KEY, JWT_SECRET, OPENAI_API_KEY
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

## Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy via Vercel CLI or GitHub integration
```

### Backend → Render / Railway
- Set root directory to `backend/`
- Start command: `npm start`
- Add all environment variables

## User Roles
| Role | Permissions |
|------|-------------|
| Fleet Manager | Vehicles, Maintenance, Analytics |
| Dispatcher | Trips |
| Safety Officer | Drivers |
| Financial Analyst | Finance, Reports |

## Features
- ✅ Vehicle management with status tracking
- ✅ Driver management with license expiry alerts
- ✅ Trip lifecycle (Draft → Dispatched → Completed)
- ✅ Full business rule validation on dispatch
- ✅ Maintenance tracking with auto vehicle status
- ✅ Fuel logs & expense tracking
- ✅ Analytics dashboard with charts
- ✅ Vehicle ROI & performance reports
- ✅ CSV export
- ✅ AI Assistant (OpenAI + rule-based fallback)
- ✅ JWT authentication with RBAC
- ✅ Dark mode UI
