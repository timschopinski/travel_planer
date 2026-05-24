from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class TripBase(BaseModel):
    date: date
    country: str
    city: str
    cost: Optional[float] = None
    notes: Optional[str] = None


class TripCreate(TripBase):
    pass


class TripUpdate(BaseModel):
    date: Optional[date] = None
    country: Optional[str] = None
    city: Optional[str] = None
    cost: Optional[float] = None
    notes: Optional[str] = None
    weather_temp: Optional[float] = None
    weather_description: Optional[str] = None
    weather_code: Optional[int] = None


class TripResponse(TripBase):
    id: int
    weather_temp: Optional[float] = None
    weather_description: Optional[str] = None
    weather_code: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WeatherResponse(BaseModel):
    city: str
    temperature: float
    description: str
    weather_code: int
