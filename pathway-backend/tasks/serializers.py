from rest_framework import serializers
from .models import DailyTask, TaskTemplate

class TaskTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskTemplate
        fields = '__all__'

class DailyTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyTask
        fields = '__all__'
        read_only_fields = ['user', 'date', 'completed_at']
