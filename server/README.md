# Volmo Electric - Backend API Service

This is the dedicated backend server for **Volmo Electric**. It separates critical business logic, lead management, CMS configurations, and administrative authentication away from the frontend client to provide improved security and real-time data persistence.

## Features

1. **Security & Authentication (`/api/auth`)**:
   - `POST /api/auth/login`: Server-side admin verification with session tokens. No passwords exposed in client JavaScript!
   - `POST /api/auth/verify-security`: Founder security question validation executed on the backend.
   - `POST /api/auth/reset-password`: Server-side password reset and token issuance.
   - `POST /api/auth/change-password`: Admin password update stored securely.

2. **Lead Management & Email Notifications (`/api/leads`)**:
   - `GET /api/leads/inquiries`: Fetch all customer scooter price inquiries with search & status filter.
   - `POST /api/leads/inquiries`: Customer submits a customized scooter lead. Dispatches instant email notification to `piyushshivhare083@gmail.com`.
   - `PATCH /api/leads/inquiries/:id`: Update inquiry status (`new`, `contacted`, `completed`).
   - `DELETE /api/leads/inquiries/:id`: Remove inquiry.
   - `GET /api/leads/dealers`: Fetch all partner dealership applications.
   - `POST /api/leads/dealers`: Customer submits dealership application. Dispatches instant email notification to `piyushshivhare083@gmail.com`.
   - `PATCH /api/leads/dealers/:id`: Update dealership application status.
   - `DELETE /api/leads/dealers/:id`: Remove dealership application.
   - `GET /api/leads/email-logs`: Review real-time delivery logs for lead notifications.

3. **CMS & Site Configuration (`/api/config`)**:
   - `GET /api/config`: Real-time retrieval of all fleet models, accessories, battery & charger specs, hero banners, testimonials, FAQs, and showrooms.
   - `PUT /api/config`: Persist complete site changes forever.
   - `PATCH /api/config/:section`: Real-time patch of specific sections (e.g., `accessories`, `leadAcidBatteries`, `chargers`, `models`).
   - `POST /api/config/reset`: Reset to factory defaults.

4. **Health Check (`/api/health`)**:
   - `GET /api/health`: Uptime, service health, and API version.

## Running Backend Separately

To run the backend independently on its own server or container:

```bash
cd server
npm install
npm run dev # or npm start
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port for the backend server |
| `HOST` | `0.0.0.0` | Host interface |
| `CORS_ORIGIN` | `*` | Allowed frontend origin (e.g. `https://volmoelectric.com`) |
| `DATA_DIR` | `./data` | Directory where persistent JSON files are stored |
| `ADMIN_PASSWORD` | `1234` | Initial admin password fallback |
| `STANDALONE_BACKEND` | `false` | Set to `true` when running purely as an API server without serving frontend assets |

## Frontend Integration

When deploying the frontend separately (e.g., on Vercel, Netlify, or Cloudflare Pages), point the frontend to this backend using the environment variable:

```env
VITE_API_URL=https://your-backend-api-domain.com
```
