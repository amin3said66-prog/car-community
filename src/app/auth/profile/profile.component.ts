import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserProfile } from '../models/auth.models';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatCardModule
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  formReady = false;
  form: FormGroup;

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: [''],
      email: [{value: '', disabled: true}],
      phoneNumber: ['']
    });
  }

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.form.patchValue({
          fullName: p.fullName,
          email: p.email,
          phoneNumber: (p as any).phoneNumber || ''
        });
        this.formReady = true;
      }
    });
  }

  save() {
    // Implement update profile backend call (e.g., /api/auth/profile/update)
    // placeholder for now
    alert('Save profile: implement API endpoint to persist changes.');
  }
}
