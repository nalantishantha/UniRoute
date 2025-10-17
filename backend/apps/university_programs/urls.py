from django.urls import path
from . import views

urlpatterns = [
    # Z-Score Analysis endpoint
    path('analyze-zscore/', views.analyze_zscore, name='analyze_zscore'),
]
