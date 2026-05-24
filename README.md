# Travel Planner

Aplikacja webowa do planowania podróży w kalendarzu tygodniowym. Umożliwia dodawanie wycieczek do wybranych dni, automatyczne pobieranie pogody oraz przechowywanie danych w bazie PostgreSQL.

## Stos technologiczny

| Warstwa | Technologia |
|---------|-------------|
| Frontend | Angular 19 (standalone components) |
| Backend | FastAPI (Python 3.12) |
| Baza danych | PostgreSQL 16 |
| Migracje | Alembic |
| Pogoda | [open-meteo.com](https://open-meteo.com) (bezpłatne API, bez klucza) |
| Konteneryzacja | Docker + Docker Compose |

## Wymagania

- [Docker](https://docs.docker.com/get-docker/) z włączonym Docker Compose

## Uruchomienie

```bash
docker compose up --build
```

Po zbudowaniu obrazów aplikacja jest dostępna pod adresami:

| Usługa | URL |
|--------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |

Zatrzymanie:

```bash
docker compose down
```

Zatrzymanie wraz z usunięciem danych (wolumen PostgreSQL):

```bash
docker compose down -v
```

## Struktura projektu

```
travel_planer/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── entrypoint.sh              # uruchamia migracje, potem serwer
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   │       └── 001_create_trips_table.py
│   └── app/
│       ├── main.py                # aplikacja FastAPI + CORS
│       ├── database.py            # konfiguracja SQLAlchemy
│       ├── models.py              # model Trip (ORM)
│       ├── schemas.py             # schematy Pydantic
│       └── routers/
│           ├── trips.py           # CRUD /api/trips
│           └── weather.py         # GET /api/weather/{city}
└── frontend/
    ├── Dockerfile                 # build wieloetapowy: Angular → nginx
    ├── nginx.conf                 # routing SPA + proxy /api/ → backend
    ├── angular.json
    ├── tsconfig.json
    ├── package.json
    └── src/
        └── app/
            ├── app.component.ts
            ├── app.config.ts
            ├── app.routes.ts
            ├── models/
            │   └── trip.model.ts
            ├── services/
            │   ├── trip.service.ts
            │   └── weather.service.ts
            └── components/
                ├── calendar/      # widok tygodniowy
                └── trip-modal/    # modal dodawania / edycji
```

## API

### Wycieczki

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `GET` | `/api/trips/` | lista wszystkich wycieczek |
| `POST` | `/api/trips/` | dodaj wycieczkę (pogoda pobierana automatycznie) |
| `GET` | `/api/trips/{id}` | szczegóły wycieczki |
| `PUT` | `/api/trips/{id}` | edytuj wycieczkę |
| `DELETE` | `/api/trips/{id}` | usuń wycieczkę |

### Pogoda

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `GET` | `/api/weather/{city}` | aktualna pogoda dla miasta |

Przykładowe ciało żądania `POST /api/trips/`:

```json
{
  "date": "2026-06-15",
  "country": "France",
  "city": "Paris",
  "cost": 2500.00,
  "notes": "Wycieczka z rodziną"
}
```

## Funkcjonalności

- **Kalendarz tygodniowy** — nawigacja między tygodniami (poprzedni / następny / dziś)
- **Dodawanie wycieczki** — kliknięcie w dowolny dzień lub przycisk `+` otwiera formularz
- **Edycja i usuwanie** — kliknięcie w kartę wycieczki otwiera formularz edycji
- **Automatyczna pogoda** — po wpisaniu nazwy miasta aplikacja pobiera bieżącą temperaturę i opis warunków atmosferycznych z open-meteo
- **Persystencja danych** — wszystkie wpisy przechowywane w PostgreSQL

## Migracje Alembic

Migracje uruchamiane są automatycznie przy starcie kontenera `backend`. Aby wygenerować nową migrację ręcznie:

```bash
docker compose exec backend alembic revision --autogenerate -m "opis zmiany"
docker compose exec backend alembic upgrade head
```

## Zmienne środowiskowe

Backend konfigurowany jest przez zmienną `DATABASE_URL` ustawianą w `docker-compose.yml`. Przykładowe wartości (plik `backend/.env.example`):

```env
DATABASE_URL=postgresql://travel_user:travel_pass@db:5432/travel_db
POSTGRES_USER=travel_user
POSTGRES_PASSWORD=travel_pass
POSTGRES_DB=travel_db
```
