from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SolicitudCompra
from .serializers import SolicitudCompraSerializer
from core.permissions import IsColocador, IsAprobador
from rest_framework import permissions

class SolicitudCompraViewSet(viewsets.ModelViewSet):
    queryset = SolicitudCompra.objects.all()
    serializer_class = SolicitudCompraSerializer

    def get_permissions(self):
        # Crear o editar solicitudes: sólo colocador
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsColocador()]
        # Aprobar o desaprobar: sólo aprobador (ver action approve/rechazar)
        if self.action in ["approve", "reject", "pendientes"]:
            return [permissions.IsAuthenticated(), IsAprobador()]
        # Listar: sólo autenticados
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        # Si el usuario es colocador, mostrar sólo sus propias solicitudes
        if hasattr(user, "profile") and user.profile.role == "colocador":
            return SolicitudCompra.objects.filter(colocador=user)
        # Si es aprobador, mostrar TODAS (o sólo las pendientes si se llama a action aparte)
        return SolicitudCompra.objects.all()

    @action(detail=False, methods=["get"], url_path="pendientes")
    def pendientes(self, request):
        """
        Endpoint: GET /api/solicitudes/pendientes/
        Retorna solicitudes con estado="pendiente" para aprobación.
        """
        pendientes = SolicitudCompra.objects.filter(estado="pendiente").order_by("-fecha_creacion")
        page = self.paginate_queryset(pendientes)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(pendientes, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="aprobar")
    def approve(self, request, pk=None):
        """
        POST /api/solicitudes/{pk}/aprobar/  → cambia estado a "aprobada"
        """
        solicitud = self.get_object()
        if solicitud.estado != "pendiente":
            return Response(
                {"detail": "Sólo se pueden aprobar solicitudes en estado pendiente."},
                status=status.HTTP_400_BAD_REQUEST
            )
        solicitud.estado = "aprobada"
        solicitud.save()
        return Response({"status": "aprobada"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="rechazar")
    def reject(self, request, pk=None):
        """
        POST /api/solicitudes/{pk}/rechazar/  → cambia estado a "rechazada"
        """
        solicitud = self.get_object()
        if solicitud.estado != "pendiente":
            return Response(
                {"detail": "Sólo se pueden rechazar solicitudes en estado pendiente."},
                status=status.HTTP_400_BAD_REQUEST
            )
        solicitud.estado = "rechazada"
        solicitud.save()
        return Response({"status": "rechazada"}, status=status.HTTP_200_OK)
