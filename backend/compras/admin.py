from django.contrib import admin
from .models import SolicitudCompra, ItemSolicitud

class ItemInline(admin.TabularInline):
    model = ItemSolicitud
    extra = 1

@admin.register(SolicitudCompra)
class SolicitudCompraAdmin(admin.ModelAdmin):
    list_display = ["id", "proveedor", "colocador", "estado", "fecha_creacion"]
    list_filter = ["estado", "fecha_creacion"]
    inlines = [ItemInline]
