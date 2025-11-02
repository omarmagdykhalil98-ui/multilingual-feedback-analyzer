# Multilingual Feedback Analyzer

**Short summary**  
Multilingual Feedback Analyzer is a small full-stack app that accepts user feedback in multiple languages, automatically detects language, translates feedback to English, classifies sentiment (Positive/Negative/Neutral) using the Gemini model, and provides an analytics dashboard (charts, filters, export CSV). It includes a FastAPI backend, a React + Vite frontend with Tailwind CSS, and PostgreSQL for persistence. The project is containerized with Docker Compose for easy local development and deployment.

---

## Table of contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting started (local, Docker Compose)](#getting-started-local-docker-compose)
- [Running in development](#running-in-development)
- [Running production build (Docker images)](#running-production-build-docker-images)
- [API routes & usage](#api-routes--usage)
- [Frontend overview](#frontend-overview)
- [Backend overview](#backend-overview)
- [Data schema](#data-schema)
- [Gemini Studio / Gemini API integration](#gemini-studio--gemini-api-integration)
- [Testing](#testing)
- [CI/CD (GitHub Actions)](#cicd-github-actions)
- [Data persistence expectations](#data-persistence-expectations)
- [Common issues & troubleshooting](#common-issues--troubleshooting)
- [Limitations & known issues](#limitations--known-issues)
- [Contributing / Maintainers](#contributing--maintainers)
- [License](#license)

---

## Features
- Submit multilingual feedback (product, free text)
- Automated detection of language, translation, and sentiment classification using Gemini
- Aggregated stats and charts (total, sentiment breakdown, language breakdown)
- Search and product filtering
- Export filtered feedback to CSV
- Dockerized backend, frontend and DB
- Unit tests for frontend (Vitest) and backend (pytest)

---

## Prerequisites
- Docker & Docker Compose (for running locally via containers)
- Node.js (if running frontend locally without Docker) — Node 22+ recommended
- Python 3.11+ (if running backend locally without Docker)
- Gemini API key (set as `GEMINI_API_KEY` in environment)
- A PostgreSQL user/password/database if not using Docker-managed DB

---

## Getting started (local, Docker Compose)

**Clone the master branch of the repo**
```bash
git clone <https://github.com/omarmagdykhalil98-ui/multilingual-feedback-analyzer.git>
cd multilingual-feedback-analyzer
```

**Set up environment variables**

Copy the `.env.example` file in the `backend` directory to `.env` and fill in the required values.

```bash
cp backend/.env.example backend/.env
```

**Build and run the services**

```bash
docker-compose up --build
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.

---

## Running in development

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

## Running production build (Docker images)

```bash
docker-compose -f docker-compose.prod.yml up --build
```

---

## API routes & usage

- `POST /api/feedback`: Submits a new feedback entry.
  - **Body**: `{"product_id": "string", "original_text": "string"}`
- `GET /api/feedback`: Retrieves a paginated list of feedback entries with optional filters.
  - **Query Parameters**: `product_id`, `language`, `sentiment`, `page`, `limit`
- `GET /api/stats`: Retrieves aggregated feedback statistics.
- `GET /api/health`: Health check endpoint.
- `GET /api/model-name`: Returns the name of the Gemini model being used.

---

## Frontend overview

The frontend is a React application built with Vite. It uses Tailwind CSS for styling and Recharts for charts.

- **`src/pages`**: Contains the main pages of the application.
- **`src/components`**: Contains reusable UI components.
- **`src/services/api.js`**: Handles all communication with the backend API.
- **`src/hooks`**: Contains custom React hooks.
- **`src/utils`**: Contains utility functions.

---

## Backend overview

The backend is a FastAPI application that provides a RESTful API for the frontend.

- **`app/main.py`**: The main entry point of the application, containing all the API routes.
- **`app/crud.py`**: Contains functions for database operations.
- **`app/models.py`**: Defines the database schema using SQLAlchemy.
- **`app/schemas.py`**: Defines the Pydantic models for data validation.
- **`app/gemini_client.py`**: Handles communication with the Gemini API.

---

## Data schema

The `feedback` table has the following columns:

- `id`: Primary key
- `product_id`: String
- `original_text`: Text
- `detected_language`: String
- `translated_text`: Text
- `sentiment`: String
- `meta_info`: JSON
- `created_at`: DateTime

---

## Gemini Studio / Gemini API integration

The backend uses the Gemini API to perform language detection, translation, and sentiment analysis. The `gemini_client.py` file contains the logic for interacting with the Gemini API.

---

## Testing

**Frontend**

```bash
cd frontend
npm test
```

**Backend**

```bash
cd backend
pytest
```

---

## CI/CD (GitHub Actions)

The project includes two GitHub Actions workflows:

- **`ci.yml`**: Runs tests for the frontend and backend on every push and pull request.
- **`cd.yml`**: Deploys the application to a production environment (this is a placeholder and needs to be configured).

---

## Data persistence expectations

The application uses a PostgreSQL database to store feedback data. The data is persisted across container restarts.

---

## Common issues & troubleshooting

- **CORS errors**: If you are running the frontend and backend on different domains, you may encounter CORS errors. Make sure to configure the `ALLOWED_ORIGINS` in `backend/app/main.py` correctly.
- **Database connection issues**: Ensure that the database is running and that the `DATABASE_URL` in `backend/.env` is correct.

---

## Limitations & known issues

- The translation and sentiment analysis are only as good as the Gemini model.
- The frontend does not have a complete set of tests.

---

## Contributing / Maintainers

This project is maintained by the Gemini team.

---

## License

This project is licensed under the MIT License.
