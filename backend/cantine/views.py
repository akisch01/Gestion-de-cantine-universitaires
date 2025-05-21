from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from datetime import timedelta
import logging
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from django.http import HttpResponse
from django.conf import settings
import io
from .models import Plat, Reservation, EmploiDuTemps, Avis, Notification, Parametre, User
from .serializers import (
    UserSerializer, PlatSerializer, ReservationSerializer,
    EmploiDuTempsSerializer, AvisSerializer, NotificationSerializer,
    ParametreSerializer, UserInfoSerializer
)
from cantine import serializers

logger = logging.getLogger(__name__)
User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        logger.info(f"Tentative de connexion avec les données: {request.data}")
        
        # Vérifier si les champs requis sont présents
        if 'username' not in request.data or 'password' not in request.data:
            return Response(
                {"detail": "Les champs username et password sont requis."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Authentifier directement avec l'email
            user = authenticate(email=request.data['username'], password=request.data['password'])
            if not user:
                return Response(
                    {"detail": "Email ou mot de passe incorrect."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Générer les tokens
            refresh = RefreshToken.for_user(user)
            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'institut': user.institut,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            }
            
            logger.info(f"Connexion réussie pour l'utilisateur: {user.email}")
            return Response(response_data)
            
        except Exception as e:
            logger.error(f"Erreur lors de la connexion: {str(e)}")
            return Response(
                {"detail": "Erreur lors de la connexion. Vérifiez vos identifiants."},
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_info(request):
    try:
        # La décoration @permission_classes([permissions.IsAuthenticated])
        # s'occupe déjà de vérifier l'authentification
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des données utilisateur: {str(e)}")
        raise

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        data = {
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        headers = self.get_success_headers(serializer.data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get', 'put'])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PlatViewSet(viewsets.ModelViewSet):
    queryset = Plat.objects.all()
    serializer_class = PlatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

class EmploiDuTempsViewSet(viewsets.ModelViewSet):
    queryset = EmploiDuTemps.objects.all()
    serializer_class = EmploiDuTempsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    @action(detail=False, methods=['post'])
    def programmer_semaine(self, request):
        # Logique pour programmer toute la semaine
        # (à implémenter selon vos besoins)
        return Response({"status": "Semaine programmée"}, status=status.HTTP_200_OK)

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(etudiant=self.request.user)
        return queryset

    @action(detail=False, methods=['get'])
    def export(self, request):
        try:
            # Récupérer les réservations de l'utilisateur
            reservations = self.get_queryset().filter(etudiant=request.user).select_related('plat', 'emploi_du_temps')
            
            # Préparer les données pour le template
            total_general = 0
            reservations_data = []
            
            for r in reservations:
                # Calculer le total pour cette réservation
                total_plat = r.plat.prix * r.quantite
                supplements_total = sum(sup.get('prix', 0) * r.quantite for sup in (r.supplements or []))
                total_reservation = total_plat + supplements_total
                total_general += total_reservation
                
                # Préparer les données du plat
                plat_data = {
                    'id': r.plat.id,
                    'nom_plat': r.plat.nom_plat,
                    'description': r.plat.description,
                    'prix': float(r.plat.prix)
                }
                
                # Préparer les données de la réservation
                reservation_data = {
                    'id': r.id,
                    'date_reservation': r.date_reservation,
                    'emploi_du_temps': {
                        'id': r.emploi_du_temps.id,
                        'date': r.emploi_du_temps.date,
                        'creneau': r.emploi_du_temps.creneau
                    },
                    'plat': plat_data,
                    'quantite': r.quantite,
                    'statut': r.statut,
                    'supplements': r.supplements or [],
                    'get_supplements_total': supplements_total,
                    'get_total_prix': total_reservation,
                    'get_statut_display': r.get_statut_display()
                }
                reservations_data.append(reservation_data)
            
            # Préparer le contexte pour le template
            context = {
                'reservations': reservations_data,
                'date_export': timezone.now().strftime("%d/%m/%Y %H:%M"),
                'user': request.user,
                'total_general': total_general
            }
            
            # Rendre le template HTML
            html_string = render_to_string('reservations_export.html', context)
            
            # Générer le PDF
            pdf_file = io.BytesIO()
            pisa.CreatePDF(html_string, dest=pdf_file)
            
            # Créer la réponse HTTP avec le PDF
            response = HttpResponse(pdf_file.getvalue(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename=historique-reservations_{request.user.username}_{timezone.now().strftime("%Y%m%d")}.pdf'
            
            return response
            
        except Exception as e:
            logger.error(f"Erreur lors de l'export des réservations: {str(e)}")
            return Response({'error': f'Erreur serveur: {str(e)}'}, status=500)

    def create(self, request, *args, **kwargs):
        print("=== Données reçues pour la création de réservation ===")
        print(f"Données brutes: {request.data}")
        print(f"Utilisateur: {request.user}")
        
        try:
            # Vérifier d'abord si l'utilisateur a déjà une réservation pour ce créneau
            emploi_id = request.data.get('emploi_du_temps')
            if emploi_id and Reservation.objects.filter(
                etudiant=request.user,
                emploi_du_temps_id=emploi_id,
                statut__in=['en_attente', 'accepte']
            ).exists():
                return Response(
                    {'non_field_errors': ['Vous avez déjà une réservation pour ce créneau.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            return super().create(request, *args, **kwargs)
            
        except ValidationError as e:
            print(f"Erreur de validation: {e}")
            error_data = e.detail if hasattr(e, 'detail') else {'detail': str(e)}
            return Response(
                error_data,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Erreur inattendue lors de la création de la réservation: {str(e)}")
            print(f"Type d'erreur: {type(e).__name__}")
            import traceback
            traceback.print_exc()
            return Response(
                {'detail': 'Une erreur est survenue lors de la création de la réservation.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def perform_create(self, serializer):
        print("=== Validation des données de la réservation ===")
        print(f"Données validées: {serializer.validated_data}")
        
        emploi = serializer.validated_data['emploi_du_temps']
        print(f"Emploi du temps: {emploi.id}, Quantité disponible: {emploi.quantite_disponible}")
        
        # Vérifier la quantité disponible
        quantite_demandee = serializer.validated_data.get('quantite', 1)
        print(f"Quantité demandée: {quantite_demandee}, Quantité disponible: {emploi.quantite_disponible}")
        
        if emploi.quantite_disponible < quantite_demandee:
            raise ValidationError({
                'quantite': [f'Quantité non disponible. Il ne reste que {emploi.quantite_disponible} place(s).']
            }, code='quantity_unavailable')
        
        # Sauvegarder la réservation
        print("Sauvegarde de la réservation...")
        reservation = serializer.save(etudiant=self.request.user)
        print(f"Réservation créée avec succès: {reservation.id}")
        
        # Mettre à jour la quantité disponible
        emploi.quantite_disponible -= quantite_demandee
        emploi.save()
        print(f"Quantité mise à jour: {emploi.quantite_disponible} places restantes")

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(destinataire=self.request.user)

    @action(detail=True, methods=['post'])
    def marquer_comme_lue(self, request, pk=None):
        notification = self.get_object()
        notification.est_lue = True
        notification.save()
        return Response({'status': 'Notification marquée comme lue'})
        
    @action(detail=True, methods=['delete'])
    def supprimer(self, request, pk=None):
        notification = self.get_object()
        notification_id = notification.id
        notification.delete()
        return Response(
            {'status': 'Notification supprimée avec succès', 'id': notification_id},
            status=status.HTTP_200_OK
        )

class ParametreViewSet(viewsets.ModelViewSet):
    queryset = Parametre.objects.all()
    serializer_class = ParametreSerializer
    permission_classes = [permissions.IsAdminUser]

class AvisViewSet(viewsets.ModelViewSet):
    queryset = Avis.objects.all()
    serializer_class = AvisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Avis.objects.all()
        
        # Pour les étudiants: seulement leurs avis
        if not self.request.user.is_staff:
            queryset = queryset.filter(etudiant=self.request.user)
        
        # Filtres supplémentaires
        plat_id = self.request.query_params.get('plat')
        if plat_id:
            queryset = queryset.filter(plat_id=plat_id)
        
        approuve_only = self.request.query_params.get('approuve')
        if approuve_only and self.request.user.is_staff:
            queryset = queryset.filter(est_approuve=True)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(etudiant=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approuver(self, request, pk=None):
        avis = self.get_object()
        avis.est_approuve = True
        avis.save()
        
        # Notifier l'étudiant
        Notification.objects.create(
            destinataire=avis.etudiant,
            titre="Votre avis a été approuvé",
            contenu=f"Votre avis sur le plat {avis.plat.nom_plat} a été publié.",
            lien=f"/plats/{avis.plat.id}"
        )
        
        return Response({'status': 'Avis approuvé'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def desapprouver(self, request, pk=None):
        avis = self.get_object()
        avis.est_approuve = False
        avis.save()
        return Response({'status': 'Avis désapprouvé'})
