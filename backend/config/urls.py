from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),

    # Si no existe app “api”, comenta o borra esta línea:
    # path('api/', include('api.urls')),

    path('api/auth/login/', obtain_auth_token, name='api_token_auth'),
    path('', RedirectView.as_view(url='/admin/', permanent=False)),
]
