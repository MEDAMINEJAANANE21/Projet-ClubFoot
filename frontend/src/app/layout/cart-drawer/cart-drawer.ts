import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { CartStore, MAX_QUANTITY } from '../../core/cart/cart-store';
import { PricePipe } from '../../shared/formatting/price.pipe';

@Component({
  selector: 'app-cart-drawer',
  imports: [PricePipe],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDrawer {
  protected readonly cart = inject(CartStore);
  protected readonly maxQuantity = MAX_QUANTITY;
  private readonly router = inject(Router);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    // Le signal isOpen pilote l'élément <dialog> natif, qui gère le focus et la touche Échap.
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.cart.isOpen() && !dialog.open) {
        dialog.showModal();
      } else if (!this.cart.isOpen() && dialog.open) {
        dialog.close();
      }
    });
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.cart.close();
    }
  }

  protected checkout(): void {
    this.cart.close();
    void this.router.navigate(['/commande']);
  }
}
