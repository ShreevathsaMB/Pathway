from django.urls import path
from .views import ChatListView, ChatDetailView, SendMessageView

urlpatterns = [
    path('conversations/', ChatListView.as_view(), name='chat-list'),
    path('conversations/<int:pk>/', ChatDetailView.as_view(), name='chat-detail'),
    path('conversations/<int:conversation_id>/send/', SendMessageView.as_view(), name='send-message'),
]
