from django.shortcuts import render
from .serializers import ProveedorSerializer
from rest_framework import viewsets, permissions
from .models import Proveedor
from core.permissions import IsColocador

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

    # Sólo colocadores autenticados pueden crear, editar o eliminar.
    # Cualquiera autenticado puede listar y ver detalles.
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsColocador()]
# your_app/views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
