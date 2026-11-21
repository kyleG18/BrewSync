# BrewSync POS & Inventory System

Point of Sale and inventory management web application built with React, Vite, Bootstrap 5, Express.js, MySQL, and Firebase Authentication.

## Project Structure

```text
├── package.json              # Root frontend scripts and dependencies
├── vite.config.js            # Vite config (root: frontend/, outDir: dist/)
├── netlify.toml              # Netlify build & SPA redirect rules
├── backend/
│   ├── package.json
│   ├── server.js             # Express REST API + RBAC middleware
│   ├── db.js                 # MySQL connection pool (mysql2)
│   ├── middleware/auth.js    # Firebase Admin token & role verification
│   ├── database_setup.sql    # MySQL schema & seed records
│   └── .env.example
└── frontend/
    ├── .env.example
    ├── public/               # PWA manifest, service worker (sw.js), icons, offline.html
    ├── index.html            # React SPA entry
    ├── pos.html              # POS register terminal
    ├── orders.html           # Order history
    ├── products.html         # Product catalog
    ├── reports.html          # Sales & shift reports
    ├── settings.html         # Store settings & backup
    └── src/
        ├── main.jsx
        ├── App.jsx           # React Router + ProtectedRoute setup
        ├── components/       # Navbar, Footer, OfflineBanner, ProtectedRoute, UI
        ├── dashboard/        # Role-based Dashboard
        ├── inventory/        # Inventory CRUD module
        ├── login/            # Login page
        ├── pages/            # ProfilePage, AdminUsersPage, AccessDeniedPage, NotFoundPage
        └── services/         # Firebase client & Firestore RBAC helpers
```

---

## Setup on a New Laptop

### 1. Prerequisites
- **Node.js** (v18 or higher) & **npm**
- **Git**
- **XAMPP / Laragon / MySQL** (optional, for local database testing)

### 2. Clone Repository
Clone either repository to the new laptop:
```bash
# Option A: Rich John Montoya Repo (collaborator repo)
git clone https://github.com/richjohnmontoya-maker/JR-bresync.git
cd JR-bresync

# Option B: Kyle Gacula Repo
git clone https://github.com/kyleG18/BrewSync.git
cd BrewSync
```

### 3. Setting Up with Antigravity
If you are using Google Antigravity on the new laptop:
1. Open Antigravity and select **Open Folder...** -> select the cloned `JR-bresync` or `BrewSync` folder.
2. In the Antigravity chat, you can simply type:
   > *"Please install all frontend and backend dependencies, verify environment configuration, and run the development servers."*
3. Antigravity will automatically inspect the repository, run `npm install` in both root and `backend/`, and launch both servers (`http://localhost:5000` for Express API, `http://localhost:5173` for Vite frontend).

### 4. Manual Setup (Terminal Alternative)
If setting up manually without Antigravity:
```bash
# Install root/frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 5. Environment Configuration
1. **Backend (`backend/.env`):**
   Copy `backend/.env.example` to `backend/.env` and fill in your MySQL and Firebase Admin values:
   ```env
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=brewsync_db
   DB_SSL=false

   FIREBASE_PROJECT_ID=pwa-sample-9c068
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
2. **Frontend (`frontend/.env`):**
   Copy `frontend/.env.example` to `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### 6. Local Database Setup (Optional)
If running MySQL locally via XAMPP or Laragon, import `backend/database_setup.sql` in phpMyAdmin (or HeidiSQL) to create `brewsync_db` and the `inventory_items` table.

### 7. Run Locally & Test Credentials

#### Default Test Credentials:
- **Admin:** `admin@brewsync.com` / `admin123`
- **Staff:** `staff@brewsync.com` / `staff123`
- Alternatively, click **"Continue as Guest / Demo Mode"** on the login screen.
- **Start Backend:**
  ```bash
  cd backend
  npm start
  ```
- **Start Frontend (in a new terminal):**
  ```bash
  npm run dev
  ```
- **Production Build Test:**
  ```bash
  npm run build
  ```

---

## Production Deployment Guide

### 1. Cloud MySQL
Create a MySQL database on **Aiven**, **Railway**, **Clever Cloud**, or **TiDB**, then import `backend/database_setup.sql` (or let `backend/db.js` auto-create `inventory_items` on startup).

### 2. Render (Backend API)
1. Create a new **Web Service** on Render connected to this GitHub repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add environment variables from `backend/.env.example` (`DATABASE_URL` or `DB_*`, `CLIENT_ORIGIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`).
6. Verify the health check endpoint at `https://<your-render-url>/api/health`.

### 3. Netlify (Frontend)
1. Create a new site on Netlify connected to this GitHub repository.
2. Build settings (pre-configured in `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Add Environment Variable in Netlify:
   - `VITE_API_URL` = `https://<your-render-url>`
4. Trigger a redeploy so Vite bundles the production API URL.

### 4. Firebase Console
1. Go to **Firebase Console → Authentication → Settings → Authorized domains** and add your new Netlify domain.
2. Under **Authentication → Sign-in method**, ensure **Google** and **Email/Password** are enabled.
3. User roles (`admin` / `staff`) are stored in Firestore under `users/{uid}` and can be managed from `/admin` when signed in as an admin.
