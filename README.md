# 🚛 TransitOps — Smart Transport Operations Platform

> A production-style fleet management SaaS built for hackathons. Digitize your transport operations — vehicles, drivers, trips, maintenance, and expenses — all in one place.

---

## 📸 Features at a Glance

| Module | Features |
|---|---|
| 🚗 Vehicles | Add, edit, delete vehicles with capacity, mileage, fuel type tracking |
| 👤 Drivers | Manage drivers with license expiry alerts and status tracking |
| 🗺️ Trips | Full trip lifecycle with cargo-capacity-based vehicle filtering |
| 🔧 Maintenance | Schedule and track maintenance, auto vehicle status updates |
| 💰 Finance | Fuel logs and expense tracking in INR (₹) |
| 📊 Reports | Vehicle ROI, fuel efficiency, operational cost with CSV export |
| 🤖 AI Assistant | OpenAI-powered fleet insights with rule-based fallback |
| 🔐 Auth | JWT authentication with role-based access control (RBAC) |
| 🌗 Theme | Dark mode & Light mode toggle |
| 🇮🇳 Language | English & Hindi (हिंदी) language support |

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [Axios](https://axios-http.com/) | HTTP client |
| [Recharts](https://recharts.org/) | Charts & data visualization |
| [Lucide React](https://lucide.dev/) | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | Runtime environment |
| [Express.js](https://expressjs.com/) | REST API framework |
| [Supabase](https://supabase.com/) | PostgreSQL database & hosting |
| [JWT](https://jwt.io/) | Authentication tokens |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [OpenAI API](https://openai.com/) | AI assistant (GPT-3.5) |

### Deployment
| Service | Purpose |
|---|---|
| [Vercel](https://vercel.com/) | Frontend hosting |
| [Render](https://render.com/) / [Railway](https://railway.app/) | Backend hosting |
| [Supabase](https://supabase.com/) | Database hosting |

---

## 🏗️ Project Structure

```
transitops/
├── frontend/                   # React + Vite app
│   └── src/
│       ├── components/ui/      # Reusable UI components (Button, Card, Modal, Table...)
│       ├── pages/              # Page components (Dashboard, Vehicles, Trips...)
│       ├── layouts/            # AppLayout, Sidebar
│       ├── services/           # Axios API service layer
│       └── hooks/              # useAuth, useSettings (theme + language)
│
└── backend/                    # Express API
    ├── schema.sql              # Supabase database schema
    ├── add_capacity.sql        # Migration: vehicle capacity column
    ├── add_cargo_weight.sql    # Migration: trip cargo weight column
    └── src/
        ├── controllers/        # Business logic (auth, vehicles, drivers, trips...)
        ├── routes/             # Express route definitions
        ├── middleware/         # JWT auth & RBAC middleware
        └── config/             # Supabase client config
```

---

## 👥 User Roles (RBAC)

| Role | Access |
|---|---|
| **Fleet Manager** | Vehicles, Maintenance, Analytics, Reports |
| **Dispatcher** | Trips management |
| **Safety Officer** | Drivers, License monitoring |
| **Financial Analyst** | Finance, Fuel logs, Expenses, Reports |

---

## ⚙️ Business Rules

### Vehicle Rules
- Registration number must be unique
- Only `Active` vehicles can be assigned to trips
- Vehicles in `Maintenance` or `Out of Service` are blocked from trips
- Creating a maintenance record sets vehicle → `Maintenance`
- Completing maintenance sets vehicle → `Active`

### Driver Rules
- Expired license drivers cannot be dispatched
- `Suspended` or `Inactive` drivers cannot be assigned
- Phone number must be exactly 10 digits (numeric only)

### Trip Rules
- Vehicle is filtered by cargo weight vs vehicle capacity
- On dispatch: vehicle → `Out of Service`, driver → `Inactive`
- On complete/cancel: vehicle → `Active`, driver → `Active`

---

## 🚀 Setup & Installation

### 1. Database (Supabase)
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `backend/schema.sql`
3. Also run `backend/add_capacity.sql` and `backend/add_cargo_weight.sql`
4. Copy your **Project URL** and **Service Role Key**

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
```env
PORT=3000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_random_secret
OPENAI_API_KEY=sk-...        # Optional — fallback works without it
```

```bash
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
```

Fill in `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy via Vercel CLI or connect GitHub repo on vercel.com
# Set VITE_API_URL to your backend URL in Vercel environment variables
```

### Backend → Render / Railway
- Set root directory to `backend/`
- Start command: `npm start`
- Add all environment variables from `.env`

---

## 🤖 AI Assistant

The AI Assistant analyzes your live fleet data and answers questions like:
- *"Which vehicles need maintenance?"*
- *"Which vehicles have high fuel consumption?"*
- *"How can I reduce operational costs?"*
- *"Which drivers have safety risks?"*

Uses **OpenAI GPT-3.5** with a **rule-based fallback** when the API key is not configured.

---

## 📊 Reports & Analytics

- Monthly fuel cost trend chart
- Per-vehicle performance table:
  - Completed trips count
  - Total distance covered
  - Fuel cost (₹)
  - Maintenance cost (₹)
  - Operational cost (₹)
  - Fuel efficiency (km/L)
  - ROI %
- **CSV Export** of full fleet performance report

---

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET/POST | `/api/vehicles` | List / Create vehicles |
| PUT/DELETE | `/api/vehicles/:id` | Update / Delete vehicle |
| GET/POST | `/api/drivers` | List / Create drivers |
| PUT/DELETE | `/api/drivers/:id` | Update / Delete driver |
| GET/POST | `/api/trips` | List / Create trips |
| PUT | `/api/trips/:id/status` | Update trip status |
| GET/POST | `/api/maintenance` | List / Create maintenance |
| PUT | `/api/maintenance/:id/status` | Update maintenance status |
| GET/POST | `/api/fuel` | Fuel logs |
| GET/POST | `/api/expenses` | Expenses |
| GET | `/api/analytics` | Dashboard stats |
| POST | `/api/ai/chat` | AI assistant chat |

---

## 📄 License

MIT License — free to use for hackathons, demos, and learning projects.

---

<p align="center">Built with ❤️ for hackathons</p>
