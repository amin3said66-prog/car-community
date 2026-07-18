import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CarService } from '../car.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule],
  templateUrl: './car-list.html',
  styleUrls: ['./car-list.scss'],
})
export class CarListComponent implements OnInit {
  private readonly carService = inject(CarService);

  cars: Car[] = [];
  filtered: Car[] = [];
  loading = false;
  error: string | null = null;
  search = '';
  fuelFilter = '';

  readonly fuelTypes = ['', 'petrol', 'diesel', 'hybrid', 'electric'];

  ngOnInit(): void {
    this.loading = true;
    this.carService.getAll().subscribe({
      next: (cars: Car[]) => { this.cars = cars; this.filtered = cars; this.loading = false; },
      error: () => { this.error = 'Failed to load cars.'; this.loading = false; },
    });
  }

  applyFilters(): void {
    let result = this.cars;
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      result = result.filter(c =>
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.color.toLowerCase().includes(q)
      );
    }
    if (this.fuelFilter) result = result.filter(c => c.fuelType === this.fuelFilter);
    this.filtered = result;
  }

  clearFilters(): void {
    this.search = '';
    this.fuelFilter = '';
    this.filtered = this.cars;
  }

  /** Returns a Material Icon name for the given fuel type */
  fuelIcon(fuel: string): string {
    const map: Record<string, string> = {
      electric: 'bolt',
      petrol:   'local_gas_station',
      diesel:   'water_drop',
      hybrid:   'eco',
    };
    return map[fuel] ?? 'local_gas_station';
  }

  stars(rating: number): string {
    const r = Math.round(rating);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }
}
