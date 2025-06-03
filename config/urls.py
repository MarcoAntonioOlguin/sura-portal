from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from proveedores.views import ProveedorViewSet
from compras.views import SolicitudCompraViewSet
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r"proveedores", ProveedorViewSet, basename="proveedor")
router.register(r"solicitudes", SolicitudCompraViewSet, basename="solicitud")

urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth endpoints (login para obtener token)
    path("api/auth/login/", obtain_auth_token, name="api_token_auth"),
    # Rutas de las apps
    path("api/", include(router.urls)),
]
