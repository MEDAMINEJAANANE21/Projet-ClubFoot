# Guide du développeur

## Prérequis

| Outil | Version |
| --- | --- |
| Java | 25 |
| Node.js | 24 |
| Docker Desktop | récent, pour PostgreSQL |
| Maven | inutile : le projet fournit `mvnw` |

## Lancer le projet en développement

```bash
# 1. Base de données
docker compose up -d db

# 2. API sur http://localhost:8095
cd backend
./mvnw spring-boot:run

# 3. Site sur http://localhost:4300 (dans un autre terminal)
cd frontend
npm install
npm start
```

Le site appelle `/api`, et `ng serve` relaie ces appels vers l'API grâce à `proxy.conf.json`. Les modifications du code Angular s'affichent sans recharger la page.

## Commandes

| Dossier | Commande | Effet |
| --- | --- | --- |
| `backend/` | `./mvnw spring-boot:run` | Lance l'API |
| `backend/` | `./mvnw verify` | Compile et lance les 33 tests |
| `backend/` | `./mvnw package -DskipTests` | Produit `target/clubfoot-api-1.0.0.jar` |
| `frontend/` | `npm start` | Serveur de développement sur le port 4300 |
| `frontend/` | `npx ng test --watch=false` | Lance les 31 tests |
| `frontend/` | `npm run build` | Build de production dans `dist/frontend/browser` |

## Conventions

**Java**

- Conventions Oracle : `PascalCase` pour les classes, `camelCase` pour les méthodes, indentation de 4 espaces.
- Un dossier par fonctionnalité, avec `Controller`, `Service`, `Repository`, entités et DTO.
- DTO en `record`, entités avec un constructeur `protected` vide pour JPA et des méthodes métier (`changeStatus`, `markAsRead`).
- Injection par constructeur, jamais par `@Autowired` sur un champ.
- Messages de validation et d'erreur en français.

**TypeScript / Angular**

- Guide de style Angular : fichiers `shop.ts`, `shop.html`, `shop.scss` ; classes `Shop`, `ProductApi`, `CartStore`.
- `inject()` plutôt que l'injection par constructeur, `input()` et `output()` plutôt que les décorateurs.
- `ChangeDetectionStrategy.OnPush` sur tous les composants, état en signals.
- Nouveau flux de contrôle des templates : `@if`, `@for`, `@switch`.

**Commun**

- Peu de commentaires : seulement pour expliquer *pourquoi*, jamais *ce que fait* le code.
- Fichiers en UTF-8, fins de ligne LF (voir `.editorconfig`).

## Ajouter une fonctionnalité : exemple

Objectif : afficher le **nombre de commandes en attente** dans l'espace admin.

### 1. Backend

Ajouter la requête au repository :

```java
public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {
    long countByStatus(OrderStatus status);
}
```

L'exposer dans le service :

```java
public long countPending() {
    return orderRepository.countByStatus(OrderStatus.PENDING);
}
```

Puis dans le contrôleur :

```java
@GetMapping("/pending-count")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public long countPending() {
    return orderService.countPending();
}
```

La route `/api/**` est déjà réservée aux administrateurs dans `SecurityConfig` : rien à ajouter côté sécurité.

Ajouter un test dans `OrderApiTest` :

```java
@Test
void countsPendingOrders() throws Exception {
    createOrder();
    mockMvc.perform(asAdmin(get("/api/orders/pending-count")))
            .andExpect(status().isOk())
            .andExpect(content().string("1"));
}
```

### 2. Frontend

Ajouter l'appel dans `OrderApi` :

```ts
countPending(): Observable<number> {
  return this.http.get<number>('/api/orders/pending-count');
}
```

L'afficher dans le composant avec un signal :

```ts
protected readonly pendingCount = toSignal(inject(OrderApi).countPending(), { initialValue: 0 });
```

```html
<p>{{ pendingCount() }} commande(s) en attente</p>
```

### 3. Vérifier

```bash
cd backend && ./mvnw verify
cd ../frontend && npx ng test --watch=false && npm run build
```

## Modifier la base de données

1. Créer un fichier `backend/src/main/resources/db/migration/V3__description.sql`.
2. Mettre à jour l'entité JPA correspondante.
3. Relancer l'API : Flyway applique la migration, puis Hibernate vérifie que tout correspond.

Ne jamais modifier une migration déjà appliquée : Flyway le détecterait et refuserait de démarrer.

## Problèmes fréquents

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| `Port 8095 was already in use` | Une autre application utilise le port | Lancer avec `SERVER_PORT=8096` et adapter `proxy.conf.json` |
| `Bind for 0.0.0.0:5433 failed` | Port déjà pris | Changer le port dans `docker-compose.yml` et `DB_URL` |
| « Le serveur est injoignable » sur le site | L'API n'est pas démarrée | Lancer l'API ou `docker compose up` |
| `app.jwt.secret doit contenir au moins 32 caractères` | `JWT_SECRET` trop court | Utiliser une valeur plus longue |
| Erreurs rouges dans VS Code, alors que Maven compile | Cache de l'extension Java | Commande « Java: Clean Java Language Server Workspace » |
