import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Product } from '../../core/api/models';
import { CartStore } from '../../core/cart/cart-store';
import { Shop } from './shop';

const PRODUCTS: Product[] = [
  { id: 1, name: 'Maillot 87 ans', category: 'JERSEY', color: 'Rouge royal', price: 800, imageUrl: '/a.jpeg', badge: 'Édition limitée' },
  { id: 5, name: 'Polo rouge', category: 'POLO', color: 'Rouge', price: 600, imageUrl: '/b.jpeg', badge: null },
  { id: 6, name: 'Polo noir', category: 'POLO', color: 'Noir', price: 500, imageUrl: '/c.jpeg', badge: null },
];

describe('Shop', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [Shop],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  async function renderWithProducts() {
    const fixture = TestBed.createComponent(Shop);
    TestBed.inject(HttpTestingController).expectOne('/api/products').flush(PRODUCTS);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  const productNames = (root: HTMLElement) =>
    [...root.querySelectorAll('.product__name')].map((element) => element.textContent?.trim());

  it('affiche les produits renvoyés par l’API', async () => {
    const { root } = await renderWithProducts();

    expect(productNames(root)).toEqual(['Maillot 87 ans', 'Polo rouge', 'Polo noir']);
  });

  it('filtre les produits par catégorie', async () => {
    const { fixture, root } = await renderWithProducts();
    const polosButton = [...root.querySelectorAll<HTMLButtonElement>('.filter')]
      .find((button) => button.textContent?.trim() === 'Polos');

    polosButton?.click();
    await fixture.whenStable();

    expect(productNames(root)).toEqual(['Polo rouge', 'Polo noir']);
  });

  it('ajoute un produit au panier', async () => {
    const { root } = await renderWithProducts();

    root.querySelector<HTMLButtonElement>('.product__footer button')?.click();

    expect(TestBed.inject(CartStore).count()).toBe(1);
  });

  it('affiche un message et un bouton « Réessayer » si l’API ne répond pas', async () => {
    const fixture = TestBed.createComponent(Shop);
    TestBed.inject(HttpTestingController)
      .expectOne('/api/products')
      .flush(null, { status: 0, statusText: 'Unknown Error' });
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Réessayer');
  });
});
