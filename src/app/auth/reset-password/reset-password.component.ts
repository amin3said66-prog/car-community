import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { finalize } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ResetPasswordRequest } from '../models/auth.models';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatCardModule
],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  form: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  error?: string;
  success = false;

  private redirectTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.form = this.fb.group(
      {
        token: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: ResetPasswordComponent.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.router.navigate(['/auth/forgot-password']);
      return;
    }
    this.form.patchValue({ token });
  }

  ngOnDestroy(): void {
    clearTimeout(this.redirectTimer);
  }

  private static passwordMatchValidator(group: AbstractControl): null {
    const g = group as FormGroup;
    const password = g.get('password');
    const confirmPassword = g.get('confirmPassword');
    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      const { mismatch: _discard, ...rest } = confirmPassword.errors ?? {};
      void _discard;
      confirmPassword.setErrors(Object.keys(rest).length ? rest : null);
    }
    return null;
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = undefined;

    const payload: ResetPasswordRequest = {
      token: this.form.value.token as string,
      password: this.form.value.password as string,
      confirmPassword: this.form.value.confirmPassword as string,
    };

    this.authService
      .resetPassword(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.success = true;
          this.redirectTimer = setTimeout(() => this.router.navigate(['/auth/login']), 3000);
        },
        error: (err: unknown) => {
          const e = err as Record<string, unknown> | undefined;
          const inner = e?.['error'] as Record<string, unknown> | undefined;
          this.error =
            (typeof inner?.['message'] === 'string' ? inner['message'] : undefined) ??
            'Password reset failed. Please try again.';
        },
      });
  }
}
