# Architecture générale

L’application est découpée en deux parties principales :  
- **Backend** (API REST, WebSocket, base de données)
- **Frontend** (React, Vite, TypeScript, Tailwind)

## Schéma global
[ Utilisateur ]
|
[ Frontend ]
|
[ Backend ]
|
[ Base de données ]


## Principes

- Séparation claire des responsabilités
- Authentification JWT
- Gestion des rôles (étudiant, admin)
- WebSocket pour les notifications en temps réel
- API RESTful pour toutes les opérations