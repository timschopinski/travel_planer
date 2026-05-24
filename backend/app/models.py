from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from app.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    country = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    cost = Column(Float, nullable=True)
    notes = Column(String(500), nullable=True)
    weather_temp = Column(Float, nullable=True)
    weather_description = Column(String(100), nullable=True)
    weather_code = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
