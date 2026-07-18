import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ImgFallbackDirective } from '../../shared/img-fallback.directive';
import { CarService } from '../car.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, ImgFallbackDirective],
  templateUrl: './car-details.html',
  styleUrls: ['./car-details.scss'],
})
export class CarDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly carService = inject(CarService);

  car: Car | null = null;
  loading = true;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.carService.getById(id).subscribe({
        next: (car) => { this.car = car ?? null; this.loading = false; },
        error: () => { this.car = null; this.loading = false; },
      });
    });
  }
}
