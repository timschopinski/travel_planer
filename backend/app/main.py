from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import trips, weather

app = FastAPI(title="Travel Planner API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trips.router)
app.include_router(weather.router)


@app.get("/health")
def health():
    return {"status": "ok"}
