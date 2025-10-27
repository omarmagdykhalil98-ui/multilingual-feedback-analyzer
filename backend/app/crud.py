from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

def create_feedback(db: Session, feedback: schemas.FeedbackCreate, translated_text: str, sentiment: str, language: str) -> models.Feedback:
    db_feedback = models.Feedback(
        original_text=feedback.text,
        product_id=feedback.product_id,
        detected_language=language,
        translated_text=translated_text,
        sentiment=sentiment,
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def get_feedback(
    db: Session,
    product_id: Optional[str] = None,
    language: Optional[str] = None,
    sentiment: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
) -> List[models.Feedback]:
    query = db.query(models.Feedback)

    if product_id:
        query = query.filter(models.Feedback.product_id == product_id)
    if language:
        query = query.filter(models.Feedback.detected_language == language)
    if sentiment:
        query = query.filter(models.Feedback.sentiment == sentiment)

    return query.offset((page - 1) * limit).limit(limit).all()

def get_feedback_stats(db: Session):
    total = db.query(models.Feedback).count()
    if total == 0:
        return {
            "total": 0,
            "positive_percentage": 0,
            "negative_percentage": 0,
            "neutral_percentage": 0,
            "language_breakdown": {},
            "product_breakdown": {},
        }

    positive_count = db.query(models.Feedback).filter(models.Feedback.sentiment == "Positive").count()
    negative_count = db.query(models.Feedback).filter(models.Feedback.sentiment == "Negative").count()
    neutral_count = db.query(models.Feedback).filter(models.Feedback.sentiment == "Neutral").count()

    language_breakdown = {}
    for lang, count in db.query(models.Feedback.detected_language, func.count(models.Feedback.detected_language)).group_by(models.Feedback.detected_language):
        language_breakdown[lang] = count

    product_breakdown = {}
    for prod_id, count in db.query(models.Feedback.product_id, func.count(models.Feedback.product_id)).filter(models.Feedback.product_id != None).group_by(models.Feedback.product_id):
        product_breakdown[prod_id] = count

    return {
        "total": total,
        "positive_percentage": (positive_count / total) * 100,
        "negative_percentage": (negative_count / total) * 100,
        "neutral_percentage": (neutral_count / total) * 100,
        "language_breakdown": language_breakdown,
        "product_breakdown": product_breakdown,
    }