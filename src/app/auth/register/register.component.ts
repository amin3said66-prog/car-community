import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { RegisterRequest } from '../models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
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

    this.loading = true;
    const payload: RegisterRequest = {
      fullName: this.form.value.fullName as string,
      email: this.form.value.email as string,
      password: this.form.value.password as string,
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: unknown) => {
        this.loading = false;
        const e = err as Record<string, unknown> | undefined;
        const inner = e?.['error'] as Record<string, unknown> | undefined;
        this.error =
          (typeof inner?.['message'] === 'string' ? inner['message'] : undefined) ??
          'Registration failed. Please try again.';
      },
    });
  }
}
