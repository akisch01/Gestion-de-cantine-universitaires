from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.db import OperationalError, ProgrammingError

def create_default_parameters(**kwargs):
    """
    Fonction appelée après les migrations pour créer les paramètres par défaut.
    """
    try:
        from .models import Parametre
        Parametre.objects.get_or_create(
            nom_parametre='duree_expiration_reservation',
            defaults={'valeur': '6', 'description': 'Durée en heures avant expiration des réservations'}
        )
    except (OperationalError, ProgrammingError):
        # La table n'existe pas encore ou autre erreur de base de données
        pass

class CantineConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cantine'  # Le chemin complet du module
    verbose_name = 'Gestion de Cantine'

    def ready(self):
        # Connecter la création des paramètres par défaut au signal post_migrate
        post_migrate.connect(create_default_parameters, sender=self)
