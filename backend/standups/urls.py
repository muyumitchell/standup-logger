from django.urls import path
from . import views

urlpatterns = [
    path('standups/', views.standup_list, name='standup-list'),
    path('standups/stats/', views.standup_stats, name='standup-stats'),
]