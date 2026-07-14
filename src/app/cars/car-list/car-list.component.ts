import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarService } from '../car.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './car-list.html',
  styleUrls: ['./car-list.scss']
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  filtered: Car[] = [];
  loading = false;
  search = '';
  fuelFilter = '';

  fuelTypes = ['', 'petrol', 'diesel', 'hybrid', 'electric'];

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.loading = true;
    this.carService.getAll().subscribe({
      next: (cars: Car[]) => {
        this.cars = cars;
        this.filtered = cars;
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error('Failed to load cars:', err);
        this.loading = false;
      }
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
    if (this.fuelFilter) {
      result = result.filter(c => c.fuelType === this.fuelFilter);
    }
    this.filtered = result;
  }

  clearFilters(): void {
    this.search = '';
    this.fuelFilter = '';
    this.filtered = this.cars;
  }

  fuelIcon(fuel: string): string {
    const map: Record<string, string> = { electric: '⚡', petrol: '⛽', diesel: '🛢️', hybrid: '🌿' };
    return map[fuel] ?? '⛽';
  }

  stars(rating: number): string {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  }
}
