"""
MongoDB Models for AI Companion App
Stores conversations and messages in MongoDB
"""
from mongoengine import Document, EmbeddedDocument
from mongoengine.fields import (
    StringField, IntField, DateTimeField, ListField, EmbeddedDocumentField
)
from datetime import datetime


class Message(EmbeddedDocument):
    """Embedded message document"""
    role = StringField(required=True, choices=['user', 'assistant', 'system'])
    content = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)


class Conversation(Document):
    """Conversation model stored in MongoDB"""
    meta = {
        'collection': 'conversations',
        'ordering': ['-updated_at']
    }
    
    user_id = IntField(required=True)  # Reference to SQLite User.id
    companion_name = StringField(max_length=100, default='AI Companion')
    language = StringField(max_length=20, default='en')
    
    messages = ListField(EmbeddedDocumentField(Message), default=list)
    
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def __str__(self):
        return f"Conversation with {self.companion_name}"
    
    def add_message(self, role, content):
        """Add a message to the conversation"""
        message = Message(role=role, content=content)
        self.messages.append(message)
        self.updated_at = datetime.utcnow()
        self.save()
    
    def get_message_history_for_api(self):
        """Get message history formatted for API"""
        return [
            {'role': msg.role, 'content': msg.content}
            for msg in self.messages
        ]
