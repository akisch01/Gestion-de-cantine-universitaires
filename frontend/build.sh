#!/bin/bash

echo "-> Installation des dépendances..."
npm install

echo "-> Compilation TypeScript..."
npx tsc

echo "-> Build avec Vite..."
npx vite build

echo "-> Démarrage du serveur..."
npx vite preview --port 4173