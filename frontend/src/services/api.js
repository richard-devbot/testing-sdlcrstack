const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function calculateExpression(expression) {
  const response = await fetch(`${API_BASE}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression }),
  });
  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.detail?.message || 'Calculation failed');
    error.code = payload.detail?.code || 'UNKNOWN_ERROR';
    throw error;
  }
  return payload;
}

export async function requestAIAssist(natural_language) {
  const response = await fetch(`${API_BASE}/ai-assist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ natural_language }),
  });
  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.detail?.message || 'AI assist failed');
    error.code = payload.detail?.code || 'UNKNOWN_ERROR';
    throw error;
  }
  return payload;
}
