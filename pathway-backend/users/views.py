import secrets

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    MoodLogSerializer,
    UserLoginSerializer
)
from .models import UserMoodLog

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    POST /api/users/register/
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    """
    API endpoint for user login.
    POST /api/users/login/
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Update streak on login
        user.update_streak()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to get and update user profile.
    GET /api/users/profile/
    PUT /api/users/profile/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserProfileSerializer
        return UserProfileUpdateSerializer


class UserLogoutView(APIView):
    """
    API endpoint for user logout.
    POST /api/users/logout/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class MoodLogCreateView(generics.CreateAPIView):
    """
    API endpoint to create mood log.
    POST /api/users/mood/
    """
    serializer_class = MoodLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MoodLogListView(generics.ListAPIView):
    """
    API endpoint to list user's mood logs.
    GET /api/users/mood/history/
    """
    serializer_class = MoodLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserMoodLog.objects.filter(user=self.request.user)


class GuestLoginView(APIView):
    """
    Create a temporary guest account and log it in.
    POST /api/users/guest/
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        valid_languages = {code for code, _ in User.LANGUAGE_CHOICES}
        language = request.data.get('language') or 'en'
        if language not in valid_languages:
            language = 'en'

        # Throwaway account with no usable password, so it can never be signed into directly.
        user = User.objects.create_user(
            username=f"guest_{secrets.token_hex(4)}",
            first_name='Guest',
            is_guest=True,
            language_preference=language,
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Guest session started',
        }, status=status.HTTP_201_CREATED)


class UpdateStreakView(APIView):
    """
    API endpoint to manually update user streak.
    POST /api/users/streak/update/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        current_streak = user.update_streak()
        
        return Response({
            'current_streak': current_streak,
            'longest_streak': user.longest_streak,
            'last_active_date': user.last_active_date
        }, status=status.HTTP_200_OK)
