from rest_framework import serializers
from .models import Proveedor

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ["id", "nombre", "direccion", "contacto", "partnership_activa"]
        read_only_fields = ["id"]
        
# your_app/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Añadimos campos personalizados
        token["username"] = user.username
        token["is_superuser"] = user.is_superuser
        return token
