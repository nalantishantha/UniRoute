from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    # Add your app URLs here, e.g.:
    # path('accounts/', include('apps.accounts.urls')),
]