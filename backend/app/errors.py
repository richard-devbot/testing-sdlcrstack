from fastapi import HTTPException

THEMED_MESSAGES = {
    "DIVIDE_BY_ZERO": "Singularity detected: division by zero collapsed the equation horizon.",
    "OVERFLOW": "Overflow in the multiverse: the result escaped finite space.",
    "INVALID_EXPRESSION": "Quantum syntax drift: the expression could not be decoded.",
    "UNSAFE_EXPRESSION": "Firewall nebula engaged: unsafe expression rejected.",
    "UNSUPPORTED_FUNCTION": "Unknown neural operator: this function is outside the current matrix.",
    "AI_NOT_CONFIGURED": "Neural uplink offline: Anthropic API key is not configured.",
}

class CalculatorError(Exception):
    def __init__(self, code: str, status_code: int = 400):
        self.code = code
        self.message = THEMED_MESSAGES.get(code, "Anomaly detected in the calculation field.")
        self.status_code = status_code
        super().__init__(self.message)

def raise_calculator_error(code: str, status_code: int = 400) -> None:
    message = THEMED_MESSAGES.get(code, "Anomaly detected in the calculation field.")
    raise HTTPException(status_code=status_code, detail={"code": code, "message": message})
