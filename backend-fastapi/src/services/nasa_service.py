import httpx
from typing import Dict, Any, List
from datetime import datetime, timedelta
from src.config.settings import get_settings
from src.utils.cache import cache

settings = get_settings()

NASA_BASE_URL = "https://api.nasa.gov/planetary/apod"

class NASAService:
    @staticmethod
    async def fetch_apod(params: Dict[str, Any]) -> Any:
        """Fetch APOD data from NASA API"""
        params["api_key"] = settings.nasa_api_key
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(NASA_BASE_URL, params=params)
            response.raise_for_status()
            return response.json()
    
    @staticmethod
    def normalize_apod(data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize NASA APOD response to consistent format"""
        return {
            "date": data.get("date"),
            "title": data.get("title"),
            "explanation": data.get("explanation"),
            "mediaType": data.get("media_type"),
            "url": data.get("url"),
            "hdUrl": data.get("hdurl"),
            "copyright": data.get("copyright")
        }
    
    @staticmethod
    async def get_today_apod(hd: bool = False) -> Dict[str, Any]:
        """Get today's APOD with caching"""
        cache_key = f"today_hd={hd}"
        
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data
        
        params = {"thumbs": "true"}
        if hd:
            params["hd"] = "true"
        
        data = await NASAService.fetch_apod(params)
        normalized = NASAService.normalize_apod(data)
        
        cache.set(cache_key, normalized)
        return normalized
    
    @staticmethod
    async def get_apod_by_date(date: str, hd: bool = False) -> Dict[str, Any]:
        """Get APOD for specific date with caching"""
        cache_key = f"date_{date}_hd={hd}"
        
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data
        
        params = {"date": date, "thumbs": "true"}
        if hd:
            params["hd"] = "true"
        
        data = await NASAService.fetch_apod(params)
        normalized = NASAService.normalize_apod(data)
        
        cache.set(cache_key, normalized)
        return normalized
    
    @staticmethod
    async def get_recent_apods(days: int = 10) -> List[Dict[str, Any]]:
        """Get recent APODs with caching"""
        days = min(days, 100)  # Max 100 days
        cache_key = f"recent_{days}"
        
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days - 1)
        
        params = {
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d"),
            "thumbs": "true"
        }
        
        data = await NASAService.fetch_apod(params)
        
        # Ensure data is a list
        if not isinstance(data, list):
            data = [data]
        
        # Normalize and sort by date (most recent first)
        normalized = [NASAService.normalize_apod(item) for item in data]
        normalized.sort(key=lambda x: x["date"], reverse=True)
        
        cache.set(cache_key, normalized)
        return normalized
