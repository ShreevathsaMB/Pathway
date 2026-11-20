from django.urls import path
from .views import (
    CommunityListView, PostListCreateView, PostDetailView,
    ToggleUpvoteView, CommentListCreateView
)

urlpatterns = [
    path('list/', CommunityListView.as_view(), name='community-list'),
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/upvote/', ToggleUpvoteView.as_view(), name='post-upvote'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
]
