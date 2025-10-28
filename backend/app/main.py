from fastapi import FastAPI, HTTPException, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from . import schemas, crud, gemini_client, models
import logging
from typing import List, Optional
import asyncio


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://shady-poltergeist-4jp945w67vj9cqpv7-3000.app.github.dev"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await models.init_db()

# Dependency
async def get_db() -> AsyncSession:
    async with models.SessionLocal() as session:
        yield session

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
        # Run synchronous Gemini call in a thread-safe way
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, gemini_client.detect_translate_and_sentiment, feedback.original_text)

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

@app.post("/api/translate", response_model=schemas.TranslationResponse)
async def translate(request: schemas.TranslationRequest):
    try:
        translated_text = await gemini_client.translate_text(request.text, request.target_language)
        return schemas.TranslationResponse(translated_text=translated_text)
    except Exception as e:
        logger.error(f"Error translating text: {e}")
        raise HTTPException(status_code=500, detail="Failed to translate text.")