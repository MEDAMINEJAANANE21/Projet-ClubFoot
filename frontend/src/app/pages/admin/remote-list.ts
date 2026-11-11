import { DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { toApiError } from '../../core/http/api-error';

type LoadState = 'loading' | 'ready' | 'error';

/**
 * État d'une liste chargée depuis l'API : chargement, erreur, et remplacement d'un élément modifié.
 * Refactoring utilisé : Extract Class — la même logique servait aux trois écrans de l'espace admin.
 */
export class RemoteList<T extends { readonly id: number }> {
  readonly items = signal<readonly T[]>([]);
  readonly state = signal<LoadState>('loading');
  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly loader: () => Observable<T[]>,
    private readonly destroyRef: DestroyRef,
  ) {}

  load(): void {
    this.state.set('loading');
    this.errorMessage.set(null);
    this.loader()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.items.set(items);
          this.state.set('ready');
        },
        error: (error: unknown) => {
          this.errorMessage.set(toApiError(error).message);
          this.state.set('error');
        },
      });
  }

  /** Envoie une modification et remplace l'élément par la version renvoyée par l'API. */
  update(request: Observable<T>): void {
    this.errorMessage.set(null);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updated) => this.items.update((items) => items.map((item) => (item.id === updated.id ? updated : item))),
      error: (error: unknown) => this.errorMessage.set(toApiError(error).message),
    });
  }
}
