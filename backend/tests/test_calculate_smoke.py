from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health():
    assert client.get('/health').json()['status'] == 'ok'

def test_calculate_scientific():
    response = client.post('/calculate', json={'expression': 'sin(pi/2)+sqrt(16)+factorial(3)'})
    assert response.status_code == 200
    assert response.json()['formatted_result'] == '11'

def test_rejects_unsafe_expression():
    response = client.post('/calculate', json={'expression': '__import__("os").system("ls")'})
    assert response.status_code == 400
    assert response.json()['detail']['code'] == 'UNSAFE_EXPRESSION'
