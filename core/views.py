from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Proveedor
from .serializers import ProveedorSerializer
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
