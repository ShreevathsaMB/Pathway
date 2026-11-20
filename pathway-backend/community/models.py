from django.db import models
from django.conf import settings
from django.utils import timezone


class Community(models.Model):
    """
    Topic-based communities for discussions.
    """
    COMMUNITY_TYPES = [
        ('family_conflicts', 'Family Conflicts'),
        ('intercaste_marriage', 'Intercaste Marriage'),
        ('career', 'Career & Life Purpose'),
        ('relationship', 'Relationship Issues'),
        ('property_dispute', 'Property Disputes'),
        ('depression', 'Depression & Loneliness'),
        ('safety', 'Safety & Protection'),
        ('success_stories', 'Success Stories'),
    ]
    
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='group')
    member_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pathway_communities'
        verbose_name_plural = 'Communities'
    
    def __str__(self):
        return self.name
    
    def get_active_users_count(self):
        """Get count of users active in last 24 hours."""
        from datetime import timedelta
        yesterday = timezone.now() - timedelta(days=1)
        return Post.objects.filter(
            community=self,
            created_at__gte=yesterday
        ).values('author').distinct().count()


class Post(models.Model):
    """
    User posts in communities.
    """
    community = models.ForeignKey(
        Community,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='posts'
    )
    
    title = models.CharField(max_length=300)
    content = models.TextField()
    
    # Media
    image = models.ImageField(upload_to='posts/images/', null=True, blank=True)
    video = models.FileField(upload_to='posts/videos/', null=True, blank=True)
    
    # Anonymous posting
    is_anonymous = models.BooleanField(default=False)
    
    # Engagement
    upvotes = models.IntegerField(default=0)
    upvoted_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='upvoted_posts',
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pathway_posts'
        ordering = ['-created_at']
    
    def __str__(self):
        author_name = 'Anonymous' if self.is_anonymous else (self.author.username if self.author else 'Deleted User')
        return f"{self.community.name} - {self.title} by {author_name}"
    
    def toggle_upvote(self, user):
        """Toggle upvote for a user."""
        if user in self.upvoted_by.all():
            self.upvoted_by.remove(user)
            self.upvotes = max(0, self.upvotes - 1)
        else:
            self.upvoted_by.add(user)
            self.upvotes += 1
        self.save()


class Comment(models.Model):
    """
    Comments on posts.
    """
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='comments'
    )
    
    content = models.TextField()
    is_anonymous = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pathway_comments'
        ordering = ['created_at']
    
    def __str__(self):
        author_name = 'Anonymous' if self.is_anonymous else (self.author.username if self.author else 'Deleted User')
        return f"Comment by {author_name} on {self.post.title}"
