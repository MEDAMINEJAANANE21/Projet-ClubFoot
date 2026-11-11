import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';

import { OrderLineRequest, Product } from '../api/models';
import { safeStorage } from '../storage/safe-storage';

export interface CartItem {
  readonly productId: number;
  readonly name: string;
  readonly color: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly quantity: number;
}

export const MAX_QUANTITY = 20;
const STORAGE_KEY = 'wac-cart';

/**
 * Panier de l'utilisateur, partagé par toute l'application et sauvegardé dans le navigateur.
 * Pattern utilisé : Observer — les composants lisent des signaux et se mettent à jour
 * automatiquement à chaque changement du panier.
 */
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly items = signal<readonly CartItem[]>(safeStorage.read<CartItem[]>(STORAGE_KEY) ?? []);

  readonly entries = this.items.asReadonly();
  readonly isOpen = signal(false);
  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly total = computed(() => this.items().reduce((sum, item) => sum + item.price * item.quantity, 0));
  readonly isEmpty = computed(() => this.items().length === 0);

  constructor() {
    effect(() => safeStorage.write(STORAGE_KEY, this.items()));
    this.syncAcrossTabs();
  }

  add(product: Product): void {
    const existing = this.items().find((item) => item.productId === product.id);
    if (existing) {
      this.setQuantity(product.id, existing.quantity + 1);
      return;
    }
    const item: CartItem = {
      productId: product.id,
      name: product.name,
      color: product.color,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    };
    this.items.update((items) => [...items, item]);
  }

  setQuantity(productId: number, quantity: number): void {
    const bounded = Math.min(quantity, MAX_QUANTITY);
    this.items.update((items) =>
      bounded > 0
        ? items.map((item) => (item.productId === productId ? { ...item, quantity: bounded } : item))
        : items.filter((item) => item.productId !== productId),
    );
  }

  remove(productId: number): void {
    this.setQuantity(productId, 0);
  }

  clear(): void {
    this.items.set([]);
  }

  toOrderLines(): OrderLineRequest[] {
    return this.items().map(({ productId, quantity }) => ({ productId, quantity }));
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  private syncAcrossTabs(): void {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        this.items.set(safeStorage.read<CartItem[]>(STORAGE_KEY) ?? []);
      }
    };
    window.addEventListener('storage', onStorage);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('storage', onStorage));
  }
}
