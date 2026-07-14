import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarService } from '../car.service';
import './car-form.scss';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './car-form.html',
  styleUrls: ['./car-form.scss']
})
export class CarFormComponent {
  carForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private carService: CarService) {
    this.carForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900)]],
      price: ['', [Validators.required, Validators.min(0)]],
      color: ['', Validators.required],
      fuelType: ['petrol', Validators.required],
      transmission: ['automatic', Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      this.loading = true;
      // Mock submit - in real app would call service
      console.log('Form submitted:', this.carForm.value);
      this.loading = false;
      this.carForm.reset();
    }
  }
}
