from fastapi import APIRouter
from backend.app.errors import CalculatorError, raise_calculator_error
from backend.app.schemas import CalculationRequest, CalculationResponse, HealthResponse, AIAssistRequest, AIAssistResponse
from backend.app.services.math_engine import MathEngine
from backend.app.services.ai_assist import AIAssistService

router = APIRouter()
engine = MathEngine()
ai_service = AIAssistService(engine)

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

@router.post("/ai-assist", response_model=AIAssistResponse)
def ai_assist(payload: AIAssistRequest) -> AIAssistResponse:
    try:
        assisted = ai_service.assist(payload.natural_language)
        return AIAssistResponse(natural_language=payload.natural_language, **assisted)
    except CalculatorError as exc:
        raise_calculator_error(exc.code, exc.status_code)
