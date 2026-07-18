import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError, delay, of, tap } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
  UpdateProfileRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from './models/auth.models';

interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
}

const MOCK_USERS: MockUser[] = [
  { id: '1', email: 'user@example.com',  password: 'password123', name: 'John Doe',   avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', email: 'admin@example.com', password: 'admin123',    name: 'Admin User', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', email: 'test@example.com',  password: 'test123',     name: 'Test User',  avatar: 'https://i.pravatar.cc/150?img=3' },
];

const generateMockToken = (userId: string): string =>
  btoa(JSON.stringify({ sub: userId, iat: Date.now() }));

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/auth`;
  private readonly useMockAuth = true;

  login(payload: LoginRequest): Observable<AuthResponse> {
    if (this.useMockAuth) {
      return this.mockLogin(payload);
    }
    return this.http.post<AuthResponse>(`${this.base}/login`, payload).pipe(
      tap(res => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
        }
      })
    );
  }

  private mockLogin(payload: LoginRequest): Observable<AuthResponse> {
    const user = MOCK_USERS.find(
      u => u.email === payload.email && u.password === payload.password
    );

    if (!user) {
      return throwError(() => new Error('Invalid email or password')).pipe(delay(500));
    }

    const token = generateMockToken(user.id);
    const response: AuthResponse = {
      token,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
    };

    return of(response).pipe(
      delay(500),
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, payload);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

  updateProfile(data: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.base}/profile`, data);
  }
}
