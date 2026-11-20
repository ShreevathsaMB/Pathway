from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import DailyTask, TaskTemplate
from .serializers import DailyTaskSerializer, TaskTemplateSerializer
import random

class DailyTaskListCreateView(generics.ListCreateAPIView):
    serializer_class = DailyTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return tasks for the current user and current date
        today = timezone.now().date()
        queryset = DailyTask.objects.filter(user=self.request.user, date=today)
        
        # If no tasks for today, generate them from templates
        if not queryset.exists():
            self.generate_daily_tasks()
            queryset = DailyTask.objects.filter(user=self.request.user, date=today)
            
        return queryset

    def generate_daily_tasks(self):
        user = self.request.user
        lang = user.language_preference
        today = timezone.now().date()
        
        # Get templates for the user's language
        templates = TaskTemplate.objects.filter(language=lang, is_active=True)
        
        # If no templates for language, fallback to English
        if not templates.exists():
            templates = TaskTemplate.objects.filter(language='en', is_active=True)
            
        # Group by type and pick one for each type
        task_types = ['reading', 'meditation', 'music', 'reflection']
        for t_type in task_types:
            type_templates = templates.filter(task_type=t_type)
            if type_templates.exists():
                template = random.choice(list(type_templates))
                DailyTask.objects.get_or_create(
                    user=user,
                    date=today,
                    task_type=t_type,
                    defaults={
                        'title': template.title,
                        'description': template.description
                    }
                )

class MarkTaskCompleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            task = DailyTask.objects.get(pk=pk, user=request.user)
            task.mark_complete()
            return Response({'status': 'task marked as complete', 'completed': task.completed}, status=status.HTTP_200_OK)
        except DailyTask.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
