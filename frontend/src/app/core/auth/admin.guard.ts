import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from './auth-store';

export const adminGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  return authStore.isAuthenticated() || inject(Router).createUrlTree(['/admin/connexion']);
};
