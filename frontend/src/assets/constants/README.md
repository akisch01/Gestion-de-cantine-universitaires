# Dossier `assets/constants/`

Ce dossier contient les constantes globales utilisées dans l’application.

## Structure

- `index.ts` : Export des constantes globales

## Constantes disponibles

- `API_BASE_URL` : URL de base de l’API
- `WEBSOCKET_URL` : URL du WebSocket pour les notifications
- `JWT_STORAGE_KEY` : Clé de stockage du token JWT
- `USER_ROLE_KEY` : Clé de stockage du rôle de l’utilisateur
- `NOTIF_STORAGE_KEY` : Clé de stockage des notifications
- `ROLES` : Rôles disponibles (étudiant, admin)
- `RESERVATION_STATUS` : Statuts de réservation (en attente, confirmé, annulé)
- `PLAT_CATEGORIES` : Catégories de plats (entrée, plat, dessert, boisson)
- `NOTIFICATION_TYPES` : Types de notifications (info, succès, avertissement, erreur)
- `ERROR_MESSAGES` : Messages d’erreur
- `SUCCESS_MESSAGES` : Messages de succès

## Comment ajouter une nouvelle constante

1. Ajoutez votre constante dans le fichier `index.ts`.
2. Exportez-la pour l’utiliser dans l’application.

Exemple :

```tsx
export const NOUVELLE_CONSTANTE = "valeur";
```

## Bonnes pratiques

- Utilisez des noms de constantes descriptifs et en majuscules.
- Regroupez les constantes par catégorie (ex: messages, statuts, etc.).
- Utilisez `as const` pour les objets de constantes afin de bénéficier de l’inférence de type TypeScript.