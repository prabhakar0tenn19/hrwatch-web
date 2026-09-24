# HRWatch 2.0 Web Portal — Architecture & System Context

---

## 1. Overview
`hrwatch-web` is the enterprise front-end portal for **HRWatch 2.0 (CG Infinity Attendance Intelligence)**. It provides HR administrators and executives with real-time visibility into weekly WFO compliance, biometric punch logs, leave approvals, policy versioning, and attendance exceptions.

---

## 2. Technology Stack
- **Framework:** Next.js 14.2 (App Router)
- **Language:** TypeScript 5
- **UI & Styling:** Tailwind CSS 3.4, Lucide React Icons
- **HTTP Client:** Native `fetch` with typed DTO responses and automatic JWT Bearer token injection
- **Design System:** CG-1 Enterprise Theme (Amber `#F59E0B`, Warm light cream `#FAF8F5`, Clean Slate `#0F172A`)

---

## 3. Authentication & Route Protection
- **Login Route:** `/login`
  - Minimal, corporate login screen with CG Infinity branding.
  - Authenticates against backend `POST /api/auth/login`.
  - Stores JWT token in `localStorage.getItem('hrwatch_token')` and user profile in `hrwatch_user`.
- **Application Shell (`src/components/layout/AppShell.tsx`):**
  - Acts as client-side route guard: redirects unauthenticated users to `/login`.
  - Automatically isolates `/login` from the standard layout (hides header and sidebar on login screen).
- **Header (`src/components/layout/Header.tsx`):**
  - Displays authenticated Admin initials, username, and role.
  - Includes a one-click **Sign Out** button that clears localStorage and returns to `/login`.
- **API Client (`src/lib/api.ts`):**
  - Attaches `Authorization: Bearer <token>` to all requests if a token exists in `localStorage`.

---

## 4. Feature Pages & Modules

| Route | Module Name | Key Features |
|---|---|---|
| `/` | **Weekly Violators Dashboard** | 4-week compliance history accordions, Top 5 Shortfall Employees widget, filter by role/search. |
| `/calendar` | **Attendance Calendar** | Full monthly grid view showing daily status badges (`P`, `H`, `L`, `W`, `E`, `A`, `WO`), in-punch times. |
| `/employees` | **Master Directory** | Searchable employee roster, deployment tags, probation status, slide-over detail drawer. |
| `/exceptions` | **Exceptions Management** | Active/Archived override list, Add Exception modal with date-range picker, Real-time KPI stats (Active Overrides, Total Logged, Revoked/Expired). |
| `/policies` | **Policies & Rules** | Active WFO quota inspection (Probation, SDE, Manager, Bench), version audit history, "Create New Version" workflow. |
| `/admin` | **Admin Tools** | Manual Employee Master Sync, Daily Attendance Evaluation, Range Evaluation triggers. |

---

## 5. Environment Variables & Production Build

### 5.1 Environment Variable
```bash
NEXT_PUBLIC_API_URL=https://<your-backend-azure-domain>/api
```
- In local development, falls back to `http://localhost:5101/api`.
- In production (Vercel, Azure Static Web Apps, or Azure App Service), `NEXT_PUBLIC_API_URL` must be set in the build environment before running `npm run build`.

### 5.2 Build Command
```bash
npm run build
npm run start
```
- Fully type-checked, optimized static routes (`/`, `/login`, `/calendar`, `/employees`, `/exceptions`, `/policies`, `/admin`).
