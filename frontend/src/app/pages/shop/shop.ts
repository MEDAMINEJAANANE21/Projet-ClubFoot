import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { Product, ProductCategory } from '../../core/api/models';
import { ProductApi } from '../../core/api/product-api';
import { CartStore } from '../../core/cart/cart-store';
import { toApiError } from '../../core/http/api-error';
import { ToastStore } from '../../core/ui/toast-store';
import { ProductCard } from './product-card/product-card';

type LoadState = 'loading' | 'ready' | 'error';
type CategoryFilter = ProductCategory | 'ALL';

interface FilterOption {
  readonly value: CategoryFilter;
  readonly label: string;
}

@Component({
  selector: 'app-shop',
  imports: [ProductCard, RouterLink],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shop {
  private readonly productApi = inject(ProductApi);
  private readonly cart = inject(CartStore);
  private readonly toast = inject(ToastStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly filters: readonly FilterOption[] = [
    { value: 'ALL', label: 'Tout' },
    { value: 'JERSEY', label: 'Maillots' },
    { value: 'POLO', label: 'Polos' },
    { value: 'HOODIE', label: 'Sweats' },
  ];

  protected readonly state = signal<LoadState>('loading');
  protected readonly errorMessage = signal('');
  protected readonly selectedCategory = signal<CategoryFilter>('ALL');
  private readonly products = signal<readonly Product[]>([]);

  protected readonly visibleProducts = computed(() => {
    const category = this.selectedCategory();
    return category === 'ALL' ? this.products() : this.products().filter((product) => product.category === category);
  });

  constructor() {
    this.loadProducts();
  }

  protected loadProducts(): void {
    this.state.set('loading');
    this.productApi
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.state.set('ready');
        },
        error: (error: unknown) => {
          this.errorMessage.set(toApiError(error).message);
          this.state.set('error');
        },
      });
  }

  protected addToCart(product: Product): void {
    this.cart.add(product);
    this.toast.show(`Ajouté au panier : ${product.name}`);
  }
}
