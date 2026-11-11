import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthStore } from './auth-store';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let authStore: AuthStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'admin/connexion', children: [] }]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    authStore = TestBed.inject(AuthStore);
  });

  afterEach(() => httpTesting.verify());

  function logIn(): void {
    authStore.login({ username: 'admin', password: 'secret' }).subscribe();
    httpTesting.expectOne('/api/auth/login').flush({
      token: 'jeton-de-test',
      username: 'admin',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    });
  }

  it('n’ajoute pas de jeton quand personne n’est connecté', () => {
    http.get('/api/orders').subscribe();

    expect(httpTesting.expectOne('/api/orders').request.headers.has('Authorization')).toBe(false);
  });

  it('ajoute le jeton JWT aux appels de l’API une fois connecté', () => {
    logIn();
    http.get('/api/orders').subscribe();

    const request = httpTesting.expectOne('/api/orders').request;
    expect(request.headers.get('Authorization')).toBe('Bearer jeton-de-test');
  });

  it('déconnecte l’administrateur quand l’API répond 401', () => {
    logIn();
    http.get('/api/orders').subscribe({ error: () => undefined });

    httpTesting.expectOne('/api/orders').flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(authStore.isAuthenticated()).toBe(false);
  });
});
