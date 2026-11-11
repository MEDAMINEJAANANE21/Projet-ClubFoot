import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MembershipApi } from '../../core/api/membership-api';
import { Gender, IdentityDocument, MembershipRequest } from '../../core/api/models';
import { toApiError } from '../../core/http/api-error';
import { applyServerErrors, errorMessage, shouldShowError } from '../../shared/forms/form-errors';
import { FormStatus, invalidFormStatus } from '../../shared/forms/form-status';
import { focusFirstInvalidField } from '../../shared/forms/focus';
import { ageRangeValidator, atLeastOneChecked, phoneValidator } from '../../shared/forms/validators';
import { DOCUMENT_LABELS, GENDER_LABELS } from '../../shared/formatting/labels';

const MIN_AGE = 5;
const MAX_AGE = 110;

@Component({
  selector: 'app-membership',
  imports: [ReactiveFormsModule],
  templateUrl: './membership.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembershipPage {
  private readonly membershipApi = inject(MembershipApi);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly countries = [
    'Maroc', 'Afrique du Sud', 'Algérie', 'Allemagne', 'Belgique', 'Canada', "Côte d'Ivoire", 'Égypte',
    'Espagne', 'États-Unis', 'France', 'Italie', 'Mauritanie', 'Pays-Bas', 'Portugal', 'Royaume-Uni',
    'Sénégal', 'Suisse', 'Tunisie', 'Autre',
  ] as const;
  protected readonly genders = Object.entries(GENDER_LABELS) as [Gender, string][];
  protected readonly documents = Object.entries(DOCUMENT_LABELS) as [IdentityDocument, string][];

  protected readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(120)]],
    birthDate: ['', [Validators.required, ageRangeValidator(MIN_AGE, MAX_AGE)]],
    gender: this.fb.control<Gender | ''>('', Validators.required),
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, phoneValidator()]],
    address: ['', [Validators.required, Validators.maxLength(255)]],
    country: ['', Validators.required],
    documents: this.fb.group(
      { BIRTH_CERTIFICATE: false, ID_PHOTO: false, NATIONAL_ID_CARD: false },
      { validators: atLeastOneChecked() },
    ),
    consent: [false, Validators.requiredTrue],
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
    this.membershipApi
      .create(this.toRequest())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (membership) => {
          this.status.set({
            type: 'success',
            message: `Demande n° ${membership.id} enregistrée, ${membership.fullName}. Le club vous recontactera.`,
          });
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

  private toRequest(): MembershipRequest {
    const { documents, gender, ...values } = this.form.getRawValue();
    const selectedDocuments = (Object.keys(documents) as IdentityDocument[]).filter((key) => documents[key]);
    return { ...values, gender: gender as Gender, documents: selectedDocuments };
  }
}
