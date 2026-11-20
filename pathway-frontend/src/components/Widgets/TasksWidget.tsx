import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import axios from '../../api/axios';

interface Task {
    id: number;
    title: string;
    subtitle: string;
    completed: boolean;
    task_type: string;
}

export default function TasksWidget() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('tasks/daily/');
            // Ensure response.data is an array before setting
            const tasksData = Array.isArray(response.data) ? response.data : [];
            setTasks(tasksData);
        } catch (error: any) {
            console.error('Failed to fetch tasks:', error);
            // If unauthorized or any error, just set empty tasks
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (id: number) => {
        try {
            await axios.post(`tasks/daily/${id}/complete/`);
            // Refresh tasks after completion
            fetchTasks();
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    if (loading) {
        return <div className="tasks-widget">Loading tasks...</div>;
    }

    return (
        <div className="tasks-widget">
            <h3 style={{ marginBottom: '20px' }}>Today's Tasks</h3>
            {tasks.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center' }}>No tasks for today</p>
            ) : (
                tasks.map(task => (
                    <div
                        key={task.id}
                        className={`task-item ${task.completed ? 'completed' : ''}`}
                        onClick={() => toggleTask(task.id)}
                    >
                        <div className="checkbox">
                            {task.completed && <Check className="w-4 h-4" />}
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                            <div style={{ fontSize: '0.9em', color: '#999' }}>{task.subtitle}</div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
