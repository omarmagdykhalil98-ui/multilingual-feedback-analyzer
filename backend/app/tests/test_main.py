import os
os.environ["TESTING"] = "true"

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app, get_gemini_client
from app.models import Base, engine

@pytest.fixture(scope="function", autouse=True)
def create_test_database():
    import asyncio
    async def create_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    asyncio.run(create_tables())
    yield
    async def drop_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    asyncio.run(drop_tables())


@pytest.mark.asyncio
async def test_health_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_create_feedback():
    def mock_gemini_func(text: str):
        return {
            "translated_text": "Great product",
            "sentiment": "Positive",
            "detected_language": "de"
        }

    app.dependency_overrides[get_gemini_client] = lambda: mock_gemini_func

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        data = {"text": "Super Produkt", "product_id": "prod-1"}
        response = await ac.post("/api/feedback", json=data)

    app.dependency_overrides = {} # reset for other tests

    assert response.status_code == 200
    json_data = response.json()
    assert json_data["translated_text"] == "Great product"
    assert json_data["sentiment"] == "Positive"
    assert json_data["detected_language"] == "de"
