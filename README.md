# AI-Powered Personalized Learning & Assessment Platform

This repository contains an MVP implementation of a personalized career learning platform. It follows the supplied architecture:

- `backend/django_core`: Django + Django REST Framework core API for users, resumes, jobs, learning paths, and progress.
- `backend/fastapi_ai`: FastAPI AI service for parsing text, skill matching, and roadmap generation.
- `frontend`: React single-page app for resume/job intake, match analysis, learning paths, and readiness tracking.

The MVP runs locally without paid AI keys. The FastAPI service uses deterministic skill extraction and matching, with clean service boundaries for adding Gemini, OpenAI, embeddings, and vector search later.

## Project Structure

```text
.
├── backend/
│   ├── django_core/
│   │   ├── api/                    Analysis endpoint and FastAPI client bridge
│   │   │   ├── ai_client.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   ├── config/                 Django settings and project URL configuration
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   ├── asgi.py
│   │   │   └── wsgi.py
│   │   ├── users/                  User registration and authentication
│   │   ├── resumes/                Resume storage and extracted skills
│   │   ├── jobs/                   Target job descriptions and requirements
│   │   ├── learning_paths/         Roadmaps, steps, progress, and migrations
│   │   ├── manage.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   └── fastapi_ai/
│       ├── routers/                HTTP endpoints for parsing, matching, and generation
│       │   ├── parse.py
│       │   ├── match.py
│       │   └── generate.py
│       ├── services/                Deterministic AI/ML business logic
│       │   ├── skill_extractor.py
│       │   ├── matcher.py
│       │   └── path_generator.py
│       ├── tests/                   FastAPI service tests
│       │   └── test_services.py
│       ├── schemas.py
│       ├── main.py
│       ├── requirements.txt
│       └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js              Shared Django API client
│   │   ├── components/
│   │   │   ├── AppFooter.jsx           Application footer
│   │   │   ├── AppHeader.jsx           Navigation and branding
│   │   │   ├── AuthView.jsx            Login and registration UI
│   │   │   ├── OverviewView.jsx        Dashboard and analysis workspace
│   │   │   ├── ResourceView.jsx        Paths, resumes, jobs, and assessments
│   │   │   └── Shared.jsx              Reusable UI primitives
│   │   ├── hooks/
│   │   │   └── useAppController.js     Application state and workflows
│   │   ├── App.jsx                     Application composition root
│   │   ├── main.jsx                    React entrypoint
│   │   └── styles.css                  Shared Tailwind styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml      PostgreSQL, Redis, Django, FastAPI, and frontend services
├── .env.example            Environment variable template
├── .github/
│   └── workflows/ci.yml    GitHub Actions checks for backend and frontend
├── run-project.ps1        One-command local PowerShell launcher
└── README.md
```

Generated local files such as `.env`, Python virtual environments, `node_modules/`, and `frontend/dist/` are excluded from the project tree. The `dist/` directory is created only when running a production frontend build.

### Backend Responsibilities

- **Django core** owns users, resumes, target jobs, learning paths, progress updates, authentication, and persistence.
- **FastAPI AI** remains stateless and handles document parsing, skill extraction, skill matching, interview questions, assessments, and roadmap generation.
- Django calls FastAPI through `backend/django_core/api/ai_client.py` during analysis; the frontend communicates with Django through the REST API.

## Quick Start

### Option 1: Docker Compose

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Services:

- React app: http://localhost:5173
- Django API: http://localhost:8000/api/
- FastAPI AI docs: http://localhost:8001/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Option 2: Run All Services with One PowerShell Command

Install dependencies once:

```powershell
pip install -r backend/fastapi_ai/requirements.txt
pip install -r backend/django_core/requirements.txt
Set-Location frontend
npm install
Set-Location ..
```

Then run this single command from the project root:

```powershell
.\run-project.ps1
```

The script opens separate PowerShell windows for FastAPI, Django, and Vite. It uses the local SQLite database and starts these endpoints:

- React app: http://localhost:5173
- Django API: http://localhost:8000/api/
- FastAPI AI docs: http://localhost:8001/docs

To stop the services, press `Ctrl+C` in each service window.

### Option 3: Run Services Manually

FastAPI:

```powershell
cd backend/fastapi_ai
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

Django:

```powershell
cd backend/django_core
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

### Testing and Validation

FastAPI tests:

```powershell
Set-Location backend/fastapi_ai
python -m pytest
```

Django checks:

```powershell
Set-Location backend/django_core
python manage.py check
python manage.py migrate --check
```

Frontend build and formatting:

```powershell
Set-Location frontend
npm run build
npx prettier --check "src/**/*.{js,jsx}"
```

These checks also run automatically in GitHub Actions for pushes and pull requests targeting `main` or `master`. You can run the workflow manually with the `workflow_dispatch` action.

## MVP Workflow

1. Paste resume text or upload a resume file.
2. Paste a target job description.
3. Run the AI analysis.
4. Review match score, strengths, missing skills, interview prompts, and a sequenced learning roadmap.
5. Track roadmap step progress in Django.

## Environment

Copy `.env.example` to `.env` and adjust values as needed.

The platform defaults to local deterministic analysis. Add API keys and replace the service implementations in `backend/fastapi_ai/services` when moving to LLM-backed extraction, embeddings, and generation.

## Architecture Notes

- Django owns users, stored resumes, job descriptions, learning paths, and progress.
- FastAPI remains stateless and focused on AI/ML computation.
- Redis is included for future Celery and Django Channels support.
- PostgreSQL is included for production-like relational persistence.
- The frontend uses REST calls and can be extended to WebSocket progress updates later.
