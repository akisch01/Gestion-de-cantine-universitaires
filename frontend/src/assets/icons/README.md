# Dossier `assets/icons/`

Ce dossier contient des icônes SVG supplémentaires utilisées dans l’application.

## Structure

- `home.svg` : Icône d’accueil
- `menu.svg` : Icône de menu
- `reservation.svg` : Icône de réservation
- `history.svg` : Icône d’historique
- `settings.svg` : Icône de paramètres
- `logout.svg` : Icône de déconnexion

## Comment ajouter une nouvelle icône

1. Ajoutez votre fichier SVG dans ce dossier.
2. Mettez à jour le fichier `index.ts` pour exporter la nouvelle icône.

Exemple :

```tsx
export const icons = {
  home: "/icons/home.svg",
  menu: "/icons/menu.svg",
  reservation: "/icons/reservation.svg",
  history: "/icons/history.svg",
  settings: "/icons/settings.svg",
  logout: "/icons/logout.svg",
  nouvelleIcone: "/icons/nouvelle-icone.svg", // Nouvelle icône
};
```

## Bonnes pratiques

- Utilisez des noms de fichiers descriptifs et en minuscules.
- Optimisez les fichiers SVG pour le web (suppression des métadonnées inutiles).
- Préférez les icônes monochromes pour une meilleure cohérence visuelle.