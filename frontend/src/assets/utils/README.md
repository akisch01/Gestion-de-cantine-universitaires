# Dossier `assets/utils/`

Ce dossier contient des fonctions utilitaires utilisées dans l’application.

## Structure

- `index.ts` : Export des fonctions utilitaires

## Fonctions disponibles

- `saveToStorage` : Sauvegarde une valeur dans le stockage local
- `getFromStorage` : Récupère une valeur du stockage local
- `removeFromStorage` : Supprime une valeur du stockage local
- `formatDate` : Formate une date en français
- `downloadBlob` : Télécharge un fichier Blob
- `validateEmail` : Valide une adresse email
- `validatePassword` : Valide un mot de passe
- `handleError` : Gère les erreurs d’API
- `showNotification` : Affiche une notification
- `hasPermission` : Vérifie les permissions d’un utilisateur
- `buildApiUrl` : Construit une URL d’API
- `truncateString` : Tronque une chaîne de caractères
- `formatPrice` : Formate un prix
- `chunkArray` : Découpe un tableau en morceaux
- `deepClone` : Clone profond d’un objet
- `sleep` : Pause asynchrone
- `debounce` : Debounce une fonction
- `cn` : Combine des classes CSS

## Comment ajouter une nouvelle fonction utilitaire

1. Ajoutez votre fonction dans le fichier `index.ts`.
2. Exportez-la pour l’utiliser dans l’application.

Exemple :

```tsx
export function nouvelleFonction() {
  // ...
}
```

## Bonnes pratiques

- Utilisez des noms de fonctions descriptifs et en camelCase.
- Ajoutez des commentaires pour expliquer le fonctionnement des fonctions.
- Utilisez TypeScript pour typer les paramètres et les retours des fonctions.