import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CartStore } from '../../core/cart/cart-store';

interface NavLink {
  readonly path: string;
  readonly label: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'closeMenu()' },
})
export class Header {
  protected readonly cart = inject(CartStore);
  protected readonly isMenuOpen = signal(false);

  protected readonly links: readonly NavLink[] = [
    { path: '/', label: 'Accueil' },
    { path: '/histoire', label: 'Histoire' },
    { path: '/boutique', label: 'Boutique' },
    { path: '/adhesion', label: 'Adhésion' },
    { path: '/contact', label: 'Contact' },
  ];

  constructor() {
    inject(Router).events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(() => this.closeMenu());
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected cartLabel(): string {
    const count = this.cart.count();
    return `Voir le panier (${count} article${count > 1 ? 's' : ''})`;
  }
}
