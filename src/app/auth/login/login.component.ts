import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  form: FormGroup;
  hidePassword = true;
  loading = false;
  error: string | null = null;

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit(): void {
    this.error = null;
    if (this.form.invalid) return;

    this.loading = true;
    const payload: LoginRequest = {
      email: this.form.value.email as string,
      password: this.form.value.password as string,
    };

    this.auth.login(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: unknown) => {
        this.loading = false;
        this.error = this.extractErrorMessage(err) ?? 'Login failed. Please try again.';
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
