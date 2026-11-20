"""
MongoDB Models for Tasks App
Stores user tasks in MongoDB
"""
from mongoengine import Document
from mongoengine.fields import (
    StringField, IntField, DateTimeField, BooleanField, DateField
)
from datetime import datetime


class Task(Document):
    """Task model stored in MongoDB"""
    meta = {
        'collection': 'tasks',
        'ordering': ['-created_at']
    }
    
    user_id = IntField(required=True)  # Reference to SQLite User.id
    
    title = StringField(required=True, max_length=200)
    description = StringField()
    category = StringField(max_length=50)
    
    is_completed = BooleanField(default=False)
    completed_at = DateTimeField()
    
    created_at = DateTimeField(default=datetime.utcnow)
    date = DateField(default=datetime.utcnow)
    
    def __str__(self):
        return self.title
    
    def mark_complete(self):
        """Mark task as completed"""
        self.is_completed = True
        self.completed_at = datetime.utcnow()
        self.save()
