from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ----- Itinerary Schemas -----
class ItineraryRequest(BaseModel):
    destination: str
    days: int


class Itinerary(BaseModel):
    destination: str
    days: int
    itinerary: str


# ----- Feedback Schemas -----
class FeedbackBase(BaseModel):
    # Accepts both "text" (from frontend) and "original_text" (internal)
    original_text: str = Field(..., alias="text")
    product_id: Optional[str] = None
    language: Optional[str] = None

    class Config:
        populate_by_name = True  # allows using both field name and alias
        from_attributes = True   # replaces deprecated 'orm_mode' in Pydantic v2


class FeedbackCreate(FeedbackBase):
    pass


class Feedback(FeedbackBase):
    id: int
    detected_language: Optional[str] = None
    translated_text: Optional[str] = None
    sentiment: Optional[str] = None
    meta_info: Optional[dict] = None
    created_at: datetime


# ----- Translation Schemas -----
class TranslationRequest(BaseModel):
    text: str
    target_language: str


class TranslationResponse(BaseModel):
    translated_text: str
