import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

@pytest.mark.parametrize('expression,expected', [
    ('2+2*3', '8'),
    ('sin(pi/2)', '1'),
    ('cos(0)', '1'),
    ('tan(0)', '0'),
    ('log(100,10)', '2'),
    ('ln(e)', '1'),
    ('sqrt(16)', '4'),
    ('factorial(5)', '120'),
    ('2^3', '8'),
])
def test_calculate_required_scientific_functions(expression, expected):
    response = client.post('/calculate', json={'expression': expression})
    assert response.status_code == 200
    assert response.json()['formatted_result'] == expected

@pytest.mark.parametrize('expression,code', [
    ('__import__("os")', 'UNSAFE_EXPRESSION'),
    ('open("/etc/passwd")', 'UNSAFE_EXPRESSION'),
    ('globals()', 'UNSAFE_EXPRESSION'),
    ('unknown(2)', 'UNSUPPORTED_FUNCTION'),
])
def test_rejects_attack_payloads(expression, code):
    response = client.post('/calculate', json={'expression': expression})
    assert response.status_code == 400
    assert response.json()['detail']['code'] == code

def test_ai_assist_does_not_require_live_key(monkeypatch):
    monkeypatch.delenv('ANTHROPIC_API_KEY', raising=False)
    response = client.post('/ai-assist', json={'natural_language': 'square root of 144'})
    assert response.status_code == 503
    assert response.json()['detail']['code'] == 'AI_NOT_CONFIGURED'
