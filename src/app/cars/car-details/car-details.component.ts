import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CarService } from '../car.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule],
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
    this.route.params.subscribe((params: any) => {
      const carId = params['id'];
      if (carId) {
        this.carService.getById(carId).subscribe({
          next: (car: Car) => {
            this.car = car;
            this.loading = false;
          },
          error: (err: any) => {
            console.error('Failed to load car:', err);
            this.loading = false;
          }
        });
      }
    });
  }
}
