from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from . import schemas, crud, gemini_client, models
import logging
from typing import List, Optional
import asyncio
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# --- ✅ UNIVERSAL CORS CONFIGURATION ---
allowed_origins = {"http://localhost:3000", "http://127.0.0.1:3000"}

# Detect GitHub Codespace environment
codespace_name = os.getenv("CODESPACE_NAME")
if codespace_name:
    codespace_origin = f"https://{codespace_name}-3000.app.github.dev"
    allowed_origins.add(codespace_origin)
    logger.info(f"🧩 Detected Codespace: {codespace_origin}")

# Fallback: use FRONTEND_URL from .env if defined
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.add(frontend_url)
    logger.info(f"🌍 Added custom FRONTEND_URL: {frontend_url}")

# Final safety net: allow any .app.github.dev (useful when CODESPACE_NAME not detected)
if os.getenv("CODESPACES", "false").lower() == "true":
    allowed_origins.add("https://*.app.github.dev")
    logger.info("🛠️ Added wildcard for GitHub Codespaces *.app.github.dev")

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(allowed_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info(f"🔒 Allowed CORS origins: {allowed_origins}")


# --- Startup ---
@app.on_event("startup")
async def on_startup():
    await models.init_db()


# --- Dependency ---
async def get_db() -> AsyncSession:
    async with models.SessionLocal() as session:
        yield session


# --- Endpoints ---
@app.post("/api/feedback", response_model=schemas.Feedback)
async def create_feedback(feedback: schemas.FeedbackCreate, db: AsyncSession = Depends(get_db)):
    try:
        # Run the sync Gemini call in a background thread (non-blocking)
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: gemini_client.detect_translate_and_sentiment(feedback.original_text)
        )

        return await crud.create_feedback(
            db=db,
            feedback=feedback,
            translated_text=result["translated_text"],
            sentiment=result["sentiment"],
            language=result["detected_language"],
        )

    except Exception as e:
        logger.error(f"Error creating feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to process feedback.")

@app.get("/api/feedback", response_model=List[schemas.Feedback])
async def get_feedback(
    product_id: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await crud.get_feedback(db, product_id, language, sentiment, page, limit)
    except Exception as e:
        logger.error(f"Error getting feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve feedback.")


@app.get("/api/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    try:
        return await crud.get_feedback_stats(db)
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve stats.")

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/model-name")
async def get_model_name():
    return {"model_name": gemini_client.get_model_name()}