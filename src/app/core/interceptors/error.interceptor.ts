/**
 * Error Interceptor
 * Handles HTTP errors globally
 */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessage(error);

        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          url: error.url,
        });

        return throwError(() => ({
          status: error.status,
          message: errorMessage,
          error: error.error,
        }));
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return error.error.message;
    } else {
      // Server-side error
      if (error.status === 0) {
        return 'Unable to connect to server';
      } else if (error.status === 400) {
        return error.error?.message || 'Bad request';
      } else if (error.status === 401) {
        return 'Unauthorized. Please login again.';
      } else if (error.status === 403) {
        return 'Access forbidden';
      } else if (error.status === 404) {
        return 'Resource not found';
      } else if (error.status === 500) {
        return 'Server error. Please try again later.';
      } else {
        return `Error: ${error.statusText || 'Unknown error'}`;
      }
    }
  }
}
