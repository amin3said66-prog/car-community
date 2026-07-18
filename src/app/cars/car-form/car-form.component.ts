import { Component, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarService } from '../car.service';
import { Car } from '../../models/car.model';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=400&fit=crop';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './car-form.html',
  styleUrls: ['./car-form.scss'],
})
export class CarFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly carService = inject(CarService);
  private readonly router = inject(Router);

  carForm: FormGroup;
  loading = false;
  success = false;
  error: string | null = null;

  constructor() {
    this.carForm = this.fb.group({
      make:         ['', Validators.required],
      model:        ['', Validators.required],
      year:         ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      price:        ['', [Validators.required, Validators.min(0)]],
      mileage:      ['', [Validators.required, Validators.min(0)]],
      color:        ['', Validators.required],
      fuelType:     ['petrol', Validators.required],
      transmission: ['automatic', Validators.required],
      description:  ['', [Validators.required, Validators.minLength(20)]],
      image:        [PLACEHOLDER_IMAGE],
    });
  }

  onSubmit(): void {
    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    const formVal = this.carForm.value as Partial<Car>;

    const newCar: Car = {
      ...(formVal as Car),
      id: '',
      owner: 'You',
      ownerId: 'current-user',
      ownerImage: PLACEHOLDER_IMAGE,
      rating: 0,
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      featured: false,
    };

    this.carService.create(newCar).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/cars']), 1800);
      },
      error: () => {
        this.error = 'Failed to create listing. Please try again.';
        this.loading = false;
      },
    });
  }

  field(name: string): AbstractControl | null {
    return this.carForm.get(name);
  }

  isInvalid(name: string): boolean {
    const f = this.field(name);
    return !!(f?.invalid && f.touched);
  }
}
