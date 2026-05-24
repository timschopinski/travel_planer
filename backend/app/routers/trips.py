import httpx
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Trip
from app.schemas import TripCreate, TripUpdate, TripResponse
from app.routers.weather import get_weather_description

router = APIRouter(prefix="/api/trips", tags=["trips"])


async def fetch_weather(city: str):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            geo_resp = await client.get(
                "https://geocoding-api.open-meteo.com/v1/search",
                params={"name": city, "count": 1, "language": "en", "format": "json"},
            )
            geo_data = geo_resp.json()
            if not geo_data.get("results"):
                return None, None, None

            result = geo_data["results"][0]
            weather_resp = await client.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": result["latitude"],
                    "longitude": result["longitude"],
                    "current": "temperature_2m,weather_code",
                    "timezone": "auto",
                },
            )
            weather_data = weather_resp.json()
            current = weather_data["current"]
            code = current["weather_code"]
            return current["temperature_2m"], get_weather_description(code), code
    except Exception:
        return None, None, None


@router.get("/", response_model=List[TripResponse])
def list_trips(db: Session = Depends(get_db)):
    return db.query(Trip).order_by(Trip.date).all()


@router.post("/", response_model=TripResponse, status_code=201)
async def create_trip(data: TripCreate, db: Session = Depends(get_db)):
    temp, description, code = await fetch_weather(data.city)
    trip = Trip(
        **data.model_dump(),
        weather_temp=temp,
        weather_description=description,
        weather_code=code,
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@router.put("/{trip_id}", response_model=TripResponse)
async def update_trip(trip_id: int, data: TripUpdate, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    update_data = data.model_dump(exclude_unset=True)

    if "city" in update_data and update_data["city"] != trip.city:
        temp, description, code = await fetch_weather(update_data["city"])
        update_data["weather_temp"] = temp
        update_data["weather_description"] = description
        update_data["weather_code"] = code

    for key, value in update_data.items():
        setattr(trip, key, value)

    db.commit()
    db.refresh(trip)
    return trip


@router.delete("/{trip_id}", status_code=204)
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
