#!/usr/bin/env bash
echo "Installation des dépendances..."
npm install --omit=dev

echo "Patch des packages..."
npx patch-package || true

echo "Build du projet..."
npm run build

echo "Vérification des fichiers générés..."
ls -la dist/