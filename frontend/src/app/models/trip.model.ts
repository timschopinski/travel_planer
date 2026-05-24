export interface Trip {
  id: number;
  date: string;
  country: string;
  city: string;
  cost: number | null;
  notes: string | null;
  weather_temp: number | null;
  weather_description: string | null;
  weather_code: number | null;
  created_at: string;
  updated_at: string;
}

export interface TripCreate {
  date: string;
  country: string;
  city: string;
  cost?: number | null;
  notes?: string | null;
}

export interface TripUpdate {
  date?: string;
  country?: string;
  city?: string;
  cost?: number | null;
  notes?: string | null;
}

export interface WeatherInfo {
  city: string;
  temperature: number;
  description: string;
  weather_code: number;
}
