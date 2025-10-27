from fastapi import FastAPI, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from . import schemas, crud, gemini_client, models
import logging
from typing import List, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.on_event("startup")
def on_startup():
    models.init_db()

# Dependency
def get_db():
    db = models.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/generate-itinerary/", response_model=schemas.Itinerary)
async def create_itinerary(request: schemas.ItineraryRequest):
    try:
        itinerary_text = await gemini_client.generate_itinerary(request.destination, request.days)
        return schemas.Itinerary(destination=request.destination, days=request.days, itinerary=itinerary_text)
    except Exception as e:
        logger.error(f"Error creating itinerary: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate itinerary.")

@app.post("/api/feedback", response_model=schemas.Feedback)
async def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    try:
        result = await gemini_client.detect_translate_and_sentiment(feedback.original_text)
        return crud.create_feedback(
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
def get_feedback(
    product_id: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    try:
        return crud.get_feedback(db, product_id, language, sentiment, page, limit)
    except Exception as e:
        logger.error(f"Error getting feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve feedback.")

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    try:
        return crud.get_feedback_stats(db)
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
