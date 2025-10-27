from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ItineraryRequest(BaseModel):
    destination: str
    days: int

class Itinerary(BaseModel):
    destination: str
    days: int
    itinerary: str

class FeedbackBase(BaseModel):
    text: str
    product_id: Optional[str] = None
    language: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase):
    id: int
    translated_text: Optional[str] = None
    sentiment: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True

class TranslationRequest(BaseModel):
    text: str
    target_language: str

class TranslationResponse(BaseModel):
    translated_text: str