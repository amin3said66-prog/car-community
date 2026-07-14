import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarService } from '../car.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './car-form.html',
  styleUrls: ['./car-form.scss']
})
export class CarFormComponent {
  carForm: FormGroup;
  loading = false;
  success = false;

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private router: Router
  ) {
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
      image:        ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=400&fit=crop']
    });
  }

  onSubmit(): void {
    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formVal = this.carForm.value;

    const newCar: Car = {
      ...formVal,
      id: '',
      owner: 'You',
      ownerId: 'current-user',
      ownerImage: 'https://i.pravatar.cc/150?img=10',
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
      error: (err: unknown) => {
        console.error('Failed to create car:', err);
        this.loading = false;
      }
    });
  }

  field(name: string) { return this.carForm.get(name); }
  isInvalid(name: string) { const f = this.field(name); return f?.invalid && f?.touched; }
}
