# Dossier `assets/tests/`

Ce dossier contient la configuration des tests pour l’application.

## Structure

- `setup.ts` : Configuration des tests (MSW, mocks globaux)
- `utils.ts` : Utilitaires pour les tests (rendu, simulation d'événements, etc.)
- `index.ts` : Export des utilitaires et de la configuration

## Utilitaires disponibles

- `renderWithProviders` : Rend un composant avec les providers (Router, Theme, App)
- `mockUser` : Simule un utilisateur connecté
- `mockReservations` : Simule des réservations
- `mockNotifications` : Simule des notifications
- `sleep` : Simule un délai
- `fireEvent` : Simule un événement
- `changeInput` : Simule un changement d'input
- `click` : Simule un clic
- `submitForm` : Simule une soumission de formulaire
- `navigate` : Simule une navigation
- `mockApiResponse` : Simule une réponse d'API
- `mockApiError` : Simule une erreur d'API

## Comment ajouter de nouveaux utilitaires

1. Ajoutez votre utilitaire dans le fichier `utils.ts`.
2. Exportez-le dans le fichier `index.ts`.

Exemple :

```tsx
// Nouvel utilitaire
export function nouvelUtilitaire() {
  // ...
}

// Export dans index.ts
export { nouvelUtilitaire } from "./utils";
```

## Bonnes pratiques

- Utilisez des noms d'utilitaires descriptifs et en camelCase.
- Ajoutez des commentaires pour expliquer le fonctionnement des utilitaires.
- Utilisez TypeScript pour typer les utilitaires.