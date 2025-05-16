# Dossier `assets/hooks/`

Ce dossier contient des hooks personnalisés utilisés dans l’application.

## Structure

- `useLocalStorage.ts` : Hook pour gérer le stockage local
- `useDebounce.ts` : Hook pour debouncer une valeur
- `useMediaQuery.ts` : Hook pour gérer les media queries
- `index.ts` : Export des hooks

## Hooks disponibles

- `useLocalStorage` : Gère le stockage local (localStorage)
- `useDebounce` : Debounce une valeur (utile pour les recherches, filtres, etc.)
- `useMediaQuery` : Gère les media queries (utile pour le responsive design)

## Comment ajouter un nouveau hook

1. Ajoutez votre hook dans ce dossier.
2. Exportez-le dans le fichier `index.ts`.

Exemple :

```tsx
// Nouveau hook
export function useNouveauHook() {
  // ...
}

// Export dans index.ts
export { useNouveauHook } from "./useNouveauHook";
```

## Bonnes pratiques

- Utilisez des noms de hooks descriptifs et en camelCase.
- Ajoutez des commentaires pour expliquer le fonctionnement des hooks.
- Utilisez TypeScript pour typer les paramètres et les retours des hooks.