from django.urls import path
from .mongo_views import (
    CommunityListView, PostListCreateView, PostDetailView, 
    ToggleUpvoteView, CommentListCreateView, CommentDetailView
)

urlpatterns = [
    path('list/', CommunityListView.as_view(), name='community-list'),
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<str:pk>/', PostDetailView.as_view(), name='post-detail'),  # Changed to str for MongoDB ObjectId
    path('posts/<str:pk>/upvote/', ToggleUpvoteView.as_view(), name='post-upvote'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<str:pk>/', CommentDetailView.as_view(), name='comment-detail'),
]
