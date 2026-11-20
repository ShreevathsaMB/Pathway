from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserMoodLog

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'age', 'language_preference',
            'ai_companion_name', 'issues'
        ]
    
    def validate(self, data):
        """Validate password confirmation."""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        return data
    
    def create(self, validated_data):
        """Create new user with hashed password."""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    issue_display_names = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'age', 'language_preference', 'ai_companion_name',
            'issues', 'issue_display_names', 'current_streak',
            'longest_streak', 'last_active_date', 'bio',
            'profile_picture', 'created_at', 'is_guest'
        ]
        read_only_fields = [
            'current_streak', 'longest_streak', 'last_active_date',
            'created_at', 'is_guest'
        ]
    
    def get_issue_display_names(self, obj):
        """Get human-readable issue names."""
        return obj.get_issue_display_names()


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'age', 'language_preference',
            'ai_companion_name', 'issues', 'bio', 'profile_picture'
        ]


class MoodLogSerializer(serializers.ModelSerializer):
    """Serializer for mood logs."""
    
    class Meta:
        model = UserMoodLog
        fields = ['id', 'mood', 'note', 'created_at']
        read_only_fields = ['created_at']


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
