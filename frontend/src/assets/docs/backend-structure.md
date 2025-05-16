# Structure du backend

## Arborescence

- `src/`
  - `controllers/` : Contrôleurs des routes API
  - `models/` : Modèles de données (ORM)
  - `routes/` : Définition des routes
  - `middlewares/` : Middlewares (auth, erreurs, etc.)
  - `services/` : Logique métier
  - `utils/` : Fonctions utilitaires
  - `config/` : Configuration (base de données, JWT, etc.)
  - `websocket/` : Gestion du WebSocket
  - `tests/` : Tests unitaires et d’intégration

## Bonnes pratiques

- Séparation des couches (contrôleur, service, modèle)
- Validation des entrées
- Gestion centralisée des erreurs
- Sécurité (auth, permissions)