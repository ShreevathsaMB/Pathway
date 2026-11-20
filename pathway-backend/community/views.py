from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Community, Post, Comment
from .serializers import CommunitySerializer, PostSerializer, CommentSerializer

class CommunityListView(generics.ListAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [permissions.IsAuthenticated]

class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        community_id = self.request.query_params.get('community_id')
        community_slug = self.request.query_params.get('community_slug')
        
        if community_id:
            return Post.objects.filter(community_id=community_id).order_by('-created_at')
        elif community_slug:
            return Post.objects.filter(community__slug=community_slug).order_by('-created_at')
        
        return Post.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

class ToggleUpvoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
            is_upvoted = post.toggle_upvote(request.user)
            return Response({
                'status': 'success',
                'is_upvoted': is_upvoted,
                'upvote_count': post.upvoted_by.count()
            }, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        post_id = self.request.query_params.get('post_id')
        return Comment.objects.filter(post_id=post_id).order_by('created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
