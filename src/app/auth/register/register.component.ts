import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../auth.service';
import { RegisterRequest } from '../models/auth.models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor() {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  submit(): void {
    this.error = null;
    if (this.form.invalid) return;

    const { password, confirmPassword } = this.form.value as { password: string; confirmPassword: string };
    if (password !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    const payload: RegisterRequest = {
      fullName: this.form.value.fullName as string,
      email: this.form.value.email as string,
      password,
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/auth/login']);
      },
      error: (err: unknown) => {
        this.loading = false;
        this.error = this.extractErrorMessage(err) ?? 'Registration failed. Please try again.';
      },
    });
  }

  private extractErrorMessage(err: unknown): string | null {
    if (err instanceof Error) return err.message;
    if (typeof err === 'object' && err !== null) {
      const e = err as Record<string, unknown>;
      if (typeof e['message'] === 'string') return e['message'];
      const inner = e['error'];
      if (typeof inner === 'object' && inner !== null) {
        const msg = (inner as Record<string, unknown>)['message'];
        if (typeof msg === 'string') return msg;
      }
    }
    if (typeof err === 'string') return err;
    return null;
  }
}
