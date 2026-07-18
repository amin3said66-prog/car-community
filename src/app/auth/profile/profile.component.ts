import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { UpdateProfileRequest, UserProfile } from '../models/auth.models';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  profile: UserProfile | null = null;
  formReady = false;
  loading = false;
  saveMessage: string | null = null;
  error: string | null = null;

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      fullName: [''],
      email: [{ value: '', disabled: true }],
      phoneNumber: [''],
    });
  }

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: (p: UserProfile) => {
        this.profile = p;
        this.form.patchValue({
          fullName: p.fullName ?? '',
          email: p.email ?? '',
          phoneNumber: p.phoneNumber ?? '',
        });
        this.formReady = true;
      },
      error: () => {
        this.error = 'Failed to load profile. Please try again.';
      },
    });
  }

  save(): void {
    this.saveMessage = null;
    this.error = null;
    this.loading = true;

    const payload: UpdateProfileRequest = {
      fullName: this.form.value.fullName as string,
      phoneNumber: this.form.value.phoneNumber as string,
    };

    this.auth.updateProfile(payload).subscribe({
      next: () => {
        this.loading = false;
        this.saveMessage = 'Profile updated successfully.';
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to save profile. Please try again.';
      },
    });
  }
}
