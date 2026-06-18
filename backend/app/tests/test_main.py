import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from ..main import app

@pytest_asyncio.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_root(async_client):
    resp = await async_client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["message"] == "API MedFlowApp is running..."

@pytest.mark.asyncio
async def test_health(async_client):
    resp = await async_client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_external_predict(async_client):
    resp = await async_client.get("/api/external/predict/karim")
    assert resp.status_code in [200, 503]
    if resp.status_code == 200:
        data = resp.json()
        assert "name" in data
        assert "countries" in data

@pytest.mark.asyncio
async def test_api_docs():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.get("/docs")
    assert resp.status_code == 200

@pytest.mark.asyncio
async def test_openapi_schema(async_client):
    resp = await async_client.get("/openapi.json")
    assert resp.status_code == 200
    schema = resp.json()
    assert "paths" in schema
    assert "/api/auth/login" in schema["paths"]
