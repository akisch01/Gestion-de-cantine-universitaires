#!/usr/bin/env bash
# build.sh

echo "-> Installation des dépendances Python..."
cd backend
pip install -r requirements.txt

echo "-> Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

echo "-> Application des migrations..."
python manage.py migrate

echo "-> Démarrage du serveur..."
gunicorn backend.wsgi:application