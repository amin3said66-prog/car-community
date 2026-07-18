/**
 * Token Interceptor
 * Automatically adds the authorization token to outgoing HTTP requests.
 */
import { Injectable, inject } from '@angular/core';
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
  private readonly authService = inject(AuthService);

  private isRefreshing = false;
  private readonly refreshTokenSubject = new BehaviorSubject<string | null>(null);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token && !this.isPublicUrl(request.url)) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // No refresh-token endpoint in this app — log out the user.
      this.authService.logout();
      this.isRefreshing = false;
      return throwError(() => new Error('Unauthorized'));
    }

    return this.refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap(token => next.handle(this.addToken(request, token)))
    );
  }

  private isPublicUrl(url: string): boolean {
    const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
    return publicPaths.some(path => url.includes(path));
  }
}
