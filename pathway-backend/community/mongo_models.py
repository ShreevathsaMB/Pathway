"""
MongoDB Models for Community App
Stores communities, posts, and comments in MongoDB
"""
from mongoengine import Document, EmbeddedDocument
from mongoengine.fields import (
    StringField, IntField, DateTimeField, BooleanField,
    ReferenceField, ListField, URLField
)
from datetime import datetime


class Community(Document):
    """Community model stored in MongoDB"""
    meta = {
        'collection': 'communities',
        'ordering': ['name']
    }
    
    slug = StringField(required=True, unique=True, max_length=200)
    name = StringField(required=True, max_length=200)
    description = StringField()
    icon = StringField(max_length=50, default='👥')
    member_count = IntField(default=0)
    
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def __str__(self):
        return self.name


class Post(Document):
    """Post model stored in MongoDB"""
    meta = {
        'collection': 'posts',
        'ordering': ['-created_at']
    }
    
    community = ReferenceField(Community, required=True)
    author_id = IntField(required=True)  # Reference to SQLite User.id
    
    title = StringField(required=True, max_length=300)
    content = StringField(required=True)
    
    # Media file paths
    image_url = StringField()
    video_url = StringField()
    
    is_anonymous = BooleanField(default=False)
    upvotes = IntField(default=0)
    upvoted_by = ListField(IntField(), default=list)  # List of User IDs
    
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def __str__(self):
        return self.title
    
    def toggle_upvote(self, user_id):
        """Toggle upvote for a user"""
        if user_id in self.upvoted_by:
            self.upvoted_by.remove(user_id)
            self.upvotes = max(0, self.upvotes - 1)
            is_upvoted = False
        else:
            self.upvoted_by.append(user_id)
            self.upvotes += 1
            is_upvoted = True
        
        self.updated_at = datetime.utcnow()
        self.save()
        return is_upvoted


class Comment(Document):
    """Comment model stored in MongoDB"""
    meta = {
        'collection': 'comments',
        'ordering': ['created_at']
    }
    
    post = ReferenceField(Post, required=True)
    author_id = IntField(required=True)  # Reference to SQLite User.id
    parent_comment = ReferenceField('self')  # For threaded replies
    
    content = StringField(required=True)
    is_anonymous = BooleanField(default=False)
    
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def __str__(self):
        return f"Comment on {self.post.title}"
