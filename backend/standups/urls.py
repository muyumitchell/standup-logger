from django.urls import path
from . import views

urlpatterns = [
    path('standups/', views.standup_list, name='standup-list'),
    path('standups/<int:pk>/', views.standup_detail, name='standup-detail'),
    path('standups/stats/', views.standup_stats, name='standup-stats'),
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_view, name='login'),
]