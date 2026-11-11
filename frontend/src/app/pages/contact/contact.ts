import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ContactApi } from '../../core/api/contact-api';
import { ContactSubject } from '../../core/api/models';
import { toApiError } from '../../core/http/api-error';
import { applyServerErrors, errorMessage, shouldShowError } from '../../shared/forms/form-errors';
import { FormStatus, invalidFormStatus } from '../../shared/forms/form-status';
import { focusFirstInvalidField } from '../../shared/forms/focus';
import { SUBJECT_LABELS } from '../../shared/formatting/labels';

const MESSAGE_MIN_LENGTH = 20;
const MESSAGE_MAX_LENGTH = 2000;

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  private readonly contactApi = inject(ContactApi);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly subjects = Object.entries(SUBJECT_LABELS) as [ContactSubject, string][];
  protected readonly messageMinLength = MESSAGE_MIN_LENGTH;

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    subject: this.fb.control<ContactSubject | ''>('', Validators.required),
    message: ['', [
      Validators.required,
      Validators.minLength(MESSAGE_MIN_LENGTH),
      Validators.maxLength(MESSAGE_MAX_LENGTH),
    ]],
  });

  protected readonly isSubmitting = signal(false);
  protected readonly status = signal<FormStatus | null>(null);

  protected readonly errorOf = errorMessage;
  protected readonly isInvalid = shouldShowError;

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.status.set(invalidFormStatus());
      focusFirstInvalidField(this.host.nativeElement);
      return;
    }

    this.isSubmitting.set(true);
    this.status.set(null);
    const { subject, ...values } = this.form.getRawValue();
    this.contactApi
      .send({ ...values, subject: subject as ContactSubject })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.status.set({ type: 'success', message: 'Merci ! Votre message a bien été envoyé à l’équipe du site.' });
          this.form.reset();
          this.isSubmitting.set(false);
        },
        error: (error: unknown) => {
          const apiError = toApiError(error);
          applyServerErrors(this.form, apiError.fieldErrors);
          this.status.set({ type: 'error', message: apiError.message });
          this.isSubmitting.set(false);
        },
      });
  }
}
