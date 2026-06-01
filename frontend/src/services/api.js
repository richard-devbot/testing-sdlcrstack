const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const THEMED_ERROR_FALLBACKS = {
  DIVIDE_BY_ZERO: 'Singularity detected: division by zero collapsed the equation horizon.',
  OVERFLOW: 'Overflow in the multiverse: the result escaped finite space.',
  INVALID_EXPRESSION: 'Quantum syntax drift: the expression could not be decoded.',
  UNSAFE_EXPRESSION: 'Firewall nebula engaged: unsafe expression rejected.',
  UNSUPPORTED_FUNCTION: 'Unknown neural operator: this function is outside the current matrix.',
  AI_NOT_CONFIGURED: 'Neural uplink offline: Anthropic API key is not configured.',
};

function buildApiError(payload, fallback) {
  const code = payload.detail?.code || 'UNKNOWN_ERROR';
  const message = payload.detail?.message || THEMED_ERROR_FALLBACKS[code] || fallback;
  const error = new Error(message);
  error.code = code;
  return error;
}

export async function calculateExpression(expression) {
  const response = await fetch(`${API_BASE}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw buildApiError(payload, 'Calculation anomaly detected.');
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
    throw buildApiError(payload, 'AI assist anomaly detected.');
  }
  return payload;
}
