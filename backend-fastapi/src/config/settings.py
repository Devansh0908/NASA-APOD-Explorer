from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    nasa_api_key: str
    port: int = 5000
    cache_ttl: int = 600  # 10 minutes
    cache_max_size: int = 100
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings():
    return Settings()
