from django.urls import path
from .views import ResourceListView, ResourceDetailView

urlpatterns = [
    path('list/', ResourceListView.as_view(), name='resource-list'),
    path('<int:pk>/', ResourceDetailView.as_view(), name='resource-detail'),
]
