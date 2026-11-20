from django.db import models
from django.conf import settings
from django.utils import timezone
import json


class Conversation(models.Model):
    """
    AI companion conversation sessions.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ai_conversations'
    )
    
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('te', 'Telugu'),
        ('hi', 'Hindi'),
        ('ta', 'Tamil'),
        ('kn', 'Kannada'),
        ('ml', 'Malayalam'),
    ]
    
    companion_name = models.CharField(max_length=50)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='en')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pathway_ai_conversations'
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.companion_name} - {self.created_at.date()}"
    
    def get_messages(self):
        """Get all messages in this conversation."""
        return self.messages.all().order_by('created_at')
    
    def get_message_history_for_api(self, limit=10):
        """Get recent messages formatted for Claude API."""
        messages = self.messages.order_by('-created_at')[:limit]
        messages = list(reversed(messages))
        
        formatted = []
        for msg in messages:
            formatted.append({
                'role': msg.role,
                'content': msg.content
            })
        
        return formatted


class Message(models.Model):
    """
    Individual messages in AI conversations.
    """
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'AI Assistant'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pathway_ai_messages'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."
