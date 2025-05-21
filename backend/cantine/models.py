from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save, post_delete, pre_save, m2m_changed
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
import json

class User(AbstractUser):
    email = models.EmailField(unique=True)
    institut = models.CharField(max_length=100)
    date_inscription = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"

class Plat(models.Model):
    TYPE_CHOICES = [
        ('standard', 'Standard'),
        ('vip', 'VIP'),
        ('vegetarien', 'Végétarien'),
        ('sans_gluten', 'Sans Gluten'),
    ]
    
    nom_plat = models.CharField(max_length=100)
    prix = models.DecimalField(max_digits=6, decimal_places=2)
    type_plat = models.CharField(max_length=20, choices=TYPE_CHOICES, default='standard')
    description = models.TextField()
    image = models.ImageField(upload_to='plats/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nom_plat

class EmploiDuTemps(models.Model):
    JOUR_CHOICES = [
        ('lundi', 'Lundi'),
        ('mardi', 'Mardi'),
        ('mercredi', 'Mercredi'),
        ('jeudi', 'Jeudi'),
        ('vendredi', 'Vendredi'),
    ]
    
    CRENEAU_CHOICES = [
        ('midi', 'Midi'),
        ('soir', 'Soir'),
    ]
    
    plat = models.ForeignKey(Plat, on_delete=models.CASCADE, related_name='emplois_du_temps')
    jour = models.CharField(max_length=10, choices=JOUR_CHOICES)
    creneau = models.CharField(max_length=10, choices=CRENEAU_CHOICES)
    date = models.DateField()
    quantite_disponible = models.PositiveIntegerField(default=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('jour', 'creneau', 'date')
        verbose_name = "Emploi du temps"
        verbose_name_plural = "Emplois du temps"

    def __str__(self):
        return f"{self.plat.nom_plat} - {self.get_jour_display()} {self.get_creneau_display()}"

class Reservation(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('accepte', 'Accepté'),
        ('refuse', 'Refusé'),
        ('expire', 'Expiré'),
    ]
    
    etudiant = models.ForeignKey(User, on_delete=models.CASCADE)
    plat = models.ForeignKey(Plat, on_delete=models.CASCADE)
    emploi_du_temps = models.ForeignKey(EmploiDuTemps, on_delete=models.CASCADE)
    quantite = models.PositiveIntegerField()
    supplements = models.JSONField(default=list, blank=True)
    total_prix = models.DecimalField(max_digits=8, decimal_places=2)
    date_reservation = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Réservation"
        verbose_name_plural = "Réservations"
        ordering = ['-date_reservation']
    
    def clean(self):
        super().clean()

    def save(self, *args, **kwargs):
        from decimal import Decimal
        
        # Initialiser le prix total avec le prix du plat multiplié par la quantité
        self.total_prix = Decimal(str(self.plat.prix)) * Decimal(str(self.quantite))
        
        # Ajouter le prix des suppléments si nécessaire
        if self.supplements and isinstance(self.supplements, list):
            # Si les suppléments sont une liste de dictionnaires
            supplements_price = sum(
                Decimal(str(sup.get('prix', 0))) 
                for sup in self.supplements 
                if isinstance(sup, dict) and 'prix' in sup
            )
            self.total_prix += supplements_price
        elif self.supplements and isinstance(self.supplements, dict):
            # Si les suppléments sont un dictionnaire (pour rétrocompatibilité)
            supplements_price = sum(
                Decimal(str(sup.get('prix', 0))) 
                for sup in self.supplements.values() 
                if isinstance(sup, dict) and 'prix' in sup
            )
            self.total_prix += supplements_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.etudiant.username} - {self.plat.nom_plat} ({self.get_statut_display()})"

class Notification(models.Model):
    destinataire = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    titre = models.CharField(max_length=100)
    contenu = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    est_lue = models.BooleanField(default=False)
    lien = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ['-date_envoi']

    def __str__(self):
        return f"{self.titre} - {self.destinataire.username}"

class Parametre(models.Model):
    nom_parametre = models.CharField(max_length=50, unique=True)
    valeur = models.TextField()
    description = models.TextField(blank=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Paramètre"
        verbose_name_plural = "Paramètres"

    def __str__(self):
        return self.nom_parametre

    @classmethod
    def get_duree_expiration(cls):
        try:
            return int(cls.objects.get(nom_parametre='duree_expiration_reservation').valeur)
        except (cls.DoesNotExist, ValueError):
            return 6  # Valeur par défaut de 6 heures

# Signaux pour les notifications automatiques
@receiver(post_save, sender=Reservation)
def gerer_notifications_reservation(sender, instance, created, **kwargs):
    if created:
        # Détails de la réservation
        details = (
            f"• Plat: {instance.plat.nom_plat}\n"
            f"• Date: {instance.emploi_du_temps.date} ({instance.emploi_du_temps.get_jour_display()})\n"
            f"• Créneau: {instance.emploi_du_temps.get_creneau_display()}\n"
            f"• Quantité: {instance.quantite}\n"
            f"• Statut: En attente de validation"
        )
        
        # Ajouter les suppléments s'il y en a
        if instance.supplements and len(instance.supplements) > 0:
            supplements = ", ".join([s.get('nom', '') for s in instance.supplements])
            details += f"\n• Suppléments: {supplements}"
        
        Notification.objects.create(
            destinataire=instance.etudiant,
            titre="✅ Réservation enregistrée",
            contenu=(
                f"Votre réservation a bien été enregistrée.\n\n"
                f"Détails de votre commande :\n{details}\n\n"
                f"Vous recevrez une notification dès qu'elle sera traitée."
            ),
            lien=f"/reservations/{instance.id}"
        )
    elif instance.statut != 'en_attente':
        # Notification de changement de statut
        statut_display = dict(Reservation.STATUT_CHOICES).get(instance.statut, instance.statut)
        
        if instance.statut == 'accepte':
            titre = "✅ Réservation acceptée"
            message = (
                f"Votre réservation pour {instance.plat.nom_plat} a été acceptée.\n\n"
                f"Récapitulatif :\n"
                f"• Date: {instance.emploi_du_temps.date}\n"
                f"• Créneau: {instance.emploi_du_temps.get_creneau_display()}\n"
                f"• Quantité: {instance.quantite}\n"
                f"• Total: {instance.total_prix} fcfa"
            )
            Notification.objects.create(
                destinataire=instance.etudiant,
                titre=titre,
                contenu=message,
                lien=f"/reservations/{instance.id}"
            )
        elif instance.statut in ['refuse', 'expire']:
            titre = f"❌ Réservation {statut_display.lower()}"
            message = (
                f"Votre réservation pour {instance.plat.nom_plat} a été {statut_display.lower()}.\n\n"
                f"Détails :\n"
                f"• Date: {instance.emploi_du_temps.date}\n"
                f"• Créneau: {instance.emploi_du_temps.get_creneau_display()}\n"
                f"• Quantité: {instance.quantite}"
            )
            Notification.objects.create(
                destinataire=instance.etudiant,
                titre=titre,
                contenu=message,
                lien=f"/reservations/{instance.id}"
            )
    else:
        pass

@receiver(post_save, sender=Plat)
def gerer_notifications_modification_plat(sender, instance, created, **kwargs):
    if not created:  # Notification uniquement lors de la modification
        for etudiant in User.objects.filter(is_staff=False):
            Notification.objects.create(
                destinataire=etudiant,
                titre="Plat modifié",
                contenu=f"Le plat '{instance.nom_plat}' a été mis à jour.",
                lien=f"/plats/{instance.id}"
            )

# @receiver(post_save, sender=EmploiDuTemps)
# def notifier_emploi_du_temps(sender, instance, created, **kwargs):
  #   if created:
    #     for etudiant in User.objects.filter(is_staff=False):
      #       Notification.objects.create(
        #         destinataire=etudiant,
          #       titre="Nouvel emploi du temps ajouté",
            #     contenu=f"Un emploi du temps a été ajouté pour le plat '{instance.plat.nom_plat}' le {instance.date} ({instance.get_jour_display()} - {instance.get_creneau_display()}).",
              #   lien="/emploi-du-temps/"
            # )

@receiver(post_save, sender=EmploiDuTemps)
def notifier_emploi_du_temps_complet(sender, instance, created, **kwargs):
    # Ne pas notifier si c'est une mise à jour de quantité disponible uniquement
    if not created:
        # Vérifier si c'est une réservation (mise à jour de la quantité disponible)
        from django.db.models import F
        reservations = Reservation.objects.filter(emploi_du_temps=instance, quantite__gt=0)
        if reservations.exists():
            return
        
    # Vérifier si l'emploi du temps est complet pour la semaine
    # Récupérer l'année et le numéro de semaine de la date de l'emploi du temps
    annee = instance.date.isocalendar()[0]
    semaine = instance.date.isocalendar()[1]
    
    # Vérifier si la semaine est complète (5 jours, 2 créneaux)
    emplois_du_temps = EmploiDuTemps.objects.filter(
        date__year=annee, date__week=semaine
    )

    jours_programmes = emplois_du_temps.values_list('jour', flat=True).distinct()
    creneaux_programmes = emplois_du_temps.values_list('creneau', flat=True).distinct()

    if set(jours_programmes) == {'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'} and set(creneaux_programmes) == {'midi', 'soir'}:
        # Vérifier si la notification n'existe pas déjà pour cette semaine
        date_debut = instance.date - timedelta(days=instance.date.weekday())
        date_fin = date_debut + timedelta(days=6)
        
        for etudiant in User.objects.filter(is_staff=False):
            # Vérifier si une notification existe déjà pour cette semaine
            notification_existante = Notification.objects.filter(
                destinataire=etudiant,
                titre="Emploi du temps disponible",
                date_envoi__date__range=(date_debut, date_fin)
            ).exists()
            
            if not notification_existante:
                Notification.objects.create(
                    destinataire=etudiant,
                    titre="Emploi du temps disponible",
                    contenu="L'emploi du temps des repas pour cette semaine est disponible.",
                    lien="/emploi-du-temps/"
                )

@receiver(post_save, sender=EmploiDuTemps)
def notifier_modification_emploi_du_temps(sender, instance, created, **kwargs):
    """
    Notifie les utilisateurs des modifications importantes apportées à un emploi du temps.
    Ne notifie pas pour les mises à jour de quantité disponible uniquement.
    """
    if created:
        # Ne pas notifier pour les créations
        return
        
    try:
        # Récupérer l'ancienne version de l'emploi du temps
        old_instance = EmploiDuTemps.objects.get(pk=instance.pk)
        
        # Vérifier si des champs importants ont changé (hors quantite_disponible)
        fields_to_check = ['jour', 'creneau', 'date', 'plat']
        has_important_changes = any(
            getattr(instance, field) != getattr(old_instance, field)
            for field in fields_to_check
        )
        
        # Si aucun champ important n'a changé, vérifier si c'est juste quantite_disponible
        if not has_important_changes:
            # Ne pas notifier si seul le champ quantite_disponible a changé
            return
            
        # Préparer le message de notification
        message = f"L'emploi du temps a été modifié pour le plat '{instance.plat.nom_plat}':\n"
        
        # Vérifier les champs qui ont changé
        if instance.jour != old_instance.jour:
            message += f"- Jour: {old_instance.get_jour_display()} → {instance.get_jour_display()}\n"
        if instance.creneau != old_instance.creneau:
            message += f"- Créneau: {old_instance.get_creneau_display()} → {instance.get_creneau_display()}\n"
        if instance.date != old_instance.date:
            message += f"- Date: {old_instance.date} → {instance.date}\n"
        if instance.plat != old_instance.plat:
            message += f"- Plat: {old_instance.plat.nom_plat} → {instance.plat.nom_plat}\n"
            
        # Ajouter la quantité disponible actuelle
        message += f"\nPlaces disponibles: {instance.quantite_disponible}"
        
        # Envoyer la notification à tous les utilisateurs
        for etudiant in User.objects.filter(is_staff=False):
            Notification.objects.create(
                destinataire=etudiant,
                titre="Modification de l'emploi du temps",
                contenu=message,
                lien="/reservation"
            )
            
    except EmploiDuTemps.DoesNotExist:
        # Cas où c'est une création (ne devrait pas arriver avec created=True)
        pass
@receiver(pre_save, sender=Reservation)
def verifier_expiration(sender, instance, **kwargs):
    if instance.pk and instance.statut == 'en_attente':
        duree_expiration = Parametre.get_duree_expiration()
        delai_expiration = timezone.now() - timedelta(hours=duree_expiration)
        
        if instance.date_reservation < delai_expiration:
            instance.statut = 'expire'
            Notification.objects.create(
                destinataire=instance.etudiant,
                titre="Réservation expirée",
                contenu=f"Votre réservation pour {instance.plat.nom_plat} a expiré.",
                lien=f"/reservations/{instance.id}"
            )

# Création des paramètres par défaut
@receiver(post_save, sender=Parametre)
def creer_parametres_par_defaut(sender, **kwargs):
    parametres_defaut = [
        ('duree_expiration_reservation', '6', 'Durée en heures avant expiration des réservations'),
        ('types_plats', 'standard,vip,vegetarien,sans_gluten', 'Types de plats autorisés'),
    ]
    
    for nom, valeur, description in parametres_defaut:
        Parametre.objects.get_or_create(
            nom_parametre=nom,
            defaults={'valeur': valeur, 'description': description}
        )
class Avis(models.Model):
    etudiant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='avis_donnes')
    plat = models.ForeignKey(Plat, on_delete=models.CASCADE, related_name='avis_recus')
    note = models.PositiveIntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    commentaire = models.TextField(blank=True)
    date_publication = models.DateTimeField(auto_now_add=True)
    est_approuve = models.BooleanField(default=False)  

    class Meta:
        verbose_name = "Avis"
        verbose_name_plural = "Avis"
        ordering = ['-date_publication']

    def __str__(self):
        return f"Avis de {self.etudiant} sur {self.plat} - {self.note}/5"

# Signal pour vérifier que l'étudiant a bien consommé le plat avant de noter
@receiver(pre_save, sender=Avis)
def verifier_avis(sender, instance, **kwargs):
    if not Reservation.objects.filter(
        etudiant=instance.etudiant,
        plat=instance.plat,
        statut='accepte'
    ).exists():
        raise ValueError("Vous ne pouvez noter que les plats que vous avez consommés.")

# Signal pour notifier l'utilisateur quand son avis est approuvé
@receiver(pre_save, sender=Avis)
def notifier_approbation_avis(sender, instance, **kwargs):
    try:
        # Récupérer l'ancien état de l'avis
        old_instance = Avis.objects.get(id=instance.id)
        if not old_instance.est_approuve and instance.est_approuve:
            # L'avis vient d'être approuvé
            Notification.objects.create(
                destinataire=instance.etudiant,
                titre="Avis approuvé",
                contenu=f"Votre avis sur le plat '{instance.plat.nom_plat}' a été approuvé.",
                lien=f"/mes-avis/{instance.id}"
            )
    except Avis.DoesNotExist:
        # C'est un nouvel avis, pas besoin de notification
        pass

@receiver(post_save, sender=Avis)
def notifier_nouvel_avis(sender, instance, created, **kwargs):
    if created:
        # Notification pour l'admin
        Notification.objects.create(
            destinataire=User.objects.filter(is_staff=True).first(),
            titre="Nouvel avis reçu",
            contenu=f"Un nouvel avis a été posté pour le plat '{instance.plat.nom_plat}'.",
            lien=f"/admin/cantine/avis/{instance.id}/"
        )
