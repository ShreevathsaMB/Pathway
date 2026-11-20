from rest_framework import generics, permissions
from .models import Resource
from .serializers import ResourceSerializer

class ResourceListView(generics.ListAPIView):
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        category = self.request.query_params.get('category')
        r_type = self.request.query_params.get('type')
        lang = self.request.query_params.get('lang', 'en')
        
        queryset = Resource.objects.filter(language=lang)
        if category:
            queryset = queryset.filter(category=category)
        if r_type:
            queryset = queryset.filter(resource_type=r_type)
            
        return queryset.order_by('-created_at')

class ResourceDetailView(generics.RetrieveAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
