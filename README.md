# AI-Solutions Web Application
### CET333 Product Development — Computer Systems Engineering

A full-stack web application for AI-Solutions, a fictitious start-up company, built using the MERN stack with SQLite as the database (instead of MongoDB).

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts, React Icons, React Toastify |
| Backend | Node.js, Express.js |
| Database | SQLite (via sql.js — no native compilation needed) |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Validation | express-validator |

---

## Features

### Public Website
- **Home Page** — Hero section, solutions preview, stats, testimonials, CTA
- **Solutions Page** — All 6 AI software solutions with industry tags
- **Case Studies Page** — Past client solutions with filterable industry tags, outcomes
- **Articles Page** — Blog articles with category filtering; full article detail view
- **Events Page** — Upcoming and past promotional events
- **Gallery Page** — Photo gallery with lightbox and event filtering
- **Contact Us Page** — Full contact form (name, email, phone, company, country, job title, job details) — no login required

### Admin Portal (Password Protected)
- Secure login at `/admin/login`
- **Overview Tab** — Stats cards (total inquiries, countries, companies, this month)
- **Enquiries Tab** — Full table of all submissions with view/delete per row
- **Analytics Tab** — Bar chart (by month), Pie chart (by country), Bar chart (top companies), Country breakdown table

---

## Installation & Setup

### Prerequisites
- Node.js v18+ (tested on v18.x and v22.x)
- npm v8+

### Step 1 — Clone / Extract Project
```bash
cd ai-solutions
```

### Step 2 — Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### Step 3 — Run the Application

**Terminal 1 — Backend API:**
```bash
cd backend
node server.js
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend Dev Server:**
```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

### Step 4 — Access the Application

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Main public website |
| http://localhost:3000/admin/login | Admin login |
| http://localhost:5000/api/health | API health check |

### Admin Credentials
- **Username:** `admin`
- **Password:** `Admin@123`

---

## Project Structure

```
ai-solutions/
├── backend/
│   ├── config/
│   │   └── database.js       # SQLite init, seed data, query helpers
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js           # POST /api/auth/login
│   │   ├── inquiries.js      # Contact form + admin CRUD
│   │   ├── solutions.js      # Software solutions + past solutions
│   │   ├── testimonials.js   # Client testimonials
│   │   ├── articles.js       # Blog articles
│   │   ├── events.js         # Events (upcoming/past)
│   │   └── gallery.js        # Photo gallery
│   ├── data/
│   │   └── aisolutions.db    # SQLite database (auto-created)
│   ├── .env                  # Environment variables
│   └── server.js             # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.js
    │   │   │   └── Footer.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js  # JWT auth state
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── SolutionsPage.js
    │   │   ├── CaseStudiesPage.js
    │   │   ├── ArticlesPage.js
    │   │   ├── ArticleDetailPage.js
    │   │   ├── EventsPage.js
    │   │   ├── GalleryPage.js
    │   │   ├── ContactPage.js
    │   │   └── admin/
    │   │       ├── AdminLoginPage.js
    │   │       └── AdminDashboard.js
    │   ├── styles/
    │   │   └── global.css
    │   └── utils/
    │       └── api.js          # Axios instance with interceptors
    └── public/
        └── index.html
```

---

## API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/solutions | All software solutions |
| GET | /api/solutions/past | Past client solutions |
| GET | /api/testimonials | Client testimonials |
| GET | /api/articles | All articles |
| GET | /api/articles/:id | Single article |
| GET | /api/events | All events |
| GET | /api/gallery | Gallery images |
| POST | /api/inquiries | Submit contact form |
| POST | /api/auth/login | Admin login |

### Protected Admin Endpoints (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/inquiries | All inquiries + analytics stats |
| GET | /api/inquiries/:id | Single inquiry |
| DELETE | /api/inquiries/:id | Delete inquiry |

---

## Database Schema

### Tables
- **inquiries** — Contact form submissions (id, name, email, phone, company_name, country, job_title, job_details, created_at)
- **admin_users** — Admin accounts with bcrypt-hashed passwords
- **solutions** — AI software solutions
- **past_solutions** — Historical client case studies
- **testimonials** — Client feedback with star ratings
- **articles** — Blog/promotional articles
- **events** — Upcoming and past events
- **gallery** — Photo gallery entries

---

## Notes
- The database is auto-created and seeded with sample data on first run
- No MongoDB is used — SQLite via sql.js provides a pure JavaScript SQLite implementation
- JWT tokens expire after 8 hours
- All form inputs are validated both client-side and server-side
