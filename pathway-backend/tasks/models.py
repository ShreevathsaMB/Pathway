from django.db import models
from django.conf import settings
from django.utils import timezone


class DailyTask(models.Model):
    """
    Daily tasks for users to complete.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='daily_tasks'
    )
    
    TASK_TYPES = [
        ('reading', 'Morning Reading'),
        ('meditation', 'Meditation'),
        ('music', 'Calming Music'),
        ('reflection', 'Evening Reflection'),
    ]
    
    task_type = models.CharField(max_length=20, choices=TASK_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    date = models.DateField(default=timezone.now)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pathway_daily_tasks'
        ordering = ['date', 'task_type']
        unique_together = ['user', 'task_type', 'date']
    
    def __str__(self):
        return f"{self.user.username} - {self.title} - {self.date}"
    
    def mark_complete(self):
        """Mark task as completed."""
        if not self.completed:
            self.completed = True
            self.completed_at = timezone.now()
            self.save()
            
            # Update user streak if all tasks for today are complete
            self._check_and_update_streak()
    
    def _check_and_update_streak(self):
        """Check if all tasks for today are complete and update streak."""
        today_tasks = DailyTask.objects.filter(
            user=self.user,
            date=self.date
        )
        
        if today_tasks.filter(completed=False).count() == 0:
            # All tasks complete, update streak
            self.user.update_streak()


class TaskTemplate(models.Model):
    """
    Templates for generating daily tasks.
    """
    task_type = models.CharField(max_length=20)
    title = models.CharField(max_length=200)
    description = models.TextField()
    language = models.CharField(max_length=2, default='en')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pathway_task_templates'
    
    def __str__(self):
        return f"{self.task_type} - {self.title} ({self.language})"
