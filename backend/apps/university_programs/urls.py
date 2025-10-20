from django.urls import path
from . import views

urlpatterns = [
    # Z-Score Analysis endpoint
    path('analyze-zscore/', views.analyze_zscore, name='analyze_zscore'),
    # Get all programs for program matching page
    path('programs/', views.get_all_programs, name='get_all_programs'),
]
