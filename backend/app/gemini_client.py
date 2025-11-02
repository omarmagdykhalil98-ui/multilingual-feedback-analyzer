import os
from google import genai
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential

load_dotenv()

MODEL_NAME = "gemini-2.5-flash"

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# --- Retry Wrapper ---
@retry(wait=wait_exponential(multiplier=1, min=4, max=10), stop=stop_after_attempt(3))
def _generate_content_with_retry(prompt: str) -> str:
    """Generate content with automatic retry and error handling."""
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )
    return response.text.strip()


def detect_language(text: str) -> str:
    prompt = f"Detect the language of the following text. Return only the two-letter ISO 639-1 code. Text: {text}"
    return _generate_content_with_retry(prompt)


def translate_text(text: str, target_language: str) -> str:
    prompt = f"Translate the following text to {target_language}: {text}"
    return _generate_content_with_retry(prompt)


def classify_sentiment(text: str) -> str:
    prompt = (
        f"Analyze the sentiment of the following text and return one of these keywords: Positive, Negative, Neutral. "
        f"Text: {text}"
    )
    return _generate_content_with_retry(prompt)


def detect_translate_and_sentiment(text: str, target_language: str = "en") -> dict:
    detected_language = detect_language(text)

    translated_text = text
    if detected_language.lower() != target_language.lower():
        translated_text = translate_text(text, target_language)

    sentiment = classify_sentiment(translated_text)

    return {
        "translated_text": translated_text,
        "sentiment": sentiment,
        "detected_language": detected_language,
    }


def generate_itinerary(destination, days):
    prompt = f"Generate a {days}-day travel itinerary for {destination}."
    return _generate_content_with_retry(prompt)

def get_model_name():
    return MODEL_NAME