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
    path('admin/', admin.site.urls),
    path('api/auth/login/', include('rest_framework.authtoken.views.obtain_auth_token'), name='api_token_auth'),
    path('api/', include('api.urls')),
    path('', include('core.urls')),  # <— esto agrega la ruta raíz
]

