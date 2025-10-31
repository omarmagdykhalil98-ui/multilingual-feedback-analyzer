from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from . import models, schemas
from typing import List, Optional

async def create_feedback(db: AsyncSession, feedback: schemas.FeedbackCreate, translated_text: str, sentiment: str, language: str) -> models.Feedback:
    db_feedback = models.Feedback(
        original_text=feedback.original_text,
        product_id=feedback.product_id,
        detected_language=language,
        translated_text=translated_text,
        sentiment=sentiment,
        meta_info=None, # Not used for now
    )
    db.add(db_feedback)
    await db.commit()
    await db.refresh(db_feedback)
    return db_feedback

async def get_feedback(
    db: AsyncSession,
    product_id: Optional[str] = None,
    language: Optional[str] = None,
    sentiment: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
) -> List[models.Feedback]:
    query = select(models.Feedback)

    if product_id:
        query = query.where(models.Feedback.product_id == product_id)
    if language:
        query = query.where(models.Feedback.detected_language == language)
    if sentiment:
        query = query.where(models.Feedback.sentiment == sentiment)

    result = await db.execute(query.offset((page - 1) * limit).limit(limit))
    return result.scalars().all()

async def get_feedback_stats(db: AsyncSession):
    total_query = select(func.count(models.Feedback.id))
    total_result = await db.execute(total_query)
    total = total_result.scalar_one()

    if total == 0:
        return {
            "total": 0,
            "positive_percentage": 0,
            "negative_percentage": 0,
            "neutral_percentage": 0,
            "language_breakdown": {},
            "product_breakdown": {},
        }

    positive_count_query = select(func.count(models.Feedback.id)).where(func.lower(models.Feedback.sentiment) == "positive")
    positive_count_result = await db.execute(positive_count_query)
    positive_count = positive_count_result.scalar_one()

    negative_count_query = select(func.count(models.Feedback.id)).where(func.lower(models.Feedback.sentiment) == "negative")
    negative_count_result = await db.execute(negative_count_query)
    negative_count = negative_count_result.scalar_one()
    
    neutral_count_query = select(func.count(models.Feedback.id)).where(func.lower(models.Feedback.sentiment) == "neutral")
    neutral_count_result = await db.execute(neutral_count_query)
    neutral_count = neutral_count_result.scalar_one()

    sentiment_breakdown = {
        "Positive": positive_count,
        "Negative": negative_count,
        "Neutral": neutral_count,
    }

    language_breakdown_query = select(models.Feedback.detected_language, func.count(models.Feedback.id)).group_by(models.Feedback.detected_language)
    language_breakdown_result = await db.execute(language_breakdown_query)
    language_breakdown = {lang: count for lang, count in language_breakdown_result}

    product_breakdown_query = select(models.Feedback.product_id, func.count(models.Feedback.id)).where(models.Feedback.product_id != None).group_by(models.Feedback.product_id)
    product_breakdown_result = await db.execute(product_breakdown_query)
    product_breakdown = {prod_id: count for prod_id, count in product_breakdown_result}

    sentiment_by_product_query = select(
        models.Feedback.product_id,
        models.Feedback.sentiment,
        func.count(models.Feedback.id)
    ).group_by(models.Feedback.product_id, models.Feedback.sentiment).where(models.Feedback.product_id != None)
    sentiment_by_product_result = await db.execute(sentiment_by_product_query)

    sentiment_breakdown_by_product = {}
    for product_id, sentiment, count in sentiment_by_product_result:
        if product_id not in sentiment_breakdown_by_product:
            sentiment_breakdown_by_product[product_id] = {"Positive": 0, "Negative": 0, "Neutral": 0}
        sentiment_breakdown_by_product[product_id][sentiment] = count

    return {
        "total": total,
        "sentiment_breakdown": sentiment_breakdown,
        "language_breakdown": language_breakdown,
        "product_breakdown": product_breakdown,
        "sentiment_breakdown_by_product": sentiment_breakdown_by_product,
    }