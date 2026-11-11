import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CartDrawer } from './layout/cart-drawer/cart-drawer';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { Toast } from './layout/toast/toast';

// Hauteur de l'en-tête collant + marge : les ancres (#origines…) ne passent pas sous l'en-tête.
const ANCHOR_SCROLL_OFFSET = 140;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CartDrawer, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  constructor() {
    inject(ViewportScroller).setOffset([0, ANCHOR_SCROLL_OFFSET]);
  }

  skipToContent(event: Event): void {
    event.preventDefault();
    this.main().nativeElement.focus();
  }
}
