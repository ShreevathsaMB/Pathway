from rest_framework import generics, permissions
from .models import EmergencyContact, LegalInfo, SafetyTip
from .serializers import EmergencyContactSerializer, LegalInfoSerializer, SafetyTipSerializer

class EmergencyContactListView(generics.ListAPIView):
    queryset = EmergencyContact.objects.all().order_by('display_order')
    serializer_class = EmergencyContactSerializer
    permission_classes = [permissions.IsAuthenticated]

class LegalInfoListView(generics.ListAPIView):
    serializer_class = LegalInfoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        category = self.request.query_params.get('category')
        lang = self.request.query_params.get('lang', 'en')
        queryset = LegalInfo.objects.filter(language=lang)
        if category:
            queryset = queryset.filter(category=category)
        return queryset

class SafetyTipListView(generics.ListAPIView):
    serializer_class = SafetyTipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        category = self.request.query_params.get('category')
        lang = self.request.query_params.get('lang', 'en')
        queryset = SafetyTip.objects.filter(language=lang)
        if category:
            queryset = queryset.filter(category=category)
        return queryset.order_by('display_order')
