from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_ai_assist_optional_without_key(monkeypatch):
    monkeypatch.delenv('ANTHROPIC_API_KEY', raising=False)
    response = client.post('/ai-assist', json={'natural_language': 'what is two plus two'})
    assert response.status_code == 503
    assert response.json()['detail']['code'] == 'AI_NOT_CONFIGURED'
