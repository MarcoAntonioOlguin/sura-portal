from rest_framework import serializers
from .models import SolicitudCompra, ItemSolicitud
from proveedores.serializers import ProveedorSerializer

class ItemSolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemSolicitud
        fields = ["id", "nombre_producto", "enlace_producto", "cantidad", "precio_unitario"]
        read_only_fields = ["id"]

class SolicitudCompraSerializer(serializers.ModelSerializer):
    # Incluir lista de items al crear/editar
    items = ItemSolicitudSerializer(many=True)
    total = serializers.DecimalField(
        max_digits=14, decimal_places=2, read_only=True
    )
    proveedor = serializers.PrimaryKeyRelatedField(
        queryset=ProveedorSerializer.Meta.model.objects.all()
    )

    class Meta:
        model = SolicitudCompra
        fields = ["id", "colocador", "proveedor", "fecha_creacion", "estado", "items", "total"]
        read_only_fields = ["id", "fecha_creacion", "estado", "colocador", "total"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        # El “colocador” se obtiene del contexto de la request
        user = self.context["request"].user
        solicitud = SolicitudCompra.objects.create(colocador=user, **validated_data)

        # Validar que el proveedor tenga partnership activa
        if not solicitud.proveedor.partnership_activa:
            raise serializers.ValidationError(
                {"proveedor": "El proveedor no tiene partnership activa."}
            )

        for item in items_data:
            ItemSolicitud.objects.create(solicitud=solicitud, **item)
        return solicitud

    def update(self, instance, validated_data):
        # Sólo se permitirán cambios en items mientras esté en estado pendiente
        if instance.estado != "pendiente":
            raise serializers.ValidationError("No se puede editar una solicitud ya procesada.")

        items_data = validated_data.pop("items", None)
        if items_data is not None:
            # Eliminar items antiguos y crear los nuevos
            instance.items.all().delete()
            for item in items_data:
                ItemSolicitud.objects.create(solicitud=instance, **item)

        # No permitimos cambiar proveedor ni colocador ni estado en update normal
        instance.save()
        return instance
