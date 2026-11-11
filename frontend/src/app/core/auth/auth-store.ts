import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { LoginRequest, TokenResponse } from '../api/models';
import { safeStorage } from '../storage/safe-storage';

const STORAGE_KEY = 'wac-admin-session';

type Session = TokenResponse;

function isExpired(session: Session): boolean {
  return new Date(session.expiresAt).getTime() <= Date.now();
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly http = inject(HttpClient);
  private readonly session = signal<Session | null>(safeStorage.read<Session>(STORAGE_KEY));

  readonly username = computed(() => this.session()?.username ?? null);

  login(credentials: LoginRequest): Observable<void> {
    return this.http.post<TokenResponse>('/api/auth/login', credentials).pipe(
      tap((response) => {
        this.session.set(response);
        safeStorage.write(STORAGE_KEY, response);
      }),
      map(() => undefined),
    );
  }

  logout(): void {
    this.session.set(null);
    safeStorage.remove(STORAGE_KEY);
  }

  // Méthode plutôt que computed : l'expiration dépend de l'heure, pas seulement du signal.
  validToken(): string | null {
    const session = this.session();
    return session && !isExpired(session) ? session.token : null;
  }

  isAuthenticated(): boolean {
    return this.validToken() !== null;
  }
}
