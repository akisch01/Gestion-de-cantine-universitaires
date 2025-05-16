# Dossier `assets/context/`

Ce dossier contient des contextes React utilisés dans l’application.

## Structure

- `AppContext.tsx` : Contexte global de l'application
- `ThemeContext.tsx` : Contexte pour la gestion du thème
- `index.ts` : Export des contextes

## Contextes disponibles

- `AppContext` : Gère l'état global de l'application (utilisateur, chargement, erreurs)
- `ThemeContext` : Gère le thème de l'application (clair/sombre)

## Comment ajouter un nouveau contexte

1. Ajoutez votre contexte dans ce dossier.
2. Exportez-le dans le fichier `index.ts`.

Exemple :

```tsx
// Nouveau contexte
export const NouveauContext = createContext<NouveauContextType | undefined>(undefined);

export const NouveauProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ...
};

export const useNouveau = () => {
  const context = useContext(NouveauContext);
  if (context === undefined) {
    throw new Error("useNouveau must be used within a NouveauProvider");
  }
  return context;
};

// Export dans index.ts
export { NouveauProvider, useNouveau } from "./NouveauContext";
```

## Bonnes pratiques

- Utilisez des noms de contextes descriptifs et en PascalCase.
- Ajoutez des commentaires pour expliquer le fonctionnement des contextes.
- Utilisez TypeScript pour typer les contextes et leurs valeurs.