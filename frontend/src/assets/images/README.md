# Dossier `assets/images/`

Ce dossier contient toutes les images utilisées dans l’application.

## Structure

- `logo.png` : Logo de l’application
- `default-avatar.png` : Avatar par défaut pour les utilisateurs
- `placeholder.png` : Image de remplacement pour les plats sans image

## Comment ajouter une nouvelle image

1. Ajoutez votre image dans ce dossier (formats recommandés : PNG, JPG, SVG).
2. Mettez à jour le fichier `index.ts` pour exporter la nouvelle image.

Exemple :

```tsx
export const images = {
  logo: "/images/logo.png",
  defaultAvatar: "/images/default-avatar.png",
  placeholder: "/images/placeholder.png",
  nouvelleImage: "/images/nouvelle-image.png", // Nouvelle image
};
```

## Bonnes pratiques

- Utilisez des noms de fichiers descriptifs et en minuscules.
- Optimisez les images pour le web (compression, redimensionnement).
- Préférez les formats SVG pour les icônes et les logos.