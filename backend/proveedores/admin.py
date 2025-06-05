from django.contrib import admin
from .models import Proveedor

@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ["nombre", "contacto", "partnership_activa"]
    search_fields = ["nombre", "contacto"]