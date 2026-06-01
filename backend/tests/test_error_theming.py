from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def error_for(expression):
    return client.post('/calculate', json={'expression': expression})

def test_unsupported_function_has_ai_theme():
    response = error_for('hack(2)')
    assert response.status_code == 400
    assert response.json()['detail']['code'] == 'UNSUPPORTED_FUNCTION'
    assert 'neural' in response.json()['detail']['message'].lower()

def test_unsafe_expression_has_firewall_theme():
    response = error_for('__import__("os")')
    assert response.status_code == 400
    assert 'Firewall nebula' in response.json()['detail']['message']
