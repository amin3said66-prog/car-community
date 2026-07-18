import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { finalize } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  form: FormGroup;
  loading = false;
  submitted = false;
  message?: string;
  error?: string;

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.submitted = true;
    this.error = undefined;

    this.authService
      .forgotPassword({ email: this.form.value.email as string })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.message = 'If the email exists, a reset link will be sent.';
          this.form.reset();
        },
        error: () => {
          this.error = 'Failed to process request. Please try again later.';
        },
      });
  }
}
