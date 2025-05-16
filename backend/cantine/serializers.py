from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import Plat, Reservation, EmploiDuTemps, Avis, Notification, Parametre
from rest_framework.fields import IntegerField

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    institut = serializers.CharField(required=True)
    is_staff = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'institut', 'is_staff')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'username': {'required': False},  # Le username sera généré à partir de l'email
        }

    def create(self, validated_data):
        # Utiliser l'email comme username
        validated_data['username'] = validated_data['email']
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            institut=validated_data.get('institut', '')
        )
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)

class UserInfoSerializer(serializers.ModelSerializer):
    is_staff = serializers.BooleanField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    institut = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'first_name', 'last_name', 'institut']
        read_only_fields = ['id', 'username', 'email', 'is_staff', 'first_name', 'last_name', 'institut']

class PlatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plat
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class EmploiDuTempsSerializer(serializers.ModelSerializer):
    plat = PlatSerializer(read_only=True)
    plat_id = serializers.PrimaryKeyRelatedField(
        queryset=Plat.objects.all(),
        source='plat',
        write_only=True
    )

    class Meta:
        model = EmploiDuTemps
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class ReservationSerializer(serializers.ModelSerializer):
    plat = PlatSerializer(read_only=True)
    plat_id = serializers.PrimaryKeyRelatedField(
        queryset=Plat.objects.all(),
        source='plat',
        write_only=True
    )
    emploi_du_temps = EmploiDuTempsSerializer(read_only=True)
    emploi_du_temps_id = serializers.PrimaryKeyRelatedField(
        queryset=EmploiDuTemps.objects.all(),
        source='emploi_du_temps',
        write_only=True
    )
    etudiant = UserSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ('total_prix', 'date_reservation', 'statut', 'created_at', 'updated_at')

class AvisSerializer(serializers.ModelSerializer):
    etudiant = serializers.StringRelatedField(read_only=True)
    plat = serializers.StringRelatedField(read_only=True)
    plat_id = serializers.PrimaryKeyRelatedField(
        queryset=Plat.objects.all(),
        source='plat',
        write_only=True
    )
    note = IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Avis
        fields = [
            'id', 'etudiant', 'plat', 'plat_id', 
            'note', 'commentaire', 'date_publication', 
            'est_approuve'
        ]
        read_only_fields = ['etudiant', 'date_publication']
        extra_kwargs = {
            'commentaire': {'required': False}
        }

    def validate(self, data):
        # Vérifier que l'utilisateur a bien consommé le plat
        user = self.context['request'].user
        plat = data.get('plat')
        
        if not Reservation.objects.filter(
            etudiant=user,
            plat=plat,
            statut='accepte'
        ).exists():
            raise serializers.ValidationError(
                "Vous ne pouvez noter que les plats que vous avez consommés."
            )
        
        return data

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('date_envoi',)

class ParametreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parametre
        fields = '__all__'
        read_only_fields = ('date_modification',)

class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(required=True)