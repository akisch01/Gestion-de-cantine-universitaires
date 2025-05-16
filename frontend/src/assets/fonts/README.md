# Dossier `assets/fonts/`

Ce dossier contient les polices personnalisées utilisées dans l’application.

## Structure

- `Inter-Regular.woff2` : Police Inter en poids normal (400)
- `Inter-Medium.woff2` : Police Inter en poids moyen (500)
- `Inter-SemiBold.woff2` : Police Inter en poids semi-gras (600)
- `Inter-Bold.woff2` : Police Inter en poids gras (700)

## Comment ajouter une nouvelle police

1. Ajoutez votre fichier de police dans ce dossier (format recommandé : WOFF2).
2. Mettez à jour le fichier `index.css` pour importer la nouvelle police.

Exemple :

```css
@font-face {
  font-family: "NouvellePolice";
  src: url("./NouvellePolice.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

## Bonnes pratiques

- Utilisez des noms de fichiers descriptifs et en minuscules.
- Préférez le format WOFF2 pour une meilleure performance.
- Ajoutez `font-display: swap;` pour améliorer le chargement des polices.