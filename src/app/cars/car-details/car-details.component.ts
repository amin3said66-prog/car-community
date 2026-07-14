import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarService } from '../car.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './car-details.html',
  styleUrls: ['./car-details.scss']
})
export class CarDetailsComponent implements OnInit {
  car: Car | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private carService: CarService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(params => {
      const carId = params['id'];
      if (carId) {
        this.carService.getById(carId).subscribe({
          next: (car: Car) => {
            this.car = car;
            this.loading = false;
          },
          error: (err: unknown) => {
            console.error('Failed to load car:', err);
            this.loading = false;
          }
        });
      }
    });
  }
}
