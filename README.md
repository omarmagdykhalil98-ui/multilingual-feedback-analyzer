# 🌍 Multilingual Feedback Analyzer

**Short Summary**  
Multilingual Feedback Analyzer is a full-stack AI-powered application that collects and analyzes user feedback in multiple languages. It automatically detects the language, translates it to English, classifies the sentiment (Positive / Negative / Neutral) using the **Gemini API**, and provides interactive analytics via a modern dashboard.  

It’s built with **FastAPI (backend)**, **React + Tailwind CSS (frontend)**, and **PostgreSQL (database)** — all containerized with **Docker Compose** for seamless local development and deployment.

---

## 📚 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started (Local via Docker Compose)](#getting-started-local-via-docker-compose)
- [Running in Development](#running-in-development)
- [Running Production Build](#running-production-build)
- [API Routes & Usage](#api-routes--usage)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [Data Schema](#data-schema)
- [Gemini API Integration](#gemini-api-integration)
- [Testing](#testing)
- [CI/CD (GitHub Actions)](#cicd-github-actions)
- [Data Persistence Expectations](#data-persistence-expectations)
- [Troubleshooting](#troubleshooting)
- [Limitations & Known Issues](#limitations--known-issues)
- [Contributing / Maintainers](#contributing--maintainers)

---

## ✨ Features

- 🌐 Submit multilingual feedback for specific products  
- 🤖 Automatic **language detection**, **translation**, and **sentiment classification** (via Gemini API)  
- 📊 Interactive analytics dashboard with sentiment & language breakdowns  
- 🔍 Filtering and search by product or language  
- 📁 Export feedback data to CSV  
- 🧩 Fully containerized (Frontend, Backend, DB)  
- 🧪 Unit tests for both backend (pytest) and frontend (Vitest)  
- ⚙️ Integrated CI/CD pipelines with GitHub Actions  

---

## 🧰 Prerequisites

To run the app locally or via Docker:

- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- (Optional) Node.js ≥ 22 for frontend local dev
- (Optional) Python ≥ 3.11 for backend local dev
- Gemini API key (already embedded for task submission)
- PostgreSQL credentials (auto-created when using Docker)

---

## 🚀 Getting Started (Local via Docker Compose)

Clone the master branch of the repository:
```bash
git clone https://github.com/omarmagdykhalil98-ui/multilingual-feedback-analyzer.git
cd multilingual-feedback-analyzer
```

### Environment Variables

A pre-configured `.env` file is already included in the backend directory.  
You can run the app as-is — no setup required.

If you want to use your own credentials (e.g., different Gemini API key or database),  
you can edit the `.env` file and update the values below:

GEMINI_API_KEY=your_key_here
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=feedback_db
POSTGRES_HOST=db
POSTGRES_PORT=5432
DATABASE_URL=postgresql+asyncpg://user:password@db:5432/feedback_db



Then build and start all services:
```bash
docker compose up --build
```

- Frontend → [http://localhost:3000](http://localhost:3000)  
- Backend API → [http://localhost:8000](http://localhost:8000)

---

## 🧑‍💻 Running in Development

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🏗️ Running Production Build

```bash
docker compose -f docker-compose.prod.yml up --build
```

This runs optimized builds of both frontend and backend with persistent database volumes.

---

## 🧩 API Routes & Usage

### Health Check
`GET /api/health`  
→ Returns `{"status": "ok"}`

### Submit Feedback
`POST /api/feedback`  
**Body:**
```json
{
  "product_id": "prod-123",
  "text": "Très bon produit"
}
```
**Response:**
```json
{
  "translated_text": "Very good product",
  "sentiment": "Positive",
  "detected_language": "fr"
}
```

### Get Feedback
`GET /api/feedback?language=en&sentiment=Positive`

### Get Stats
`GET /api/stats`  
→ Returns counts for total, sentiment, and languages.

### Model Info
`GET /api/model-name`  
→ Returns `"gemini-2.5-flash"`

---

## 🎨 Frontend Overview

- **Framework:** React + Vite + Tailwind CSS  
- **UI Components:** Recharts (for charts), Lucide icons, smooth theme transitions  
- **Structure:**
  ```
  src/
  ├── components/      # Reusable UI components (Navbar, Sidebar, etc.)
  ├── pages/           # Main pages (Submit Feedback, Analytics, Settings)
  ├── services/api.js  # Handles all API calls
  ├── hooks/           # Custom React hooks (e.g. Dark Mode)
  └── utils/           # Utility helpers
  ```

---

## ⚙️ Backend Overview

- **Framework:** FastAPI  
- **ORM:** SQLAlchemy  
- **Database:** PostgreSQL  
- **Structure:**
  ```
  app/
  ├── main.py           # API routes
  ├── models.py         # SQLAlchemy models
  ├── schemas.py        # Pydantic validation models
  ├── crud.py           # Database logic
  ├── gemini_client.py  # Gemini API integration
  └── tests/            # Unit tests
  ```

---

## 🗃️ Data Schema

| Column             | Type        | Description |
|--------------------|-------------|-------------|
| `id`               | Integer     | Primary key |
| `product_id`       | String      | Product identifier |
| `original_text`    | Text        | Feedback text as submitted |
| `translated_text`  | Text        | English translation |
| `detected_language`| String(2)   | Language ISO code |
| `sentiment`        | String      | Positive / Negative / Neutral |
| `meta_info`        | JSON        | Additional metadata (optional) |
| `created_at`       | DateTime    | Timestamp |

---

## 🧠 Gemini API Integration

The Gemini integration is handled in `app/gemini_client.py`.

### Used Gemini Capabilities:
- **Language Detection**
- **Translation**
- **Sentiment Classification**

The model used:  

MODEL_NAME = "gemini-2.5-flash"


Requests are made through the official Google `genai` client.  
Retries and exponential backoff are managed via `tenacity` for reliability.

---

## 🧪 Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
pytest -v
```

Both test suites verify:
- Component rendering
- API integration logic
- Successful feedback creation and health checks

---

## ⚡ CI/CD (GitHub Actions)

The repository includes two workflows:

- **ci.yml**
  - Runs all backend and frontend tests
  - Builds Docker images
  - Pushes to Docker Hub on success  

- **cd.yml**
  - Pulls latest Docker images
  - Deploys automatically (if configured with SSH credentials)

Secrets required:
```
GEMINI_API_KEY
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
```

---

## 💾 Data Persistence Expectations

The PostgreSQL database uses a named Docker volume (`postgres_data`) to persist feedback across restarts.

To clean all data:
```bash
docker compose down --volumes
docker compose up --build
```

---

## 🧩 Troubleshooting

| Issue | Possible Cause | Fix |
|-------|----------------|-----|
| CORS error | Different ports/domains | Update CORS origins in `app/main.py` |
| 500 error on feedback | Missing Gemini key | Set `GEMINI_API_KEY` in `.env` |

---

## ⚠️ Limitations & Known Issues

- Translation and sentiment accuracy depend on the Gemini model quality.  
- Limited error handling for network/API timeouts.  
- Designed for single-user usage (no auth layer yet).  

---

## 👥 Contributing / Maintainers

Maintained by **Omar Magdy Khalil**  
For any contributions, please fork the repo and open a pull request.

