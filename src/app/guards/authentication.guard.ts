import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const myToken = localStorage.getItem('mySecurityKey');
  if (myToken) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
