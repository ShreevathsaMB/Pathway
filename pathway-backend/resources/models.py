from django.db import models


class Resource(models.Model):
    """
    Resources library - videos, articles, music, books.
    """
    RESOURCE_TYPES = [
        ('video', 'Video'),
        ('article', 'Article'),
        ('music', 'Music'),
        ('book', 'Book'),
        ('meditation', 'Meditation Guide'),
    ]
    
    title = models.CharField(max_length=300)
    description = models.TextField()
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    
    # Content
    url = models.URLField(max_length=500)
    thumbnail = models.ImageField(upload_to='resources/thumbnails/', null=True, blank=True)
    
    # Categorization
    CATEGORY_CHOICES = [
        ('meditation', 'Meditation'),
        ('wisdom', 'Wisdom & Philosophy'),
        ('success_stories', 'Success Stories'),
        ('music', 'Calming Music'),
        ('self_help', 'Self Help'),
        ('family', 'Family Relations'),
        ('relationships', 'Relationships'),
        ('career', 'Career Guidance'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    
    # Issue tags (JSON field for multiple tags)
    issue_tags = models.JSONField(default=list, blank=True)
    
    # Language
    language = models.CharField(max_length=2, default='en')
    
    # Duration (in minutes)
    duration_minutes = models.IntegerField(null=True, blank=True)
    
    # Metadata
    author = models.CharField(max_length=200, blank=True)
    views_count = models.IntegerField(default=0)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pathway_resources'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.resource_type})"
