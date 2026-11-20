from django.urls import path
from .views import DailyTaskListCreateView, MarkTaskCompleteView

urlpatterns = [
    path('daily/', DailyTaskListCreateView.as_view(), name='daily-tasks'),
    path('daily/<int:pk>/complete/', MarkTaskCompleteView.as_view(), name='task-complete'),
]
