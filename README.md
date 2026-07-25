# OceanInsight

**OceanInsight** is a full-stack marine hazard reporting and monitoring platform. It lets users report ocean hazards — oil spills, water pollution, plastic debris, and marine alerts — with photo evidence and geolocation, while admins review and approve reports before they go live on a real-time interactive map and analytics dashboard.

---

## Features

- **JWT Authentication** — secure register/login with role-based access (`user` / `admin`)
- **Geospatial Reporting** — submit hazard reports with precise coordinates using MongoDB's `2dsphere` geo-indexing
- **Live Interactive Map** — view approved hazards on a Leaflet-powered tactical map, filterable by type, severity, and radius
- **Hybrid AI Classification** — automatically detects hazard type and severity from the report description, with smart override logic against user input
- **Real-Time Updates** — Socket.IO powers instant admin notifications for new reports and live map updates when reports are approved
- **Image Uploads** — report photos are uploaded and hosted via Cloudinary
- **Admin Dashboard** — approve, reject, or permanently delete pending reports
- **Analytics** — stats on total reports, breakdown by hazard type/severity, and report volume over time (via Chart.js)

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS 4
- React Router
- Leaflet / React-Leaflet (maps)
- Chart.js / react-chartjs-2 (analytics)
- Axios
- Socket.IO Client

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose (with 2dsphere geospatial indexing)
- Socket.IO
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- Multer + Cloudinary for image uploads

---

## Project Structure

```
OceanInsight/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components (Map, Sidebar, Modals, etc.)
│       ├── context/         # Auth context/provider
│       ├── pages/           # Route-level pages (Landing, Login, Dashboard, Admin, etc.)
│       └── api.js           # Axios instance & API config
└── server/                  # Express backend
    ├── config/               # DB & Cloudinary configuration
    ├── controllers/          # Route logic (auth, reports, admin)
    ├── middleware/           # Auth & upload middleware
    ├── models/               # Mongoose schemas (User, Report)
    ├── routes/                # API route definitions
    └── server.js              # App entry point
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local instance or MongoDB Atlas)
- A [Cloudinary](https://cloudinary.com/) account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/<bhairvi12>/OceanInsight.git
cd OceanInsight
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/` with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev   # or: node server.js
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

Create a `.env` file inside `client/` with:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```
## Roadmap Ideas
- [ ] Push notifications for nearby hazards
- [ ] Report verification via multiple user confirmations
- [ ] Public API for research/NGO integrations
- [ ] Mobile app version

