# Structure du frontend

## Arborescence

- `src/`
  - `main.tsx` : Point d’entrée de l’application
  - `App.tsx` : Définition des routes principales
  - `lib/` : Fonctions utilitaires, constantes, client API
  - `hooks/` : Hooks personnalisés
  - `providers/` : Contextes React (thème, WebSocket, etc.)
  - `types/` : Types TypeScript globaux
  - `api/` : Fonctions pour appeler l’API
  - `components/` : Composants réutilisables (layout, UI, icônes, etc.)
  - `features/` : Fonctionnalités principales (auth, étudiant, admin, commun)
  - `assets/` : Images, polices, icônes, styles, mocks, tests, docs

## Bonnes pratiques

- Utiliser des composants réutilisables
- Typage strict avec TypeScript
- Séparation claire des responsabilités
- Utilisation de hooks pour la logique métier