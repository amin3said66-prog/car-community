/**
 * Error Interceptor
 * Handles HTTP errors globally and normalises them into a consistent shape.
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

export interface HttpErrorPayload {
  status: number;
  message: string;
  error: unknown;
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = this.getErrorMessage(error);
        const payload: HttpErrorPayload = { status: error.status, message, error: error.error };
        return throwError(() => payload);
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return error.error.message;
    }

    switch (error.status) {
      case 0:   return 'Unable to connect to server';
      case 400: return (error.error as { message?: string })?.message ?? 'Bad request';
      case 401: return 'Unauthorized. Please login again.';
      case 403: return 'Access forbidden';
      case 404: return 'Resource not found';
      case 500: return 'Server error. Please try again later.';
      default:  return error.statusText || 'Unknown error';
    }
  }
}
