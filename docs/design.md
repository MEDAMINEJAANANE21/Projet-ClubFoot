# Design

## Direction

| | |
| --- | --- |
| **Produit** | Le site des supporters du Wydad : histoire, boutique, adhésion |
| **Caractère** | Fier, populaire, direct |
| **Univers** | Le stade Mohammed V un soir de match : la tribune rouge, les maillots, les photos d'archives |
| **Moments forts** | La photo de la tribune et du drapeau en accueil, les photos d'archives de la frise, les photos des produits |
| **Signature** | Tous les chiffres (années, palmarès, prix, références) écrits comme des numéros de maillot, en Barlow Condensed |

L'interface reste sobre : encre et papier chaud. Le **rouge du club** est réservé à trois usages :

1. l'action principale (bouton « Découvrir son histoire », « Passer la commande ») ;
2. la sélection (lien actif du menu, onglet admin, filet d'un encadré) ;
3. le compteur du panier.

La couleur forte vient du contenu (le drapeau, les maillots), pas des boutons ni des fonds.

## Couleurs

Variables CSS définies dans [`styles.scss`](../frontend/src/styles.scss).

| Rôle | Variable | Valeur |
| --- | --- | --- |
| Accent | `--red` | `#c8102e` |
| Accent sur texte ou survol | `--red-dark` | `#9e0b22` |
| Texte principal | `--ink` | `#1f1b16` |
| Texte secondaire | `--ink-secondary` | `#5e554a` |
| Texte discret (légendes, méta) | `--muted` | `#6f665b` |
| Fond de page | `--paper` | `#fdfbf7` |
| Fond de section | `--surface` | `#f4efe7` |
| Filet | `--line` | encre à 10 % |
| Fond sombre (en-tête, bandeaux) | `--night` | `#141210` |
| Texte sur fond sombre | `--on-night` / `--on-night-secondary` | `#f3ede4` / `#b3aa9e` |

Les couleurs de statut (vert, ambre, rouge) servent seulement à porter un sens : expédiée, en attente, erreur.

## Typographie

| Usage | Police | Graisse |
| --- | --- | --- |
| Titres et chiffres | Barlow Condensed | 500 à 600 |
| Texte, boutons, formulaires | Barlow | 400 à 500 |

- Titres en casse de phrase, sans majuscules partout.
- Les chiffres utilisent la classe `.figure` : Barlow Condensed avec des chiffres à largeur fixe (`tabular-nums`), pour qu'ils restent alignés en colonne.
- Pas de point final sur les titres, boutons, légendes et messages courts, ni de point d'exclamation dans l'interface.

## Espacements et formes

- Tous les espacements sont des multiples de 4 px : 8, 12, 16, 20, 24, 32, 40, 48, 64…
- Rayons : 4 px (statuts), 8 px (boutons, champs, filtres), 12 px (cartes, panneaux).
- Profondeur par des filets fins plutôt que des ombres. Une ombre légère seulement pour le filtre actif.

## Animations

- Une seule courbe pour tout : `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease`).
- 150 ms pour les survols, 200 ms pour le menu mobile, 300 à 400 ms pour les entrées (tiroir du panier, titre de l'accueil).
- Seules les couleurs, l'opacité et les transformations sont animées. Rien ne tourne en boucle.
- `prefers-reduced-motion` désactive les animations.

## Composants partagés

| Classe | Usage |
| --- | --- |
| `.btn`, `.btn--primary`, `.btn--outline`, `.btn--light`, `.btn--small`, `.btn--block` | Boutons |
| `.field`, `.field__error`, `.field__hint`, `.choice`, `.choices` | Champs de formulaire |
| `.form`, `.form-layout`, `.form-aside` | Mise en page des formulaires |
| `.alert--success`, `.alert--error` | Messages après envoi |
| `.status--pending`, `.status--success`, `.status--danger` | Statuts dans l'espace admin |
| `.page-hero`, `.section`, `.container` | Mise en page générale |
| `.data-table`, `.table-wrapper` | Tableaux de l'espace admin |
| `.figure` | Chiffres façon numéro de maillot |
