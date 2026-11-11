# Frontend

Application **Angular 22** dans le dossier [`frontend/`](../frontend) : composants *standalone*, *signals*, mode *zoneless* et `ChangeDetectionStrategy.OnPush` partout.

## Structure

```
src/app
├── core/                    Services globaux (un seul exemplaire pour toute l'application)
│   ├── api/                 Appels HTTP : ProductApi, OrderApi, MembershipApi, ContactApi, types
│   ├── auth/                AuthStore, authInterceptor, adminGuard
│   ├── cart/                CartStore (panier)
│   ├── http/                toApiError : lecture des erreurs Problem Details
│   ├── storage/             safeStorage : localStorage sans plantage
│   └── ui/                  ToastStore (notifications)
├── layout/                  Header, Footer, CartDrawer, Toast
├── pages/                   Une page par route
│   ├── home/  history/  shop/  checkout/  membership/  contact/  not-found/
│   └── admin/               login, admin-layout, commandes, adhésions, messages
└── shared/
    ├── forms/               Validateurs, messages d'erreur, focus sur le champ invalide
    └── formatting/          Libellés français, format des prix (PricePipe)
```

Les noms suivent le guide de style Angular actuel : `shop.ts` / `Shop` plutôt que `shop.component.ts` / `ShopComponent`.

## Routes

Toutes les pages sont chargées **à la demande** (`loadComponent`) : chaque page est un fichier JS séparé.

| Route | Page | Accès |
| --- | --- | --- |
| `/` | Accueil | public |
| `/histoire` | Frise chronologique | public |
| `/boutique` | Catalogue et filtres | public |
| `/commande` | Formulaire de livraison et confirmation | public |
| `/adhesion` | Formulaire d'adhésion | public |
| `/contact` | Formulaire de contact | public |
| `/admin/connexion` | Connexion admin | public |
| `/admin/commandes`, `/admin/adhesions`, `/admin/messages` | Espace admin | `adminGuard` |
| `**` | Page introuvable | public |

Le titre de l'onglet est défini dans chaque route (`title`). `withComponentInputBinding()` transmet les paramètres d'URL aux composants, comme `?expiree=1` sur la page de connexion.

## État de l'application

L'état est géré avec des **signals**, sans bibliothèque externe.

| Store | Contenu | Persistance |
| --- | --- | --- |
| `CartStore` | Articles, nombre, total, ouverture du tiroir | `localStorage`, synchronisé entre les onglets |
| `AuthStore` | Jeton JWT et nom de l'administrateur | `localStorage`, vérifie la date d'expiration |
| `ToastStore` | Message de notification | aucune |

```ts
// Pattern Observer : chaque composant qui lit count() se met à jour tout seul.
readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
```

## Communication avec l'API

- Les services de `core/api` appellent des URL **relatives** (`/api/products`). Le proxy les relaie vers le backend.
- En développement, [`proxy.conf.json`](../frontend/proxy.conf.json) relaie `/api` vers `http://localhost:8095`.
- `authInterceptor` ajoute l'en-tête `Authorization: Bearer …` quand l'administrateur est connecté. Sur une réponse 401, il déconnecte et renvoie vers la page de connexion.
- `toApiError()` transforme une erreur HTTP en `{ message, fieldErrors }`. `applyServerErrors()` affiche ensuite chaque erreur sous le bon champ.

## Formulaires

Formulaires réactifs **typés** (`NonNullableFormBuilder`). Chaque formulaire suit le même déroulé :

1. À l'envoi, si le formulaire est invalide, tous les champs sont marqués « touchés » et le premier champ en erreur reçoit le focus.
2. Sinon, la requête part et le bouton passe à « Envoi en cours… ».
3. En cas de succès, un message s'affiche et le formulaire est remis à zéro.
4. En cas d'erreur de l'API, les messages du serveur s'affichent sous les champs concernés.

Validateurs personnalisés (pattern **Strategy**) dans [`validators.ts`](../frontend/src/app/shared/forms/validators.ts) :

| Validateur | Règle |
| --- | --- |
| `phoneValidator()` | Même format que l'API : `06 12 34 56 78` ou `+212 6 12 34 56 78` |
| `ageRangeValidator(min, max)` | Âge calculé à partir de la date de naissance |
| `atLeastOneChecked()` | Au moins une case cochée dans un groupe |

## Accessibilité

- Lien « Aller au contenu » en tête de page.
- Chaque champ a un `label`. Les erreurs sont reliées au champ par `aria-describedby` et signalées par `aria-invalid`.
- Le panier utilise l'élément natif `<dialog>`, qui gère le focus et la touche Échap.
- Le menu mobile se ferme avec Échap et après chaque navigation.
- `prefers-reduced-motion` coupe les animations.

## Tests

```bash
cd frontend
npx ng test --watch=false
```

31 tests avec **Vitest** :

| Fichier | Ce qui est vérifié |
| --- | --- |
| `cart-store.spec.ts` | Regroupement, total, quantité maximale, sauvegarde |
| `validators.spec.ts` | Formats de téléphone, calcul d'âge, cases à cocher |
| `api-error.spec.ts` | Lecture des erreurs Problem Details, serveur injoignable |
| `auth.interceptor.spec.ts` | Ajout du jeton, déconnexion sur 401 |
| `shop.spec.ts` | Affichage des produits, filtres, ajout au panier, erreur réseau |
