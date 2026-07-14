/**
 * Token Interceptor
 * Automatically adds authorization token to HTTP requests
 */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token && this.isPublicUrl(request.url) === false) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // In a real app, you would call a refresh token endpoint here
      // For now, we'll just logout
      this.authService.logout();
      return throwError(() => new Error('Unauthorized'));
    } else {
      return this.refreshTokenSubject.pipe(
        filter((result) => result != null),
        take(1),
        switchMap((res) => {
          return next.handle(this.addToken(request, res.token));
        })
      );
    }
  }

  private isPublicUrl(url: string): boolean {
    const publicUrls = ['/login', '/register', '/forgot-password'];
    return publicUrls.some((publicUrl) => url.includes(publicUrl));
  }
}
