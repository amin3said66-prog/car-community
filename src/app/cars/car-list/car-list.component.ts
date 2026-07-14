import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarService } from '../car.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-list.html',
  styleUrls: ['./car-list.scss']
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  loading = false;

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.loading = true;
    this.carService.getAll().subscribe({
      next: (cars: Car[]) => {
        this.cars = cars;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load cars:', err);
        this.loading = false;
      }
    });
  }
}
