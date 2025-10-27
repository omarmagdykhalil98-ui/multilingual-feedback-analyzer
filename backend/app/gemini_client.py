import os
import google.generativeai as genai
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential
import asyncio

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-pro')

@retry(wait=wait_exponential(multiplier=1, min=4, max=10), stop=stop_after_attempt(3))
async def _generate_content_with_retry(prompt: str, timeout: int = 30):
    try:
        return await asyncio.wait_for(model.generate_content_async(prompt), timeout=timeout)
    except asyncio.TimeoutError:
        raise Exception("Gemini API call timed out")

async def detect_language(text: str) -> str:
    prompt = f"Detect the language of the following text. Return only the two-letter ISO 639-1 code. Text: {text}"
    response = await _generate_content_with_retry(prompt)
    return response.text.strip()

async def translate_text(text: str, target_language: str) -> str:
    prompt = f"Translate the following text to {target_language}: {text}"
    response = await _generate_content_with_retry(prompt)
    return response.text

async def classify_sentiment(text: str) -> str:
    prompt = f"Analyze the sentiment of the following text and return one of these keywords: Positive, Negative, Neutral. Text: {text}"
    response = await _generate_content_with_retry(prompt)
    return response.text.strip()

async def detect_translate_and_sentiment(text: str, target_language: str = 'en') -> dict:
    detected_language = await detect_language(text)

    translated_text = text
    if detected_language.lower() != target_language.lower():
        translated_text = await translate_text(text, target_language)

    sentiment = await classify_sentiment(translated_text)

    return {
        "translated_text": translated_text,
        "sentiment": sentiment,
        "detected_language": detected_language,
    }

async def generate_itinerary(destination, days):
    prompt = f"Generate a {days}-day travel itinerary for {destination}."
    response = await _generate_content_with_retry(prompt)
    return response.text
