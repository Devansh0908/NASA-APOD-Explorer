from pydantic import BaseModel
from typing import Optional

class ApodResponse(BaseModel):
    date: str
    title: str
    explanation: str
    mediaType: str
    url: str
    hdUrl: Optional[str] = None
    copyright: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    cache_size: int
    timestamp: str
