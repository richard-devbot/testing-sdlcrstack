from fastapi import APIRouter
from backend.app.errors import CalculatorError, raise_calculator_error
from backend.app.schemas import CalculationRequest, CalculationResponse, HealthResponse
from backend.app.services.math_engine import MathEngine

router = APIRouter()
engine = MathEngine()

@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", service="ai-scientific-calculator")

@router.post("/calculate", response_model=CalculationResponse)
def calculate(payload: CalculationRequest) -> CalculationResponse:
    try:
        value = engine.evaluate(payload.expression)
        return CalculationResponse(
            expression=payload.expression,
            result=float(value),
            formatted_result=engine.format_result(value),
            error=None,
        )
    except CalculatorError as exc:
        raise_calculator_error(exc.code, exc.status_code)
