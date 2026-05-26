<div align="center">

<br />

# 💸 Monevo

### Smart Personal Finance Tracker

**Track income & expenses · Set budgets · Scan receipts with AI**

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![Claude AI](https://img.shields.io/badge/Claude_AI-Anthropic-D97706?style=for-the-badge)](https://anthropic.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br />

</div>

---

## ✨ Overview

**Monevo** is a full-stack personal finance management web application. Track income and expenses, set monthly budgets per category, and understand your spending through interactive charts — plus scan receipts and bank statements using AI to import transactions instantly.

Built with React + Vite on the frontend and a Node.js/Express REST API with SQLite on the backend. Runs entirely offline with no cloud database required.

---

## 🚀 Features

- **🔐 Authentication** — JWT-based registration & login, bcrypt password hashing (12 rounds), rate-limited auth endpoints
- **💰 Transactions** — Add, edit, and delete income & expense entries with category, description, date, and amount
- **🗂️ Categories** — Default built-in categories + unlimited custom categories per user
- **🎯 Budgets** — Set monthly spending limits per category and track progress in real time
- **📊 Dashboard** — Live net balance, monthly bar chart (Income vs Expenses), category breakdown pie chart, recent transactions table
- **🤖 AI Receipt Scan** — Upload a photo or PDF of a receipt / bank statement; Claude AI extracts and imports transactions automatically
- **🧪 Tests** — Jest + Supertest integration tests for auth and transactions
- **🛡️ Security** — Helmet headers, CORS config, rate limiting, input validation, magic-byte file type checks

---

## 🗂️ Project Structure

```
monevo/
├── backend/
│   ├── src/
│   │   ├── config/         # SQLite database connection & schema
│   │   ├── controllers/    # Auth, transactions, categories, budgets
│   │   ├── middleware/     # JWT auth, error handler, input validation
│   │   ├── routes/         # API route definitions (+ scan route)
│   │   ├── services/       # Business logic helpers
│   │   └── server.js       # Express app entry point
│   ├── tests/              # Jest + Supertest integration tests
│   └── package.json
│
├── frontend/
│   ├── public/             # Favicons & static assets
│   ├── src/
│   │   ├── components/     # Layout shell
│   │   ├── context/        # AuthContext (global user state)
│   │   ├── pages/          # Landing, Login, Register, Dashboard,
│   │   │                   # Transactions, Categories, Budgets, WhyMonevo
│   │   ├── services/       # Axios instance with auto-auth headers
│   │   └── App.jsx         # Router + PrivateRoute guards
│   └── package.json
│
├── ai/                     # AI/ML module (future: categorization & prediction)
│   ├── src/
│   │   ├── categorization/
│   │   └── prediction/
│   └── models/
│
├── docs/
│   └── technical-documentation.md
├── render.yaml
└── README.md
```

---

## 🛠️ Tech Stack

### Backend

| Tech | Purpose |
|------|---------|
| **Node.js 18+** | Runtime |
| **Express 5** | REST API framework |
| **SQLite** (better-sqlite3) | File-based relational database |
| **JWT** (jsonwebtoken) | Stateless authentication |
| **bcryptjs** | Password hashing |
| **Anthropic SDK** | AI receipt & PDF scanning (Claude Haiku) |
| **Multer + pdf-parse** | File upload & PDF text extraction |
| **express-rate-limit** | Auth & scan endpoint rate limiting |
| **express-validator** | Request validation |
| **Helmet** | HTTP security headers |

### Frontend

| Tech | Purpose |
|------|---------|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **React Router 7** | Client-side routing |
| **Axios** | HTTP client with auto-auth |
| **Recharts** | Bar & pie chart components |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js v18+**
- **Anthropic API key** (for AI scan feature — optional, app works without it)

### 1. Clone the repository

```bash
git clone https://github.com/Yusuf-Duran-Goker/monevo-finance-tracker.git
cd monevo-finance-tracker
```

### 2. Configure backend environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_strong_random_secret_here_min_64_chars
ANTHROPIC_API_KEY=your-anthropic-api-key   # optional
```

### 3. Start the backend

```bash
npm install
npm run dev
```

API starts at **http://localhost:5000**. SQLite database is created automatically.

### 4. Start the frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

App opens at **http://localhost:5173**.

### 5. Run tests

```bash
cd backend
npm test
```

---

## 🤖 AI Receipt Scan

Upload an image (JPG, PNG, WebP) or PDF to `POST /api/scan`. Claude AI reads the document and returns an array of structured transactions ready to import.

Supported inputs: receipts, invoices, bank statement PDFs, expense photos.

Requires `ANTHROPIC_API_KEY` in the backend `.env` file.

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Sign in, returns JWT |
| `GET` | `/api/auth/me` | Get current user profile |

### Transactions *(JWT required)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/transactions` | List all transactions |
| `POST` | `/api/transactions` | Create a transaction |
| `PUT` | `/api/transactions/:id` | Update a transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |

### Categories *(JWT required)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | List categories |
| `POST` | `/api/categories` | Create a custom category |
| `DELETE` | `/api/categories/:id` | Delete a category |

### Budgets *(JWT required)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/budgets` | List budgets |
| `POST` | `/api/budgets` | Create or update a budget |
| `GET` | `/api/budgets/summary` | Budget vs actual summary |
| `DELETE` | `/api/budgets/:id` | Delete a budget |

### AI Scan *(JWT required)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/scan` | Upload receipt/PDF → get transactions |

---

## 🗄️ Data Model

```
users                transactions          categories
─────────────        ─────────────────    ──────────────────
id (PK)              id (PK)              id (PK)
name                 user_id → users      user_id → users
email (unique)       type (income|expense) name
password (hash)      amount               type
created_at           category             is_default
                     description
budgets              date
──────────           created_at
id (PK)
user_id → users
category_id → categories
amount
month / year
```

---

## ☁️ Deployment

A `render.yaml` is included for one-click deployment to [Render.com](https://render.com).

---

## 👥 Team

| Name | Role |
|------|------|
| Yusuf Duran Göker | Frontend Developer |
| Sinan Samed Yaşın | Backend Developer |
| Murat Karabulut | Database & DevOps |
| Ahmet Yunus Güneş | QA & Documentation |

Developed using **Agile/Scrum** methodology — 12-week sprint plan, feature branch strategy, GitHub Projects for backlog management.

---

## 📄 License

MIT License — open source and free to use.

---

<div align="center">
  Made with ❤️ — <strong>Monevo</strong> · Take control of your finances
</div>
