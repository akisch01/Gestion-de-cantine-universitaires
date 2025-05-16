# Référence de l’API

## Authentification

- `POST /api/auth/login` : Connexion
- `POST /api/auth/register` : Inscription
- `GET /api/auth/me` : Infos utilisateur connecté

## Plats

- `GET /api/plats` : Liste des plats
- `GET /api/plats/:id` : Détail d’un plat
- `POST /api/plats` : Création d’un plat (admin)
- `PUT /api/plats/:id` : Modification d’un plat (admin)
- `DELETE /api/plats/:id` : Suppression d’un plat (admin)

## Réservations

- `GET /api/reservations` : Liste des réservations de l’utilisateur
- `POST /api/reservations` : Créer une réservation
- `DELETE /api/reservations/:id` : Annuler une réservation

## Notifications

- `GET /api/notifications` : Liste des notifications
- `POST /api/notifications/:id/read` : Marquer comme lue

## Admin

- `GET /api/admin/users` : Liste des utilisateurs
- `PUT /api/admin/users/:id` : Modifier un utilisateur
- `DELETE /api/admin/users/:id` : Supprimer un utilisateur
- `GET /api/admin/stats` : Statistiques globales
- `GET /api/admin/export` : Export PDF des réservations