import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../api/axios';
import axios from '../../api/axios';
import { Check, MessageCircle, Zap, Users, BookOpen, TrendingUp, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Task {
    id: number;
    title: string;
    subtitle: string;
    completed: boolean;
}

const MOOD_KEYS = [
    { emoji: '😔', key: 'mood.low' },
    { emoji: '😐', key: 'mood.okay' },
    { emoji: '🙂', key: 'mood.good' },
    { emoji: '😊', key: 'mood.great' },
    { emoji: '😄', key: 'mood.amazing' },
];

const quickLinks = [
    { icon: MessageCircle, label: 'AI Chat', to: '/ai', color: 'from-violet-500 to-purple-600' },
    { icon: Users, label: 'Community', to: '/community', color: 'from-teal-500 to-cyan-600' },
    { icon: BookOpen, label: 'Resources', to: '/resources', color: 'from-indigo-500 to-blue-600' },
    { icon: Shield, label: 'Safety', to: '/safety', color: 'from-rose-500 to-pink-600' },
];

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [mood, setMood] = useState<number | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        fetchUserProfile();
        fetchTasks();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await authAPI.getProfile();
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoadingUser(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get('tasks/daily/');
            const tasksData = Array.isArray(response.data) ? response.data : [];
            setTasks(tasksData.slice(0, 4));
        } catch {
            setTasks([]);
        } finally {
            setLoadingTasks(false);
        }
    };

    const toggleTask = async (id: number) => {
        try {
            await axios.post(`tasks/daily/${id}/complete/`);
            fetchTasks();
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return t('home.greeting_morning');
        if (h < 18) return t('home.greeting_afternoon');
        return t('home.greeting_evening');
    };

    const completedTasks = tasks.filter(task => task.completed).length;
    const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
    const circumference = 2 * Math.PI * 36;
    const strokeDash = (taskProgress / 100) * circumference;

    return (
        <div className="hg-root">
            {/* Background orbs */}
            <div className="hg-orb hg-orb-1" />
            <div className="hg-orb hg-orb-2" />
            <div className="hg-orb hg-orb-3" />

            {/* ── GREETING HEADER ── */}
            <div className="hg-header">
                <div className="hg-greeting">
                    <div className="hg-greeting-top">
                        <div>
                            <p className="hg-greeting-time">{greeting()} 👋</p>
                            <h1 className="hg-greeting-name">
                                {loadingUser ? 'Loading...' : (user?.first_name || user?.username || 'Friend')}
                            </h1>
                        </div>
                        {user?.current_streak > 0 && (
                            <div className="hg-streak-pill">
                                🔥 <span>{user.current_streak}</span> Day Streak
                            </div>
                        )}
                    </div>
                    <p className="hg-greeting-sub">{t('home.how_feeling')}</p>

                    {/* Mood Selector */}
                    <div className="hg-mood-row">
                        {MOOD_KEYS.map((m, i) => (
                            <button
                                key={i}
                                className={`hg-mood-btn ${mood === i ? 'hg-mood-active' : ''}`}
                                onClick={() => setMood(i)}
                                title={t(m.key)}
                            >
                                <span className="hg-mood-emoji">{m.emoji}</span>
                                <span className="hg-mood-label">{t(m.key)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MAIN 3-COLUMN GRID ── */}
            <div className="hg-grid">

                {/* ── CARD 1: AI Companion ── */}
                <div className="hg-card hg-card-ai">
                    <div className="hg-card-glow hg-glow-purple" />
                    <div className="hg-card-header">
                        <div className="hg-ai-avatar">🌟</div>
                        <div>
                            <p className="hg-card-title">AI Companion</p>
                            <span className="hg-online-dot" /> <span className="hg-online-text">Online</span>
                        </div>
                    </div>
                    <div className="hg-chat-bubbles">
                        <div className="hg-bubble hg-bubble-ai">
                            "I'm here for you, always. What's on your mind today?"
                        </div>
                        <div className="hg-bubble hg-bubble-user">
                            I need some guidance...
                        </div>
                        <div className="hg-bubble hg-bubble-ai">
                            "Of course. Let's walk through this together 💜"
                        </div>
                    </div>
                    <Link to="/ai" className="hg-card-btn hg-btn-purple">
                        Start Conversation →
                    </Link>
                </div>

                {/* ── CARD 2: Today's Tasks ── */}
                <div className="hg-card hg-card-tasks">
                    <div className="hg-card-glow hg-glow-teal" />
                    <div className="hg-progress-row">
                        {/* Circular progress */}
                        <div className="hg-progress-ring-wrap">
                            <svg width="90" height="90" className="hg-progress-svg">
                                <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
                                <circle
                                    cx="45" cy="45" r="36"
                                    fill="none"
                                    stroke="url(#tealGrad)"
                                    strokeWidth="7"
                                    strokeLinecap="round"
                                    strokeDasharray={`${strokeDash} ${circumference}`}
                                    transform="rotate(-90 45 45)"
                                />
                                <defs>
                                    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#5eead4" />
                                        <stop offset="100%" stopColor="#0891b2" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="hg-progress-center">
                                <span className="hg-progress-pct">{taskProgress}%</span>
                            </div>
                        </div>
                        <div className="hg-progress-info">
                            <p className="hg-card-title">{t('home.todays_tasks')}</p>
                            <p className="hg-progress-sub">{completedTasks} {t('home.tasks_of')} {tasks.length} {t('home.tasks_done')}</p>
                        </div>
                    </div>

                    <div className="hg-task-list">
                        {loadingTasks ? (
                            <p className="hg-task-empty">{t('home.loading_tasks')}</p>
                        ) : tasks.length === 0 ? (
                            <p className="hg-task-empty">{t('home.no_tasks')}</p>
                        ) : (
                            tasks.map(task => (
                                <div
                                    key={task.id}
                                    className={`hg-task-item ${task.completed ? 'hg-task-done' : ''}`}
                                    onClick={() => toggleTask(task.id)}
                                >
                                    <div className={`hg-task-cb ${task.completed ? 'hg-cb-done' : ''}`}>
                                        {task.completed && <Check size={12} />}
                                    </div>
                                    <div className="hg-task-text">
                                        <p className="hg-task-title">{task.title}</p>
                                        {task.subtitle && <p className="hg-task-sub">{task.subtitle}</p>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Link to="/tasks" className="hg-card-btn hg-btn-teal">
                        {t('home.view_all_tasks')}
                    </Link>
                </div>

                {/* ── CARD 3: Community Feed ── */}
                <div className="hg-card hg-card-community">
                    <div className="hg-card-glow hg-glow-pink" />
                    <div className="hg-card-header">
                        <TrendingUp size={20} className="hg-card-icon-pink" />
                        <p className="hg-card-title">Community Feed</p>
                    </div>

                    {[
                        {
                            initials: 'PR',
                            color: 'from-violet-500 to-purple-600',
                            title: 'After 2 years, my family accepted my marriage 🎉',
                            tag: 'Success Story',
                            tagColor: 'hg-tag-pink',
                            likes: 142,
                        },
                        {
                            initials: 'SM',
                            color: 'from-teal-500 to-cyan-600',
                            title: 'How to talk to parents who don\'t understand',
                            tag: '234 replies',
                            tagColor: 'hg-tag-purple',
                            likes: 89,
                        },
                        {
                            initials: 'AK',
                            color: 'from-amber-500 to-orange-500',
                            title: 'Today\'s wisdom helped me through my toughest day',
                            tag: 'Trending',
                            tagColor: 'hg-tag-amber',
                            likes: 201,
                        },
                    ].map((post, i) => (
                        <div key={i} className="hg-feed-post">
                            <div className={`hg-feed-avatar bg-gradient-to-br ${post.color}`}>{post.initials}</div>
                            <div className="hg-feed-body">
                                <p className="hg-feed-title">{post.title}</p>
                                <div className="hg-feed-meta">
                                    <span className={`hg-tag ${post.tagColor}`}>{post.tag}</span>
                                    <span className="hg-feed-likes">❤️ {post.likes}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Link to="/community" className="hg-card-btn hg-btn-pink">
                        Join Community →
                    </Link>
                </div>
            </div>

            {/* ── TODAY'S WISDOM BANNER ── */}
            <div className="hg-wisdom">
                <div className="hg-card-glow hg-glow-indigo" />
                <div className="hg-wisdom-inner">
                    <div className="hg-wisdom-icon">📖</div>
                    <div className="hg-wisdom-text">
                        <p className="hg-wisdom-label">Today's Wisdom</p>
                        <p className="hg-wisdom-quote">"योगस्थः कुरु कर्माणि — Perform your duty with a balanced mind"</p>
                        <p className="hg-wisdom-source">Bhagavad Gita · Chapter 2, Verse 48</p>
                    </div>
                    <div className="hg-wisdom-badge">2 min read</div>
                </div>
            </div>

            {/* ── QUICK ACTIONS ── */}
            <div className="hg-quick-row">
                <p className="hg-quick-title">{t('home.quick_access')}</p>
                <div className="hg-quick-grid">
                    {quickLinks.map((q) => (
                        <Link key={q.label} to={q.to} className={`hg-quick-btn bg-gradient-to-br ${q.color}`}>
                            <q.icon size={22} />
                            <span>{q.label}</span>
                            <Zap size={14} className="hg-quick-zap" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
