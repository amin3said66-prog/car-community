import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
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
