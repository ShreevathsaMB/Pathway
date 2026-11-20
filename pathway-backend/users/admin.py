from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserMoodLog


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model."""
    
    list_display = ['username', 'email', 'first_name', 'last_name', 'language_preference', 'current_streak', 'created_at']
    list_filter = ['language_preference', 'issues', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Pathway Information', {
            'fields': ('age', 'language_preference', 'ai_companion_name', 'issues', 'bio', 'profile_picture')
        }),
        ('Streak Information', {
            'fields': ('current_streak', 'longest_streak', 'last_active_date')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Pathway Information', {
            'fields': ('age', 'language_preference', 'ai_companion_name', 'issues')
        }),
    )


@admin.register(UserMoodLog)
class UserMoodLogAdmin(admin.ModelAdmin):
    """Admin interface for UserMoodLog model."""
    
    list_display = ['user', 'mood', 'created_at']
    list_filter = ['mood', 'created_at']
    search_fields = ['user__username', 'note']
    date_hierarchy = 'created_at'
