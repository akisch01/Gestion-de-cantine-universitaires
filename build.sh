#!/usr/bin/env bash
# build.sh

echo "-> Installation des dépendances Python..."
cd backend
pip install -r requirements.txt

echo "-> Création des dossiers nécessaires..."
mkdir -p static
mkdir -p staticfiles

echo "-> Application des migrations..."
python manage.py migrate

echo "-> Collecte des fichiers statiques..."
python manage.py collectstatic --noinput --clear

echo "-> Vérification des fichiers statiques..."
ls -la staticfiles/

echo "-> Démarrage du serveur..."
gunicorn backend.wsgi:application
