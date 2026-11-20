from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
    UserProfileView,
    GuestLoginView,
    MoodLogCreateView,
    MoodLogListView,
    UpdateStreakView
)

app_name = 'users'

urlpatterns = [
    # Authentication
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('guest/', GuestLoginView.as_view(), name='guest-login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    
    # Profile
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    # Mood logging
    path('mood/', MoodLogCreateView.as_view(), name='mood-create'),
    path('mood/history/', MoodLogListView.as_view(), name='mood-history'),
    
    # Streak
    path('streak/update/', UpdateStreakView.as_view(), name='streak-update'),
]
