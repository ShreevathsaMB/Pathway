"""
MongoDB Serializers for Community App
Custom serializers to convert MongoDB documents to JSON
"""
from rest_framework import serializers
from .mongo_models import Community, Post, Comment
from users.models import User


class CommunityMongoSerializer(serializers.Serializer):
    """Serializer for MongoDB Community model"""
    id = serializers.CharField(read_only=True)
    slug = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField()
    icon = serializers.CharField()
    member_count = serializers.IntegerField()
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    def create(self, validated_data):
        return Community(**validated_data).save()
    
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class PostMongoSerializer(serializers.Serializer):
    """Serializer for MongoDB Post model"""
    id = serializers.CharField(read_only=True)
    community = serializers.CharField()  # Community ID
    author_id = serializers.IntegerField()
    
    title = serializers.CharField()
    content = serializers.CharField()
    
    image_url = serializers.CharField(required=False, allow_blank=True)
    video_url = serializers.CharField(required=False, allow_blank=True)
    
    is_anonymous = serializers.BooleanField(default=False)
    upvotes = serializers.IntegerField(read_only=True)
    upvoted_by = serializers.ListField(child=serializers.IntegerField(), read_only=True)
    
    # Computed fields
    author_details = serializers.SerializerMethodField()
    community_name = serializers.SerializerMethodField()
    upvote_count = serializers.SerializerMethodField()
    is_upvoted = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    def get_author_details(self, obj):
        """Get author details from SQLite"""
        if obj.is_anonymous:
            return {'username': 'Anonymous', 'first_name': '', 'last_name': ''}
        
        try:
            user = User.objects.get(id=obj.author_id)
            return {
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        except User.DoesNotExist:
            return {'username': 'Deleted User', 'first_name': '', 'last_name': ''}
    
    def get_community_name(self, obj):
        """Get community name"""
        return obj.community.name if obj.community else None
    
    def get_upvote_count(self, obj):
        """Get upvote count"""
        return len(obj.upvoted_by) if obj.upvoted_by else 0
    
    def get_is_upvoted(self, obj):
        """Check if current user upvoted"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.id in (obj.upvoted_by or [])
        return False
    
    def get_comments(self, obj):
        """Get comments for this post"""
        comments = Comment.objects.filter(post=obj)
        return CommentMongoSerializer(comments, many=True, context=self.context).data
    
    def create(self, validated_data):
        community_id = validated_data.pop('community')
        community = Community.objects.get(id=community_id)
        return Post(community=community, **validated_data).save()
    
    def update(self, instance, validated_data):
        if 'community' in validated_data:
            community_id = validated_data.pop('community')
            instance.community = Community.objects.get(id=community_id)
        
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class CommentMongoSerializer(serializers.Serializer):
    """Serializer for MongoDB Comment model"""
    id = serializers.CharField(read_only=True)
    post = serializers.CharField()  # Post ID
    author_id = serializers.IntegerField()
    parent_comment = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    
    content = serializers.CharField()
    is_anonymous = serializers.BooleanField(default=False)
    
    # Computed fields
    author_details = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    is_op = serializers.SerializerMethodField()
    
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    def get_author_details(self, obj):
        """Get author details from SQLite"""
        if obj.is_anonymous:
            return {'username': 'Anonymous', 'first_name': '', 'last_name': ''}
        
        try:
            user = User.objects.get(id=obj.author_id)
            return {
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        except User.DoesNotExist:
            return {'username': 'Deleted User', 'first_name': '', 'last_name': ''}
    
    def get_replies(self, obj):
        """Get nested replies to this comment"""
        replies = Comment.objects.filter(parent_comment=obj).order_by('created_at')
        return CommentMongoSerializer(replies, many=True, context=self.context).data
    
    def get_is_op(self, obj):
        """Check if commenter is the original post author"""
        if obj.post:
            return obj.author_id == obj.post.author_id
        return False
    
    def create(self, validated_data):
        post_id = validated_data.pop('post')
        post = Post.objects.get(id=post_id)
        
        parent_comment_id = validated_data.pop('parent_comment', None)
        parent_comment = None
        if parent_comment_id:
            try:
                parent_comment = Comment.objects.get(id=parent_comment_id)
            except Comment.DoesNotExist:
                pass
        
        return Comment(post=post, parent_comment=parent_comment, **validated_data).save()
    
    def update(self, instance, validated_data):
        if 'post' in validated_data:
            post_id = validated_data.pop('post')
            instance.post = Post.objects.get(id=post_id)
        
        if 'parent_comment' in validated_data:
            parent_comment_id = validated_data.pop('parent_comment')
            if parent_comment_id:
                instance.parent_comment = Comment.objects.get(id=parent_comment_id)
            else:
                instance.parent_comment = None
        
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
