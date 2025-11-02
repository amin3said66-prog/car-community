import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../models/auth.models';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  form: FormGroup;
  hidePassword = true;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    this.error = null;
    if (this.form.invalid) return;
    this.loading = true;
    const payload: LoginRequest = {
      email: this.form.value.email!,
      password: this.form.value.password!
    };
    
    this.auth.login(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']); // or redirect to intended route
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.error = err?.error?.message || 'Invalid email or password. Please try again.';
        }
      });
  }
}
