import httpx
from fastapi import APIRouter, HTTPException
from app.schemas import WeatherResponse

router = APIRouter(prefix="/api/weather", tags=["weather"])

WMO_DESCRIPTIONS = {
    0: "Clear sky",
    1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Heavy drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    77: "Snow grains",
    80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
    85: "Slight snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
}


def get_weather_description(code: int) -> str:
    return WMO_DESCRIPTIONS.get(code, "Unknown")


@router.get("/{city}", response_model=WeatherResponse)
async def get_weather(city: str):
    async with httpx.AsyncClient(timeout=10.0) as client:
        geo_resp = await client.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={"name": city, "count": 1, "language": "en", "format": "json"},
        )
        geo_data = geo_resp.json()

        if not geo_data.get("results"):
            raise HTTPException(status_code=404, detail=f"City '{city}' not found")

        result = geo_data["results"][0]
        lat, lon = result["latitude"], result["longitude"]
        city_name = result["name"]

        weather_resp = await client.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": lat,
                "longitude": lon,
                "current": "temperature_2m,weather_code",
                "timezone": "auto",
            },
        )
        weather_data = weather_resp.json()
        current = weather_data["current"]
        code = current["weather_code"]

        return WeatherResponse(
            city=city_name,
            temperature=current["temperature_2m"],
            description=get_weather_description(code),
            weather_code=code,
        )
