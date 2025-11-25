from fastapi import APIRouter, HTTPException, Query
from typing import List
from datetime import datetime
import httpx
from src.services.nasa_service import NASAService
from src.models.apod import ApodResponse

router = APIRouter(prefix="/api/apod", tags=["APOD"])

@router.get("/today", response_model=ApodResponse)
async def get_today_apod(hd: bool = Query(False, description="Request HD image")):
    """Get today's Astronomy Picture of the Day"""
    try:
        data = await NASAService.get_today_apod(hd=hd)
        return data
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail=f"NASA API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.get("/by-date", response_model=ApodResponse)
async def get_apod_by_date(
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    hd: bool = Query(False, description="Request HD image")
):
    """Get APOD for a specific date"""
    # Validate date format
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    try:
        data = await NASAService.get_apod_by_date(date=date, hd=hd)
        return data
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="No APOD found for this date")
        raise HTTPException(status_code=503, detail=f"NASA API error: {str(e)}")
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail=f"NASA API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.get("/recent", response_model=List[ApodResponse])
async def get_recent_apods(
    days: int = Query(10, ge=1, le=100, description="Number of days (1-100)")
):
    """Get recent APODs for the last N days"""
    try:
        data = await NASAService.get_recent_apods(days=days)
        return data
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail=f"NASA API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
