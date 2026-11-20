from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta


class User(AbstractUser):
    """
    Custom User model for Pathway application.
    Extends Django's AbstractUser with additional fields for mental wellness tracking.
    """
    
    # Personal Information
    age = models.IntegerField(null=True, blank=True)
    
    # Language preference
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('te', 'Telugu'),
        ('hi', 'Hindi'),
        ('ta', 'Tamil'),
        ('kn', 'Kannada'),
        ('ml', 'Malayalam'),
    ]
    language_preference = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES,
        default='en'
    )
    
    # AI Companion
    ai_companion_name = models.CharField(max_length=50, default='Alex')

    # Temporary account created by "Continue as guest"
    is_guest = models.BooleanField(default=False)
    
    # Issues/Concerns (stored as comma-separated values)
    ISSUE_CHOICES = [
        ('family_conflict', 'Family Conflicts'),
        ('intercaste_marriage', 'Intercaste Marriage'),
        ('career', 'Career & Life Purpose'),
        ('relationship', 'Relationship Issues'),
        ('property_dispute', 'Property Disputes'),
        ('depression', 'Depression & Loneliness'),
        ('safety', 'Safety & Protection'),
        ('other', 'Other'),
    ]
    issues = models.JSONField(default=list, blank=True)  # List of issue keys
    
    # Streak tracking
    current_streak = models.IntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)
    longest_streak = models.IntegerField(default=0)
    
    # Profile
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pathway_users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.username
    
    def update_streak(self):
        """
        Update user's streak based on last active date.
        Returns the current streak.
        """
        today = timezone.now().date()
        
        if self.last_active_date == today:
            # Already active today
            return self.current_streak
        
        elif self.last_active_date == today - timedelta(days=1):
            # Consecutive day
            self.current_streak += 1
            if self.current_streak > self.longest_streak:
                self.longest_streak = self.current_streak
        else:
            # Streak broken
            self.current_streak = 1
        
        self.last_active_date = today
        self.save()
        return self.current_streak
    
    def get_issue_display_names(self):
        """Get human-readable names for user's issues."""
        issue_dict = dict(self.ISSUE_CHOICES)
        return [issue_dict.get(issue, issue) for issue in self.issues]


class UserMoodLog(models.Model):
    """
    Track user's daily mood check-ins.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mood_logs')
    
    MOOD_CHOICES = [
        ('very_happy', '😊 Very Happy'),
        ('happy', '🙂 Happy'),
        ('neutral', '😐 Neutral'),
        ('sad', '😔 Sad'),
        ('very_sad', '😢 Very Sad'),
    ]
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pathway_mood_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.mood} - {self.created_at.date()}"
