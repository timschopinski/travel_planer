import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../../models/trip.model';
import { TripService } from '../../services/trip.service';
import { WeatherService } from '../../services/weather.service';
import { TripModalComponent } from '../trip-modal/trip-modal.component';

interface CalendarDay {
  date: Date;
  dateStr: string;
  label: string;
  dayName: string;
  isToday: boolean;
  trips: Trip[];
}

const TRIP_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#ec4899',
];

type View = 'calendar' | 'trips' | 'expenses' | 'settings';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, TripModalComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  days: CalendarDay[] = [];
  weekOffset = 0;
  trips: Trip[] = [];

  selectedDate: string | null = null;
  editTrip: Trip | null = null;
  showModal = false;

  currentView: View = 'calendar';

  readonly dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  setView(view: View): void {
    this.currentView = view;
  }

  constructor(
    private tripService: TripService,
    public weatherService: WeatherService,
  ) {}

  ngOnInit(): void {
    this.buildWeek();
    this.loadTrips();
  }

  buildWeek(): void {
    const today = new Date();
    const monday = new Date(today);
    const dow = today.getDay() === 0 ? 6 : today.getDay() - 1;
    monday.setDate(today.getDate() - dow + this.weekOffset * 7);

    this.days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = this.toDateStr(d);
      return {
        date: d,
        dateStr,
        label: d.getDate().toString(),
        dayName: this.dayNames[i],
        isToday: this.toDateStr(today) === dateStr,
        trips: [],
      };
    });

    this.assignTripsToDay();
  }

  private assignTripsToDay(): void {
    this.days.forEach((day) => {
      day.trips = this.trips.filter((t) => t.date === day.dateStr);
    });
  }

  loadTrips(): void {
    this.tripService.getAll().subscribe({
      next: (trips) => {
        this.trips = trips;
        this.assignTripsToDay();
      },
    });
  }

  prevWeek(): void {
    this.weekOffset--;
    this.buildWeek();
  }

  nextWeek(): void {
    this.weekOffset++;
    this.buildWeek();
  }

  todayWeek(): void {
    this.weekOffset = 0;
    this.buildWeek();
  }

  openNewTrip(day: CalendarDay): void {
    this.editTrip = null;
    this.selectedDate = day.dateStr;
    this.showModal = true;
  }

  openEditTrip(trip: Trip, event: MouseEvent): void {
    event.stopPropagation();
    this.editTrip = trip;
    this.selectedDate = trip.date;
    this.showModal = true;
  }

  onSaved(): void {
    this.showModal = false;
    this.loadTrips();
  }

  onDeleted(): void {
    this.showModal = false;
    this.loadTrips();
  }

  onClosed(): void {
    this.showModal = false;
  }

  getTripColor(trip: Trip): string {
    return TRIP_COLORS[trip.id % TRIP_COLORS.length];
  }

  get weekRangeLabel(): string {
    if (this.days.length === 0) return '';
    const first = this.days[0].date;
    const last = this.days[6].date;
    const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    if (first.getMonth() === last.getMonth()) {
      return `${first.toLocaleDateString('en-GB', { month: 'long' })} ${first.getDate()}–${last.getDate()}, ${first.getFullYear()}`;
    }
    return `${first.toLocaleDateString('en-GB', opts)} – ${last.toLocaleDateString('en-GB', opts)}, ${last.getFullYear()}`;
  }

  get totalCost(): number {
    return this.trips.reduce((sum, t) => sum + (t.cost ?? 0), 0);
  }

  get tripsWithCost(): Trip[] {
    return this.trips.filter((t) => t.cost !== null && t.cost! > 0)
      .sort((a, b) => (b.cost ?? 0) - (a.cost ?? 0));
  }

  get upcomingTrips(): Trip[] {
    const today = this.toDateStr(new Date());
    return this.trips
      .filter((t) => t.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  get pastTrips(): Trip[] {
    const today = this.toDateStr(new Date());
    return this.trips
      .filter((t) => t.date < today)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  openEditFromList(trip: Trip): void {
    this.editTrip = trip;
    this.selectedDate = trip.date;
    this.showModal = true;
  }

  private toDateStr(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
