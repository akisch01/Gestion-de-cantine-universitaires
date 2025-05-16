from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Reservation, Parametre, Notification

@shared_task
def expirer_reservations():
    duree_expiration = Parametre.get_duree_expiration()
    delai_expiration = timezone.now() - timedelta(hours=duree_expiration)
    
    reservations = Reservation.objects.filter(
        statut='en_attente',
        date_reservation__lt=delai_expiration
    )
    
    for reservation in reservations:
        reservation.statut = 'expire'
        reservation.save()
        Notification.objects.create(
            destinataire=reservation.etudiant,
            titre="Réservation expirée",
            contenu=f"Votre réservation pour {reservation.plat.nom_plat} a expiré automatiquement après {duree_expiration} heures.",
            lien=f"/reservations/{reservation.id}"
        )
    
    return f"{reservations.count()} réservations expirées"