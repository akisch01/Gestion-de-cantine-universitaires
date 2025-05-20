#!/bin/bash

# Installation des dépendances
echo "-> Installation des dépendances..."
cd frontend
npm install --legacy-peer-deps

# Build de l'application
echo "-> Build de l'application..."
npm run build

# Création du dossier de sortie
echo "-> Préparation des fichiers..."
mkdir -p dist

# Copie des fichiers nécessaires
cp -r dist/* dist/ 2>/dev/null || :
cp -r public dist/ 2>/dev/null || :

echo "-> Build terminé avec succès !"
