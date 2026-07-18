import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { CarService } from '../car.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './car-details.html',
  styleUrls: ['./car-details.scss'],
})
export class CarDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly carService = inject(CarService);

  car: Car | null = null;
  loading = false;
  notFound = false;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const carId = params['id'] as string | undefined;
      if (!carId) {
        this.notFound = true;
        return;
      }

      this.loading = true;
      this.carService.getById(carId).subscribe({
        next: (car: Car | undefined) => {
          this.car = car ?? null;
          this.notFound = !car;
          this.loading = false;
        },
        error: () => {
          this.notFound = true;
          this.loading = false;
        },
      });
    });
  }
}
