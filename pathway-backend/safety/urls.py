from django.urls import path
from .views import EmergencyContactListView, LegalInfoListView, SafetyTipListView

urlpatterns = [
    path('contacts/', EmergencyContactListView.as_view(), name='emergency-contacts'),
    path('legal/', LegalInfoListView.as_view(), name='legal-info'),
    path('tips/', SafetyTipListView.as_view(), name='safety-tips'),
]
