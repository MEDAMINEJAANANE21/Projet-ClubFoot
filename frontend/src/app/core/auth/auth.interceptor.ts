import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthStore } from './auth-store';

/**
 * Ajoute le jeton JWT aux appels de l'API et renvoie vers la connexion si la session a expiré.
 * Pattern utilisé : Chain of Responsibility — chaque intercepteur traite la requête puis la passe au suivant.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const token = authStore.validToken();

  const authorizedRequest = token && request.url.startsWith('/api/')
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && token) {
        authStore.logout();
        void router.navigate(['/admin/connexion'], { queryParams: { expiree: 1 } });
      }
      return throwError(() => error);
    }),
  );
};
