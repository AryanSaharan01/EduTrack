# 🚀 Project Deployment & Configuration Guide

## 📦 Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Local Development Setup](#local-development-setup)
5. [Database Setup & Migrations](#database-setup--migrations)
6. [Production Deployment](#production-deployment)
7. [Environment Variables](#environment-variables)
8. [Troubleshooting & Common Issues](#troubleshooting--common-issues)

---

# 📘 Overview
This project is a full-stack web application featuring secure email-based OTP authentication, PostgreSQL/NeonDB integration, role-based operations, socket support, and production-ready architecture.

---

# 🛠️ Tech Stack
### **Frontend**
- Vite + React
- Axios
- Socket.io Client

### **Backend**
- Node.js + Express
- PostgreSQL / NeonDB
- Nodemailer
- JWT Authentication
- Socket.io

---

# 📁 Project Structure
```
root/
├── backend/
│   ├── server.js
│   ├── config/
│   ├── services/
│   ├── routes/
│   ├── validate-env.js
│   ├── run-neon-migration.js
│   └── .env
└── frontend/
    ├── src/
    ├── utils/api.js
    ├── pages/
    └── .env
```

---

# 🖥️ Local Development Setup

## 1️⃣ Clone Repository
```
git clone <your-repo-url>
cd <repo>
```

## 2️⃣ Backend Setup
```
cd backend
npm install
```

Create a `.env` file using variables listed below.

Run backend:
```
npm run dev
```

## 3️⃣ Frontend Setup
```
cd frontend
npm install
npm run dev
```

Place Vite environment variables in `/frontend/.env`.

---

# 🗄️ Database Setup & Migrations

Set `DATABASE_URL` in backend `.env`.

Run migrations:
```
node run-neon-migration.js
```

---

# 🌐 Production Deployment

## 🚀 Backend Deployment
```
node server.js
```

Add all environment variables and run database migration.

---

## 🎨 Frontend Deployment
```
npm run build
```

Deploy the `dist/` folder.

---

# 🔐 Environment Variables

## Backend

### Server
- PORT
- NODE_ENV

### Database
- DATABASE_URL
- DB_SCHEMA
- DB_POOL_SIZE

### JWT
- JWT_SECRET
- JWT_EXPIRES_IN

### SMTP / Email
- SMTP_HOST
- SMTP_PORT
- SMTP_SECURE
- SMTP_USER
- SMTP_PASS
- EMAIL_SERVICE
- EMAIL_USER
- EMAIL_PASSWORD

### CORS
- CLIENT_ORIGIN

## Frontend (Vite)
- VITE_API_URL
- VITE_SOCKET_URL

---

# 🧰 Troubleshooting
- SMTP issues: Verify credentials and SSL/TLS settings.
- CORS issues: Ensure CLIENT_ORIGIN matches exactly.
- DB issues: Add ?sslmode=require for hosted DBs.
- Socket issues: Ensure host supports WebSockets.

---

# ✅ Notes
- Never commit `.env` to the repository.
- README is production-ready.
