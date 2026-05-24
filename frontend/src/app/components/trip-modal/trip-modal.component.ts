import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, TripCreate, TripUpdate } from '../../models/trip.model';
import { TripService } from '../../services/trip.service';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-trip-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-modal.component.html',
  styleUrl: './trip-modal.component.css',
})
export class TripModalComponent implements OnChanges {
  @Input() selectedDate: string | null = null;
  @Input() editTrip: Trip | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  country = '';
  city = '';
  cost: number | null = null;
  notes = '';
  loading = false;
  error = '';
  weatherPreview: string = '';
  weatherLoading = false;

  constructor(
    private tripService: TripService,
    private weatherService: WeatherService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editTrip'] || changes['selectedDate']) {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.error = '';
    this.weatherPreview = '';
    if (this.editTrip) {
      this.country = this.editTrip.country;
      this.city = this.editTrip.city;
      this.cost = this.editTrip.cost;
      this.notes = this.editTrip.notes ?? '';
    } else {
      this.country = '';
      this.city = '';
      this.cost = null;
      this.notes = '';
    }
  }

  onCityBlur(): void {
    if (!this.city.trim()) {
      this.weatherPreview = '';
      return;
    }
    this.weatherLoading = true;
    this.weatherPreview = '';
    this.weatherService.getWeather(this.city).subscribe({
      next: (w) => {
        const emoji = this.weatherService.getWeatherEmoji(w.weather_code);
        this.weatherPreview = `${emoji} ${w.temperature}°C — ${w.description}`;
        this.weatherLoading = false;
      },
      error: () => {
        this.weatherPreview = 'Could not fetch weather';
        this.weatherLoading = false;
      },
    });
  }

  save(): void {
    if (!this.country.trim() || !this.city.trim()) {
      this.error = 'Country and city are required.';
      return;
    }
    this.loading = true;
    this.error = '';

    if (this.editTrip) {
      const data: TripUpdate = {
        country: this.country,
        city: this.city,
        cost: this.cost,
        notes: this.notes || null,
      };
      this.tripService.update(this.editTrip.id, data).subscribe({
        next: () => { this.loading = false; this.saved.emit(); },
        error: () => { this.loading = false; this.error = 'Failed to update trip.'; },
      });
    } else {
      const data: TripCreate = {
        date: this.selectedDate!,
        country: this.country,
        city: this.city,
        cost: this.cost,
        notes: this.notes || null,
      };
      this.tripService.create(data).subscribe({
        next: () => { this.loading = false; this.saved.emit(); },
        error: () => { this.loading = false; this.error = 'Failed to create trip.'; },
      });
    }
  }

  delete(): void {
    if (!this.editTrip) return;
    this.loading = true;
    this.tripService.delete(this.editTrip.id).subscribe({
      next: () => { this.loading = false; this.deleted.emit(); },
      error: () => { this.loading = false; this.error = 'Failed to delete trip.'; },
    });
  }

  close(): void {
    this.closed.emit();
  }

  get formattedDate(): string {
    const d = this.editTrip?.date ?? this.selectedDate;
    if (!d) return '';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }
}
