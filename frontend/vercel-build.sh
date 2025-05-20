#!/bin/bash

# Installer les dépendances
echo "Installation des dépendances..."
npm install --legacy-peer-deps

# Installer Vite globalement
echo "Installation de Vite..."
npm install -g vite

# Builder l'application
echo "Build de l'application..."
npx vite build

# Créer le dossier de sortie
echo "Création du dossier de sortie..."
mkdir -p .vercel/output/static

# Copier les fichiers construits
echo "Copie des fichiers..."
cp -r dist/* .vercel/output/static/ 2>/dev/null || true
cp -r public/* .vercel/output/static/ 2>/dev/null || true

# Créer la configuration de déploiement
echo "Création de la configuration..."
mkdir -p .vercel/output
cat > .vercel/output/config.json <<EOF
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
EOF

echo "Build terminé avec succès !"
