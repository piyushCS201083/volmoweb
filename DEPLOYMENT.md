# Volmo Electric - Full Architecture & Deployment Guide

This project has been architected and divided cleanly into **Front-End** and **Back-End** modules. This separation dramatically improves security, prevents credential exposure, allows real-time data persistence, and enables independent scaling and deployment forever.

---

## 🏗️ Architecture Overview

```
├── server/                     # BACK-END (Dedicated Node.js & Express API)
│   ├── config.ts               # Environment configuration (Port, Host, CORS, Data Dir)
│   ├── storage.ts              # Persistent file/database storage layer
│   ├── app.ts                  # Express application factory with security headers & CORS
│   ├── routes/
│   │   ├── auth.ts             # Server-side auth, password check, security questions
│   │   ├── leads.ts            # Price inquiries & Dealership applications CRUD
│   │   ├── config.ts           # Dynamic CMS site configuration
│   │   ├── health.ts           # Server uptime & health check endpoint
│   │   └── index.ts            # Consolidated API router (/api/*)
│   ├── data/                   # Persistent data store (site-config.json, leads.json, auth.json)
│   ├── package.json            # Standalone package.json for independent backend deployment
│   └── README.md               # Backend API documentation
│
├── src/                        # FRONT-END (React 19 + TypeScript + Vite + Tailwind CSS)
│   ├── services/
│   │   └── api.ts              # Resilient frontend API client (supports VITE_API_URL or relative /api)
│   ├── SiteConfigContext.tsx   # React context with bidirectional backend real-time synchronization
│   ├── components/             # UI Components (Fleet, Accessories, Battery/Chargers, Modals)
│   │   ├── AdminPortal.tsx     # Admin Console connected to /api/auth, /api/leads, and /api/config
│   │   ├── DealershipModal.tsx # Dealership application form connected to /api/leads/dealers
│   │   └── PriceInquiryModal.tsx # Price quotation modal connected to /api/leads/inquiries
│   └── ...
│
├── server.ts                   # Unified Full-Stack Runner (Runs Express + Vite middleware in Dev)
├── package.json                # Project root package configuration
└── DEPLOYMENT.md               # This deployment guide
```

---

## 🔒 Security & Persistence Benefits

1. **Zero Credential Leaks**: Administrator login passwords and founder security verification logic now execute on the **backend server** (`/api/auth`), preventing any exposure in client-side bundles or inspect tools.
2. **Real-Time Data Persistence Forever**: Scooter specifications, accessories, battery/charger catalogs, customer price inquiries, and dealership applications are saved in backend storage, ensuring they persist across browsers, devices, and sessions forever.
3. **Resilient Offline Fallback**: The frontend API client (`src/services/api.ts`) includes optimistic caching: data loads instantaneously from cache and syncs seamlessly when connected to the backend.
4. **CORS Protected**: The backend API has configurable CORS (`CORS_ORIGIN`), allowing you to host the frontend on any domain (e.g. Vercel, Netlify) while keeping your backend secure.

---

## 🚀 Option 1: Unified Full-Stack Deployment (Recommended for AI Studio)

In this mode, Express powers the backend API under `/api/*` and also serves the frontend Single Page Application (SPA).

### Development:
```bash
npm run dev
```
Runs `server.ts` with `tsx`, mounting Vite in middleware mode on port 3000.

### Production Build & Run:
```bash
npm run build
npm start
```
`npm run build` compiles frontend assets to `dist/`, and `npm start` (runs `tsx server.ts`) starts Express, serving the production build and API endpoints simultaneously.

---

## 🌐 Option 2: Deploying Frontend & Backend Separately

You can deploy the Front-End and Back-End to two completely different hosting providers (e.g., Frontend on **Vercel / Netlify / Cloudflare Pages** and Backend on **Render / Railway / Cloud Run / VPS**).

### A. Deploying the Backend Separately on Render (Web Service)

1. In Render, create a new **Web Service** connected to your repository (`piyushCS201083/volmoweb`).
2. Configure settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `npx tsx server.ts`)
   - **Environment Variables**:
     - `NODE_VERSION`: `20` or `22` or `24`
     - `CORS_ORIGIN`: `*` (or your frontend Vercel/Netlify URL)
     - `ADMIN_PASSWORD`: Your custom admin password
3. Render will now start the server smoothly without any missing module errors!

2. Once deployed, note your backend URL:
   `https://volmoweb-1.onrender.com`

### B. Deploying the Frontend Separately on Vercel (Vite SPA)

> ⚠️ **CRITICAL: Vercel Settings Configuration**
> 1. **Root Directory**: Leave blank or set to `./` (the repository root). Do **NOT** set it to `src`.
> 2. **Build & Development Settings**:
>    - **Framework Preset**: Select **Vite**
>    - **Build Command**: `npm run build` (or leave default, controlled by `vercel.json`)
>    - **Output Directory**: `dist`
>    - **Install Command**: `npm install` (controlled by `vercel.json`)

1. In Vercel, import your repository: `piyushCS201083/volmoweb`
2. In the **Configure Project** (or **Settings > General > Build & Development Settings**) screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (default root)
   - **Environment Variables**:
     - `VITE_API_URL`: `https://volmoweb-1.onrender.com` (Your deployed Render backend URL)

3. **Vercel Automation (`vercel.json` & `package.json`)**:
   - `package.json` includes both `"build": "vite build"` and `"vercel-build": "vite build"`.
   - `vercel.json` explicitly defines `"installCommand": "npm install"`, `"buildCommand": "npm run build"`, and `"outputDirectory": "dist"`.
   - Automatically handles single-page app (SPA) URL rewrites to `/index.html`.
   - Reverse-proxies `/api/*` requests directly to `https://volmoweb-1.onrender.com/api/$1`.

4. Click **Deploy** (or **Redeploy**). Your frontend will build and go live smoothly!

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | System health & uptime check |
| `/api/auth/login` | POST | Authenticates admin credentials securely |
| `/api/auth/verify-security` | POST | Validates founder security question |
| `/api/auth/reset-password` | POST | Resets password on backend |
| `/api/auth/change-password` | POST | Changes admin password |
| `/api/leads/inquiries` | GET / POST | List or submit customer scooter price inquiries |
| `/api/leads/inquiries/:id` | PATCH / DELETE | Update status or delete price inquiry |
| `/api/leads/dealers` | GET / POST | List or submit dealership franchise applications |
| `/api/leads/dealers/:id` | PATCH / DELETE | Update status or delete dealership application |
| `/api/config` | GET / PUT | Fetch or replace complete site configuration |
| `/api/config/:section` | PATCH | Update a specific CMS section (accessories, batteries, models, etc.) |
| `/api/config/reset` | POST | Restore factory default specifications |
