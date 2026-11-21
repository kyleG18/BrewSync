# 🍵 BrewSync POS & Inventory System — Setup Guide

This guide walks you through setting up and running **BrewSync POS** on any new or secondary laptop (Windows, macOS, or Linux).

---

## 🌐 Live Production Deployments

| Component | Platform | Live URL / Details |
| :--- | :--- | :--- |
| **Frontend (PWA)** | Netlify | [https://jr-bresync.netlify.app](https://jr-bresync.netlify.app) |
| **Backend REST API** | Render | [https://jr-bresync.onrender.com](https://jr-bresync.onrender.com) |
| **Health Check Endpoint** | Render | [https://jr-bresync.onrender.com/api/health](https://jr-bresync.onrender.com/api/health) |
| **Cloud MySQL Database** | TiDB Cloud Serverless | Tokyo Region (`ap-northeast-1`), TLS/SSL Enabled |
| **Authentication & Store** | Firebase | Project: `brewsync-pos-5fa0e` |

---

## 📋 1. Prerequisites

Before starting, install the following software on the new laptop:
1. **Node.js**: Version **18.x, 20.x, or newer** ([Download from nodejs.org](https://nodejs.org/))
   - Verify in terminal: `node -v` and `npm -v`
2. **Git**: ([Download from git-scm.com](https://git-scm.com/))
   - Verify in terminal: `git --version`
3. *(Optional)* **Laragon** or **XAMPP** if you want to run an offline local MySQL database instead of the cloud database.

---

## 🚀 2. Clone the Repository

Open a terminal or command prompt and clone the repository:

```bash
# Option A: Primary collaborator repository
git clone https://github.com/richjohnmontoya-maker/JR-bresync.git
cd JR-bresync

# Option B: Secondary repository mirror
git clone https://github.com/kyleG18/BrewSync.git
cd BrewSync
```

---

## 📦 3. Install Dependencies

Install the required npm packages for both the root frontend and the backend:

```bash
# 1. Install root dependencies (React, Vite, Bootstrap, Firebase SDK)
npm install

# 2. Install backend dependencies (Express, CORS, MySQL2, dotenv)
cd backend
npm install
cd ..
```

---

## ⚙️ 4. Environment Configuration (`.env`)

### Backend Setup:
In the `backend/` directory, create a `.env` file (or copy from `.env.example`):

```bash
# Windows Command Prompt / PowerShell
copy backend\.env.example backend\.env
```

#### Choose Database Mode:

#### Option A: Connect directly to the Cloud TiDB Database (Zero Setup! ✨ Recommended)
The app is already pre-configured to connect directly to the TiDB Cloud Serverless cluster. Your `backend/.env` can simply be:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173,https://jr-bresync.netlify.app
DATABASE_URL=mysql://2xqmJCv16n9tBLT.root:Ef3XarWG7knrqArG@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/test
DB_SSL=true
FIREBASE_PROJECT_ID=brewsync-pos-5fa0e
```

#### Option B: Use Local MySQL (Laragon / XAMPP)
If you prefer running offline without internet:
1. Start MySQL in Laragon or XAMPP.
2. In phpMyAdmin (`http://localhost/phpmyadmin/`), import the file:
   `backend/database_setup.sql`
3. Configure `backend/.env`:
   ```env
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=brewsync_db
   DB_SSL=false
   FIREBASE_PROJECT_ID=brewsync-pos-5fa0e
   ```

---

## 💻 5. Running the Application Locally

### Method A: One-Click Quick Start (Windows)
Double-click the **`start-dev.bat`** file in the root folder.
* It will open two console windows:
  1. Backend running on `http://localhost:5000`
  2. Frontend running on `http://localhost:5173`

---

### Method B: Manual Terminal Start (Windows / Mac / Linux)

Open two separate terminal windows in the project root:

**Terminal 1 — Start the Backend API:**
```bash
npm run start:backend
# Server runs at http://localhost:5000
```
*(Verify backend status at: `http://localhost:5000/api/health`)*

**Terminal 2 — Start the Frontend (Vite):**
```bash
npm run dev
# Vite runs at http://localhost:5173
```

Open your browser to: **`http://localhost:5173`**

---

## 🔑 6. Login Credentials

Use any of these pre-configured station accounts on the login screen:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Store Admin** | `admin@brewsync.ph` | `admin123` | Full access (Dashboard, Products, Inventory CRUD, POS, Reports, Settings) |
| **Secondary Admin** | `john@brewsync.com` | `john123` | Full administrative access |
| **Counter Cashier** | `staff@brewsync.ph` | `staff123` | Restricted access (POS register and basic order view) |
| **Google Sign-In** | Any Google account | — | Click **"Continue with Google"** |

---

## 🏗️ 7. Building for Production

To test the production build locally before deploying:

```bash
npm run build
npm run preview
```
The compiled, minified bundle will be output to the `dist/` directory.

---

## 🚀 8. Production Deployment Reference

If you want to deploy your own instance to Netlify and Render:

### Netlify (Frontend)
1. Link your GitHub repository to **Netlify**.
2. **Build settings** are pre-configured in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Environment variables:
   - `VITE_API_URL`: `https://jr-bresync.onrender.com`
4. The file `frontend/public/_redirects` automatically proxies all `/api/*` traffic to Render.

### Render (Backend)
1. Create a new **Web Service** on **Render**.
2. Link your GitHub repository.
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Environment variables:
   - `DATABASE_URL`: Your TiDB or MySQL connection URI.
   - `CLIENT_ORIGIN`: `https://jr-bresync.netlify.app`
   - `FIREBASE_PROJECT_ID`: `brewsync-pos-5fa0e`

---

## 🛠️ 9. Troubleshooting

* **Backend `ECONNREFUSED 127.0.0.1:3306`**:
  Make sure `DATABASE_URL` is set to the cloud TiDB database string in `backend/.env`, or start your local Laragon/XAMPP MySQL service.
* **CORS Errors**:
  Make sure `CLIENT_ORIGIN` in `backend/.env` includes `http://localhost:5173`.
* **Port 5000 Already in Use**:
  Change `PORT=5001` in `backend/.env`, or terminate the lingering process with `netstat -ano | findstr :5000`.
