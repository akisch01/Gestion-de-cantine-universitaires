# Application de Gestion de Cantine Universitaire

## Description
Application web permettant la gestion d'une cantine universitaire, développée avec Django (backend) et React (frontend).

## Installation

### Prérequis
- Python 3.8 ou supérieur
- Node.js et npm
- Git

### Backend (Django)
1. Créer un environnement virtuel :
```bash
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate
```

2. Installer les dépendances :
```bash
pip install -r requirements.txt
pip install celery redis django-celery-beat
```

3. Appliquer les migrations :
```bash
python manage.py migrate --fake-initial
python manage.py makemigrations
python manage.py migrate
```

4. Créer un superutilisateur :
```bash
python manage.py createsuperuser
```
# Démarrer Celery worker (dans un terminal séparé)
celery -A backend worker -l info

# Démarrer Celery beat pour les tâches périodiques (dans un autre terminal)
celery -A backend beat -l info

pip install djangorestframework-simplejwt
python manage.py drf_create_token votre_superuser

5. Lancer le serveur :
```bash
python manage.py runserver
```

### Frontend (React)
1. Installer les dépendances :
```bash
npm create vite@latest frontend --template react-ts
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p --full
npm install @tanstack/react-query zustand react-hook-form zod @hookform/resolvers axios react-router-dom date-fns
npm install -D @types/node @types/react @types/react-dom
npm install pdf-lib jspdf react-icons
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu # Composants accessibles
```

2. Lancer le serveur de développement :
```bash
npm run dev
```

## Structure du projet
- `backend/` : Application Django
- `frontend/` : Application React vite
- `requirements.txt` : Dépendances Python
- `package.json` : Dépendances Node.js

## Fonctionnalités principales
- Gestion des utilisateurs (étudiants et administrateurs)
- Gestion des plats et des menus
- Système de réservation
- Notation des plats
- Notifications
- Tableau de bord administrateur 