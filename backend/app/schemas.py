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
