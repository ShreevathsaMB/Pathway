from rest_framework import serializers
from .models import Community, Post, Comment
from users.serializers import UserProfileSerializer

class CommunitySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()
    active_members = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = ['id', 'slug', 'name', 'description', 'icon', 'member_count', 'post_count', 'active_members', 'created_at']

    def get_post_count(self, obj):
        return obj.posts.count()

    def get_active_members(self, obj):
        """Count unique authors who have posted in this community."""
        return obj.posts.exclude(author=None).values('author').distinct().count()


class CommentSerializer(serializers.ModelSerializer):
    author_details = UserProfileSerializer(source='author', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_details', 'content', 'created_at', 'is_anonymous']
        read_only_fields = ['author']

class PostSerializer(serializers.ModelSerializer):
    author_details = UserProfileSerializer(source='author', read_only=True)
    community_name = serializers.ReadOnlyField(source='community.name')
    comments = CommentSerializer(many=True, read_only=True)
    upvote_count = serializers.IntegerField(source='upvoted_by.count', read_only=True)
    is_upvoted = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'community', 'community_name', 'author', 'author_details', 
            'title', 'content', 'image', 'video', 'is_anonymous', 
            'upvotes', 'upvote_count', 'is_upvoted', 'created_at', 'comments'
        ]
        read_only_fields = ['author', 'upvotes']

    def get_is_upvoted(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.upvoted_by.filter(id=user.id).exists()
        return False
