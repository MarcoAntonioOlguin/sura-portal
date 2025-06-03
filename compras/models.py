from django.db import models
from django.conf import settings
from proveedores.models import Proveedor

class SolicitudCompra(models.Model):
    ESTADO_CHOICES = (
        ("pendiente", "Pendiente"),
        ("aprobada", "Aprobada"),
        ("rechazada", "Rechazada"),
    )

    colocador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="solicitudes_creadas"
    )
    proveedor = models.ForeignKey(
        Proveedor,
        on_delete=models.PROTECT,
        related_name="solicitudes"
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default="pendiente")

    class Meta:
        ordering = ["-fecha_creacion"]

    def __str__(self):
        return f"Solicitud #{self.id} - {self.proveedor.nombre} ({self.estado})"

    @property
    def total(self):
        # Suma de todos los items asociados
        agregados = self.items.all()
        return sum([item.precio_unitario * item.cantidad for item in agregados])


class ItemSolicitud(models.Model):
    solicitud = models.ForeignKey(
        SolicitudCompra,
        on_delete=models.CASCADE,
        related_name="items"
    )
    nombre_producto = models.CharField(max_length=200)
    enlace_producto = models.URLField(blank=True, null=True)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.nombre_producto} x {self.cantidad}"
