from django.urls import path
from . import views

urlpatterns = [
    path('company-ad/pay/', views.company_ad_payment, name='company_ad_payment'),
]
