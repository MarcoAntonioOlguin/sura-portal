from django.contrib import admin
from .models import Proveedor

@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ["name", "contact", "address","partnership"]
    search_fields = ["name", "contact"]