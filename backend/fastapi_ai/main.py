from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.generate import router as generate_router
from routers.match import router as match_router
from routers.parse import router as parse_router

app = FastAPI(
    title="Personalized Learning AI Service",
    version="0.1.0",
    description="Stateless AI/ML service for parsing, matching, and roadmap generation.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(parse_router, tags=["parse"])
app.include_router(match_router, tags=["match"])
app.include_router(generate_router, tags=["learning paths"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
