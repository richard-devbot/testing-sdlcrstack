import math
import re
from sympy import E, pi, sympify, factorial
from sympy.functions import sin, cos, tan, log, sqrt
from sympy.core.sympify import SympifyError
from backend.app.errors import CalculatorError

SAFE_LOCALS = {
    "sin": sin,
    "cos": cos,
    "tan": tan,
    "log": log,
    "ln": log,
    "sqrt": sqrt,
    "factorial": factorial,
    "pi": pi,
    "π": pi,
    "e": E,
}
UNSAFE_PATTERNS = ["__", "import", "eval", "exec", "open", "read", "write", "os", "sys", "subprocess", "lambda", "globals", "locals", "[", "]", "{" , "}"]
TOKEN_RE = re.compile(r"[A-Za-z_π]+")

class MathEngine:
    def evaluate(self, expression: str):
        normalized = self._normalize(expression)
        self._validate(normalized)
        try:
            parsed = sympify(normalized, locals=SAFE_LOCALS, evaluate=True)
            result = parsed.evalf()
        except ZeroDivisionError as exc:
            raise CalculatorError("DIVIDE_BY_ZERO") from exc
        except (SympifyError, TypeError, ValueError, SyntaxError) as exc:
            raise CalculatorError("INVALID_EXPRESSION") from exc
        if result in (math.inf, -math.inf) or getattr(result, "is_infinite", False):
            raise CalculatorError("OVERFLOW")
        if getattr(result, "has", lambda *_: False)(complex):
            raise CalculatorError("INVALID_EXPRESSION")
        return result

    def _normalize(self, expression: str) -> str:
        return expression.strip().replace("^", "**").replace("π", "pi")

    def _validate(self, expression: str) -> None:
        lowered = expression.lower()
        if any(pattern in lowered for pattern in UNSAFE_PATTERNS):
            raise CalculatorError("UNSAFE_EXPRESSION")
        for token in TOKEN_RE.findall(expression):
            if token not in SAFE_LOCALS:
                raise CalculatorError("UNSUPPORTED_FUNCTION")

    def format_result(self, value) -> str:
        try:
            numeric = float(value)
            if math.isclose(numeric, round(numeric), abs_tol=1e-12):
                return str(int(round(numeric)))
            return f"{numeric:.12g}"
        except (TypeError, ValueError):
            return str(value)
