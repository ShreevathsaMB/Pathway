"""
MongoDB Views for Community App
Views using MongoDB models instead of Django ORM
"""
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .mongo_models import Community, Post, Comment
from .mongo_serializers import CommunityMongoSerializer, PostMongoSerializer, CommentMongoSerializer
from django.core.files.storage import default_storage
from datetime import datetime


class CommunityListView(APIView):
    """List all communities from MongoDB"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        communities = Community.objects.all()
        serializer = CommunityMongoSerializer(communities, many=True)
        return Response(serializer.data)


class PostListCreateView(APIView):
    """List and create posts in MongoDB"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        community_slug = request.query_params.get('community_slug')
        community_id = request.query_params.get('community_id')
        
        if community_slug:
            try:
                community = Community.objects.get(slug=community_slug)
                posts = Post.objects.filter(community=community).order_by('-created_at')
            except Community.DoesNotExist:
                posts = []
        elif community_id:
            try:
                community = Community.objects.get(id=community_id)
                posts = Post.objects.filter(community=community).order_by('-created_at')
            except Community.DoesNotExist:
                posts = []
        else:
            posts = Post.objects.all().order_by('-created_at')
        
        serializer = PostMongoSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    def post(self, request):
        """Create a new post with optional file uploads"""
        data = request.data.copy()
        data['author_id'] = request.user.id
        
        # Handle file uploads
        image = request.FILES.get('image')
        video = request.FILES.get('video')
        
        # Get community
        community_id = data.get('community')
        try:
            community = Community.objects.get(id=community_id)
        except Community.DoesNotExist:
            return Response({'error': 'Community not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Save files and get URLs
        if image:
            image_path = default_storage.save(f'posts/images/{image.name}', image)
            data['image_url'] = default_storage.url(image_path)
        
        if video:
            video_path = default_storage.save(f'posts/videos/{video.name}', video)
            data['video_url'] = default_storage.url(video_path)
        
        # Create post
        serializer = PostMongoSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailView(APIView):
    """Retrieve, update, or delete a post"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
            serializer = PostMongoSerializer(post, context={'request': request})
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
            
            # Check if user is author
            if post.author_id != request.user.id:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = PostMongoSerializer(post, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
            
            # Check if user is author
            if post.author_id != request.user.id:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)


class ToggleUpvoteView(APIView):
    """Toggle upvote on a post"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
            user_id = request.user.id
            
            is_upvoted = post.toggle_upvote(user_id)
            
            return Response({
                'status': 'success',
                'is_upvoted': is_upvoted,
                'upvote_count': len(post.upvoted_by)
            }, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)


class CommentListCreateView(APIView):
    """List and create comments"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        post_id = request.query_params.get('post_id')
        if not post_id:
            return Response({'error': 'post_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            post = Post.objects.get(id=post_id)
            comments = Comment.objects.filter(post=post).order_by('created_at')
            serializer = CommentMongoSerializer(comments, many=True, context={'request': request})
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        data = request.data.copy()
        data['author_id'] = request.user.id
        
        serializer = CommentMongoSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDetailView(APIView):
    """Delete a comment"""
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, pk):
        try:
            comment = Comment.objects.get(id=pk)
            
            # Check if user is author
            if comment.author_id != request.user.id:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            # Delete all child comments recursively
            def delete_comment_and_replies(comment_obj):
                # Find and delete all replies first
                replies = Comment.objects.filter(parent_comment=comment_obj)
                for reply in replies:
                    delete_comment_and_replies(reply)
                # Delete the comment itself
                comment_obj.delete()
            
            delete_comment_and_replies(comment)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
