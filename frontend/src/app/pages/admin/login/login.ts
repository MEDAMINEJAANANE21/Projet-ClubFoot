import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthStore } from '../../../core/auth/auth-store';
import { toApiError } from '../../../core/http/api-error';
import { errorMessage, shouldShowError } from '../../../shared/forms/form-errors';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  /** Paramètre d'URL ?expiree=1, ajouté quand la session a expiré. */
  readonly expiree = input<string>();

  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = inject(NonNullableFormBuilder).group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected readonly isSubmitting = signal(false);
  protected readonly errorText = signal<string | null>(null);

  protected readonly errorOf = errorMessage;
  protected readonly isInvalid = shouldShowError;

  constructor() {
    if (this.authStore.isAuthenticated()) {
      void this.router.navigate(['/admin']);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorText.set(null);
    this.authStore
      .login(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => void this.router.navigate(['/admin']),
        error: (error: unknown) => {
          this.errorText.set(toApiError(error).message);
          this.isSubmitting.set(false);
        },
      });
  }
}
