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

# --- ✅ Dynamic, Multi-Environment CORS configuration ---
allowed_origins = {"http://localhost:3000", "http://127.0.0.1:3000"}

# 1️⃣ Detect Codespaces environment correctly
codespace_name = os.getenv("CODESPACE_NAME")
if codespace_name:
    # GitHub Codespaces always uses this domain pattern
    codespace_origin = f"https://{codespace_name}-3000.app.github.dev"
    allowed_origins.add(codespace_origin)
    logger.info(f"🧩 Detected Codespace: {codespace_origin}")

# 2️⃣ Allow manually set frontend URL (for production)
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.add(frontend_url)
    logger.info(f"🌍 Added custom FRONTEND_URL: {frontend_url}")

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
@app.post("/generate-itinerary/", response_model=schemas.Itinerary)
async def create_itinerary(request: schemas.ItineraryRequest):
    try:
        itinerary_text = await gemini_client.generate_itinerary(request.destination, request.days)
        return schemas.Itinerary(destination=request.destination, days=request.days, itinerary=itinerary_text)
    except Exception as e:
        logger.error(f"Error creating itinerary: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate itinerary.")

@app.post("/api/feedback", response_model=schemas.Feedback)
async def create_feedback(feedback: schemas.FeedbackCreate, db: AsyncSession = Depends(get_db)):
    try:
        result = await gemini_client.detect_translate_and_sentiment(feedback.original_text)
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
