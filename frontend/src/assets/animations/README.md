# Dossier `assets/animations/`

Ce dossier contient des animations personnalisées utilisées dans l’application.

## Structure

- `index.css` : Définition des animations et classes utilitaires

## Animations disponibles

- `fadeIn` : Fade in
- `fadeOut` : Fade out
- `slideInRight` : Slide in depuis la droite
- `slideOutRight` : Slide out vers la droite
- `slideInLeft` : Slide in depuis la gauche
- `slideOutLeft` : Slide out vers la gauche
- `scaleIn` : Scale in
- `scaleOut` : Scale out
- `bounce` : Bounce
- `pulse` : Pulse

## Comment ajouter une nouvelle animation

1. Ajoutez votre animation dans le fichier `index.css`.
2. Créez une classe utilitaire pour l’animation.

Exemple :

```css
@keyframes nouvelleAnimation {
  from {
    /* ... */
  }
  to {
    /* ... */
  }
}

.animate-nouvelle-animation {
  animation: nouvelleAnimation 0.3s ease-in-out;
}
```

## Bonnes pratiques

- Utilisez des noms d’animations descriptifs et en minuscules.
- Ajoutez des classes utilitaires pour faciliter l’utilisation des animations.