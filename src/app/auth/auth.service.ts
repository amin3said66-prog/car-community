import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  UserProfile,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest 
} from './models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, payload).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
        }
      })
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, payload);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.base}/profile`);
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/forgot-password`, payload);
  }

  resetPassword(payload: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/reset-password`, payload);
  }

  changePassword(payload: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/change-password`, payload);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  updateProfile(data: any): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.base}/profile`, data);
  }
}
