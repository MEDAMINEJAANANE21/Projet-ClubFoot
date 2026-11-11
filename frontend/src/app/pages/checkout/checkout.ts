import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Order } from '../../core/api/models';
import { OrderApi } from '../../core/api/order-api';
import { CartStore } from '../../core/cart/cart-store';
import { toApiError } from '../../core/http/api-error';
import { applyServerErrors, errorMessage, shouldShowError } from '../../shared/forms/form-errors';
import { FormStatus, invalidFormStatus } from '../../shared/forms/form-status';
import { focusFirstInvalidField } from '../../shared/forms/focus';
import { phoneValidator } from '../../shared/forms/validators';
import { PricePipe } from '../../shared/formatting/price.pipe';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, PricePipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout {
  protected readonly cart = inject(CartStore);
  private readonly orderApi = inject(OrderApi);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = inject(NonNullableFormBuilder).group({
    fullName: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, phoneValidator()]],
    address: ['', [Validators.required, Validators.maxLength(255)]],
    city: ['', [Validators.required, Validators.maxLength(80)]],
  });

  protected readonly isSubmitting = signal(false);
  protected readonly status = signal<FormStatus | null>(null);
  protected readonly confirmedOrder = signal<Order | null>(null);

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
    this.orderApi
      .create({ ...this.form.getRawValue(), lines: this.cart.toOrderLines() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (order) => {
          this.confirmedOrder.set(order);
          this.cart.clear();
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
