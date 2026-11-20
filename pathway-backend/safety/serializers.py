from rest_framework import serializers
from .models import EmergencyContact, LegalInfo, SafetyTip

class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'

class LegalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalInfo
        fields = '__all__'

class SafetyTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyTip
        fields = '__all__'
