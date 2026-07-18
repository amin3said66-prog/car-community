import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (!auth.getToken()) {
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  return true;
};

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return auth.getToken() ? router.createUrlTree(['/dashboard']) : true;
};
