import json
import os
from anthropic import Anthropic
from backend.app.errors import CalculatorError
from backend.app.services.math_engine import MathEngine

SYSTEM_PROMPT = """You translate natural language math requests into one safe calculator expression.
Return JSON only with keys expression, explanation, confidence. Use only: sin, cos, tan, log, ln, sqrt, factorial, pi, e, +, -, *, /, ^, parentheses, and numbers. Never include code, imports, variables, or prose outside JSON."""

class AIAssistService:
    def __init__(self, engine: MathEngine | None = None):
        self.engine = engine or MathEngine()

    def assist(self, natural_language: str) -> dict:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise CalculatorError("AI_NOT_CONFIGURED", status_code=503)
        client = Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=300,
            temperature=0,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": natural_language}],
        )
        text = "".join(block.text for block in message.content if getattr(block, "type", "") == "text")
        try:
            parsed = json.loads(text)
            expression = str(parsed["expression"])
            explanation = str(parsed.get("explanation", "Translated by neural math interpreter."))
            confidence = float(parsed.get("confidence", 0.75))
        except (json.JSONDecodeError, KeyError, TypeError, ValueError) as exc:
            raise CalculatorError("INVALID_EXPRESSION") from exc
        value = self.engine.evaluate(expression)
        return {
            "interpreted_expression": expression,
            "result": float(value),
            "formatted_result": self.engine.format_result(value),
            "explanation": explanation,
            "confidence": max(0.0, min(1.0, confidence)),
        }
