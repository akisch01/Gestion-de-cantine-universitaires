from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .views import (
    CustomTokenObtainPairView,
    UserViewSet,
    PlatViewSet,
    ReservationViewSet,
    EmploiDuTempsViewSet,
    NotificationViewSet,
    ParametreViewSet,
    AvisViewSet,
    register,
    get_user_info
)
from .serializers import LogoutSerializer

# Vue de déconnexion personnalisée
class LogoutView(APIView):
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        if serializer.is_valid():
            try:
                refresh_token = serializer.validated_data.get("refresh_token")
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({"detail": "Déconnexion réussie."}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"detail": "Erreur lors de la déconnexion."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'plats', PlatViewSet)
router.register(r'reservations', ReservationViewSet)
router.register(r'emploi-du-temps', EmploiDuTempsViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'parametres', ParametreViewSet)
router.register(r'avis', AvisViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/obtain/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', register, name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', get_user_info, name='user_info'),
]
