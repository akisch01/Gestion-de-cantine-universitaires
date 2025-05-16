from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Avis, User, Plat, EmploiDuTemps, Reservation, Notification, Parametre

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'institut', 'is_staff', 'date_inscription')
    list_filter = ('is_staff', 'is_superuser', 'institut')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_inscription',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informations personnelles', {'fields': ('first_name', 'last_name', 'email', 'institut')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'institut'),
        }),
    )

@admin.register(Plat)
class PlatAdmin(admin.ModelAdmin):
    list_display = ('nom_plat', 'prix', 'type_plat')
    list_filter = ('type_plat',)
    search_fields = ('nom_plat', 'description')

@admin.register(EmploiDuTemps)
class EmploiDuTempsAdmin(admin.ModelAdmin):
    list_display = ('plat', 'jour', 'creneau', 'date', 'quantite_disponible')
    list_filter = ('jour', 'creneau', 'date')
    search_fields = ('plat__nom_plat',)

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('etudiant', 'plat', 'statut', 'date_reservation')
    list_filter = ('statut', 'date_reservation')
    search_fields = ('etudiant__email', 'plat__nom_plat')
    actions = ['accepter_reservations', 'refuser_reservations']

    def accepter_reservations(self, request, queryset):
        for reservation in queryset:
            reservation.statut = 'accepte'
            reservation.save()
            reservation.emploi_du_temps.quantite_disponible -= reservation.quantite
            reservation.emploi_du_temps.save()
        self.message_user(request, f"{queryset.count()} réservations acceptées")
    accepter_reservations.short_description = "Accepter les réservations sélectionnées"

    def refuser_reservations(self, request, queryset):
        queryset.update(statut='refuse')
        self.message_user(request, f"{queryset.count()} réservations refusées")
    refuser_reservations.short_description = "Refuser les réservations sélectionnées"

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('destinataire', 'titre', 'est_lue', 'date_envoi')
    list_filter = ('est_lue', 'date_envoi')
    search_fields = ('destinataire__email', 'titre', 'contenu')

@admin.register(Parametre)
class ParametreAdmin(admin.ModelAdmin):
    list_display = ('nom_parametre', 'valeur', 'date_modification')
    search_fields = ('nom_parametre', 'description')

@admin.register(Avis)
class AvisAdmin(admin.ModelAdmin):
    list_display = ('etudiant', 'plat', 'note', 'date_publication', 'est_approuve')
    list_filter = ('est_approuve', 'note', 'date_publication')
    search_fields = ('etudiant__email', 'plat__nom_plat', 'commentaire')
    list_editable = ('est_approuve',)
    actions = ['approuver_avis', 'desapprouver_avis']

    def approuver_avis(self, request, queryset):
        updated = queryset.update(est_approuve=True)
        for avis in queryset:
            Notification.objects.create(
                destinataire=avis.etudiant,
                titre="Votre avis a été approuvé",
                contenu=f"Votre avis sur le plat {avis.plat.nom_plat} a été publié.",
                lien=f"/admin/cantine/avis/{avis.id}/change/"
            )
        self.message_user(request, f"{updated} avis approuvés.")
    approuver_avis.short_description = "Approuver les avis sélectionnés"

    def desapprouver_avis(self, request, queryset):
        updated = queryset.update(est_approuve=False)
        self.message_user(request, f"{updated} avis désapprouvés.")
    desapprouver_avis.short_description = "Désapprouver les avis sélectionnés"

admin.site.register(User, CustomUserAdmin)