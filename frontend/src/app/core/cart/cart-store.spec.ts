import { TestBed } from '@angular/core/testing';

import { Product } from '../api/models';
import { CartStore, MAX_QUANTITY } from './cart-store';

const JERSEY: Product = {
  id: 1,
  name: 'Maillot domicile 23/24',
  category: 'JERSEY',
  color: 'Rouge',
  price: 800,
  imageUrl: '/images/boutique/maillot-domicile.jpeg',
  badge: null,
};

const POLO: Product = { ...JERSEY, id: 5, name: 'Polo rouge', category: 'POLO', price: 600 };

describe('CartStore', () => {
  let cart: CartStore;

  beforeEach(() => {
    localStorage.clear();
    cart = TestBed.inject(CartStore);
  });

  it('regroupe un même produit ajouté deux fois', () => {
    cart.add(JERSEY);
    cart.add(JERSEY);

    expect(cart.entries()).toHaveLength(1);
    expect(cart.entries()[0].quantity).toBe(2);
    expect(cart.count()).toBe(2);
  });

  it('calcule le total de tous les articles', () => {
    cart.add(JERSEY);
    cart.add(JERSEY);
    cart.add(POLO);

    expect(cart.total()).toBe(2200);
  });

  it('retire un produit quand sa quantité tombe à zéro', () => {
    cart.add(JERSEY);
    cart.setQuantity(JERSEY.id, 0);

    expect(cart.isEmpty()).toBe(true);
  });

  it('plafonne la quantité au maximum autorisé par l’API', () => {
    cart.add(JERSEY);
    cart.setQuantity(JERSEY.id, 99);

    expect(cart.entries()[0].quantity).toBe(MAX_QUANTITY);
  });

  it('prépare les lignes de commande sans les prix', () => {
    cart.add(JERSEY);
    cart.add(POLO);

    expect(cart.toOrderLines()).toEqual([
      { productId: 1, quantity: 1 },
      { productId: 5, quantity: 1 },
    ]);
  });

  it('sauvegarde le panier dans le navigateur', () => {
    cart.add(POLO);
    TestBed.tick();

    const saved = JSON.parse(localStorage.getItem('wac-cart') ?? '[]') as { productId: number }[];
    expect(saved.map((item) => item.productId)).toEqual([5]);
  });
});
