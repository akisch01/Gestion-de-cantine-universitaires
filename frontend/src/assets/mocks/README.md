# Dossier `assets/mocks/`

Ce dossier contient des données de test pour l’application.

## Structure

- `data.ts` : Données de test (utilisateurs, plats, réservations, notifications)
- `handlers.ts` : Handlers pour simuler les réponses de l'API
- `index.ts` : Export des données et handlers

## Données disponibles

- `MOCK_USERS` : Utilisateurs de test
- `MOCK_PLATS` : Plats de test
- `MOCK_RESERVATIONS` : Réservations de test
- `MOCK_NOTIFICATIONS` : Notifications de test

## Handlers disponibles

- Authentification (login, register, me)
- Plats (list, detail)
- Réservations (list, create)
- Notifications (list, mark as read)
- Admin (users, stats)

## Comment ajouter de nouvelles données de test

1. Ajoutez vos données dans le fichier `data.ts`.
2. Ajoutez vos handlers dans le fichier `handlers.ts`.
3. Exportez-les dans le fichier `index.ts`.

Exemple :

```tsx
// Nouvelles données
export const NOUVELLES_DONNEES = [
  // ...
];

// Nouveaux handlers
export const nouveauxHandlers = [
  // ...
];

// Export dans index.ts
export { NOUVELLES_DONNEES } from "./data";
export { nouveauxHandlers } from "./handlers";
```

## Bonnes pratiques

- Utilisez des données réalistes pour les tests.
- Ajoutez des commentaires pour expliquer les données et les handlers.
- Utilisez TypeScript pour typer les données et les handlers.