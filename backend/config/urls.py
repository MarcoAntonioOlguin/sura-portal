from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import (
    TokenObtainPairView,   # para obtener token (login)
    TokenRefreshView,      # para renovar token
)
from .views import MyTokenObtainPairView
urlpatterns = [
    path("admin/", admin.site.urls),

    # 1) Ruta para obtener el access y refresh token al hacer login.
    #    Aquí es donde “aceptas el POST” con username y password.
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),

    # 2) Ruta para refrescar el access token usando el refresh token.
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # 3) Ahora sí, tu app de proveedores:
    path("api/", include("proveedores.urls")),
    path("api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]


