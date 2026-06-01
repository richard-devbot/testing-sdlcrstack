# Security Review: AI Scientific Calculator

## Scope

Reviewed FastAPI `/calculate`, optional `/ai-assist`, frontend error handling, Docker/nginx deployment files, secrets exposure, and OWASP LLM Top 10 concerns.

## Findings

| ID | Severity | Surface | Finding | Mitigation status |
|---|---|---|---|---|
| SEC-001 | LOW | Secrets | No real `ANTHROPIC_API_KEY` or GitHub token is committed. `.env.example` contains placeholders only. | PASS |
| SEC-002 | MEDIUM | `/calculate` | Expression evaluation is constrained by allowlisted functions and unsafe token rejection. Tests cover import/open/globals/unknown function payloads. | PASS |
| SEC-003 | MEDIUM | `/ai-assist` | Prompt injection is possible in any LLM feature, but service uses a restrictive system prompt, requests JSON-only expression output, validates through the same math engine, and no live key is required. | PASS WITH RECOMMENDATION |
| SEC-004 | MEDIUM | `/ai-assist` | Public deployment should rate-limit AI calls to control abuse and Anthropic spend. | RECOMMENDED |
| SEC-005 | LOW | Auth/PII | No accounts, auth, payments, database, or PII are in scope. | PASS |
| SEC-006 | LOW | Dependencies | CI installs current Python/Node dependencies and tests/builds pass. Future releases should add Dependabot or scheduled dependency review. | RECOMMENDED |

## OWASP LLM Top 10 Notes

- Prompt Injection: mitigated by server-side prompt constraints and post-model expression validation.
- Sensitive Information Disclosure: no secrets are sent to the model except the API key used for auth by SDK; the key is server-side only.
- Supply Chain: dependencies are public npm/pip packages. Recommend Dependabot.
- Model Denial of Service: recommend rate limiting `/api/ai-assist` before public deployment.
- Excessive Agency: not applicable. The model cannot call tools, mutate data, or execute code.

## Input Sanitization Audit

- `/calculate` rejects unsafe patterns and unsafe tokens before `sympify`.
- Unknown symbols are rejected.
- Expression length is constrained by Pydantic to 512 characters.
- AI natural language input length is constrained to 1000 characters.
- AI output is parsed as JSON, then the expression is evaluated by the same math engine.

## Rate Limiting Recommendation

Before any public deployment, add one of:

1. nginx rate limiting for `/api/ai-assist`, for example 10 requests/minute/IP.
2. FastAPI middleware such as slowapi with separate limits for `/ai-assist` and `/calculate`.

## Verdict

No critical or high unmitigated findings. The application is acceptable for local/demo use. Public deployment should add rate limiting and dependency automation.
