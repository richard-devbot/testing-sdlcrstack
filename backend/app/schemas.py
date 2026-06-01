from pydantic import BaseModel, Field
from typing import Optional, Any

class CalculationRequest(BaseModel):
    expression: str = Field(..., min_length=1, max_length=512)

class ErrorPayload(BaseModel):
    code: str
    message: str

class CalculationResponse(BaseModel):
    expression: str
    result: Any
    formatted_result: str
    error: Optional[ErrorPayload] = None

class HealthResponse(BaseModel):
    status: str
    service: str

class AIAssistRequest(BaseModel):
    natural_language: str = Field(..., min_length=1, max_length=1000)

class AIAssistResponse(BaseModel):
    natural_language: str
    interpreted_expression: str
    result: Any
    formatted_result: str
    explanation: str
    confidence: float = Field(..., ge=0, le=1)
