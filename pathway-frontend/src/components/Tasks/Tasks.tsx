import { useState, useEffect, useRef } from 'react';
import axios from '../../api/axios';
import { Check, Plus, X, Flame, Zap, Trophy, Target } from 'lucide-react';

// ── Types ──────────────────────────────────────────────
interface Mission {
    id: string | number;
    title: string;
    description?: string;
    emoji: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    xp: number;
    completed: boolean;
    custom?: boolean;   // true = user-added
}

// ── Emoji picker options ──────────────────────────────
const EMOJI_OPTIONS = [
    '🧘','📖','💪','🎯','💬','🌿','🎵','🏃','🍎','💤',
    '✍️','🧠','🌟','❤️','🙏','🌅','🚶','💧','🎨','🌸',
];

// ── Default routine missions ──────────────────────────
const DEFAULT_MISSIONS: Mission[] = [
    { id: 'def-1', emoji: '🧘', title: 'Morning Meditation', description: '10 minutes of guided breathing to start your day', difficulty: 'Easy', xp: 30, completed: false },
    { id: 'def-2', emoji: '📖', title: 'Read for 15 Minutes', description: 'Any book that nourishes your mind or soul', difficulty: 'Easy', xp: 30, completed: false },
    { id: 'def-3', emoji: '💬', title: 'Reach Out to Someone', description: 'Send a kind message or call a loved one', difficulty: 'Medium', xp: 50, completed: false },
    { id: 'def-4', emoji: '🏃', title: 'Take a 20-Min Walk', description: 'Step outside, breathe fresh air, move your body', difficulty: 'Medium', xp: 50, completed: false },
    { id: 'def-5', emoji: '✍️', title: 'Journal Your Thoughts', description: 'Write down 3 things you are grateful for today', difficulty: 'Easy', xp: 30, completed: false },
];

const DIFF_STYLE: Record<string, string> = {
    Easy:   'tm-badge-easy',
    Medium: 'tm-badge-medium',
    Hard:   'tm-badge-hard',
};

const CARD_ACCENT: string[] = [
    'tm-accent-purple',
    'tm-accent-teal',
    'tm-accent-indigo',
    'tm-accent-amber',
    'tm-accent-rose',
    'tm-accent-green',
    'tm-accent-pink',
    'tm-accent-cyan',
];

const HEATMAP_DAYS = ['M','T','W','T','F','S','S'];

export default function Tasks() {
    const [apiTasks, setApiTasks] = useState<any[]>([]);
    const [customMissions, setCustomMissions] = useState<Mission[]>(() => {
        try {
            const stored = localStorage.getItem('pathway-custom-missions');
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });
    const [completedIds, setCompletedIds] = useState<Set<string | number>>(() => {
        try {
            const stored = localStorage.getItem('pathway-completed-ids');
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch { return new Set(); }
    });
    const [loading, setLoading] = useState(true);

    // Add-task UI state
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newEmoji, setNewEmoji] = useState('🎯');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [newDiff, setNewDiff] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        localStorage.setItem('pathway-custom-missions', JSON.stringify(customMissions));
    }, [customMissions]);

    useEffect(() => {
        localStorage.setItem('pathway-completed-ids', JSON.stringify([...completedIds]));
    }, [completedIds]);

    const fetchTasks = async () => {
        try {
            const res = await axios.get('tasks/daily/');
            const data = res.data.results || res.data;
            setApiTasks(Array.isArray(data) ? data : []);
        } catch {
            setApiTasks([]);
        } finally {
            setLoading(false);
        }
    };

    // Build unified mission list ──────────────────────
    const buildMissions = (): Mission[] => {
        const apiMissions: Mission[] = apiTasks.map((t, i) => ({
            id: t.id,
            emoji: ['🧘','💪','🎯','🌿','🧠'][i % 5],
            title: t.title,
            description: t.description || t.subtitle || '',
            difficulty: (['Easy', 'Medium', 'Hard'] as const)[i % 3],
            xp: [30, 50, 70][i % 3],
            completed: completedIds.has(t.id),
        }));

        // If no API tasks, fall back to defaults
        const base = apiMissions.length > 0 ? apiMissions : DEFAULT_MISSIONS.map(d => ({
            ...d,
            completed: completedIds.has(d.id),
        }));

        return [
            ...base,
            ...customMissions.map(m => ({ ...m, completed: completedIds.has(m.id) })),
        ];
    };

    const missions = buildMissions();
    const totalCount = missions.length;
    const doneCount = missions.filter(m => m.completed).length;
    const percentage = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
    const totalXP = missions.filter(m => m.completed).reduce((s, m) => s + m.xp, 0);

    // Toggle completion ───────────────────────────────
    const toggleMission = async (mission: Mission) => {
        const newSet = new Set(completedIds);
        if (newSet.has(mission.id)) {
            newSet.delete(mission.id);
        } else {
            newSet.add(mission.id);
            // If it's an API task also hit the backend
            if (!mission.custom && typeof mission.id === 'number') {
                try { await axios.post(`tasks/daily/${mission.id}/complete/`); } catch {}
            }
        }
        setCompletedIds(newSet);
    };

    // Add custom mission ──────────────────────────────
    const handleAddMission = () => {
        if (!newTitle.trim()) return;
        const newM: Mission = {
            id: `custom-${Date.now()}`,
            emoji: newEmoji,
            title: newTitle.trim(),
            description: '',
            difficulty: newDiff,
            xp: newDiff === 'Easy' ? 30 : newDiff === 'Medium' ? 50 : 70,
            completed: false,
            custom: true,
        };
        setCustomMissions(prev => [...prev, newM]);
        setNewTitle('');
        setNewEmoji('🎯');
        setShowAddForm(false);
        setShowEmojiPicker(false);
    };

    const removeCustom = (id: string | number) => {
        setCustomMissions(prev => prev.filter(m => m.id !== id));
        setCompletedIds(prev => {
            const s = new Set(prev); s.delete(id); return s;
        });
    };

    if (loading) return (
        <div className="hg-root" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width:48,height:48,border:'4px solid rgba(124,58,237,0.3)',borderTopColor:'#7c3aed',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
        </div>
    );

    return (
        <div className="hg-root">
            {/* Background orbs */}
            <div className="hg-orb hg-orb-1" />
            <div className="hg-orb hg-orb-2" />
            <div className="hg-orb hg-orb-3" />

            <div className="tm-layout">
                {/* ── LEFT / MAIN ── */}
                <div className="tm-main">

                    {/* Header card */}
                    <div className="tm-header-card">
                        <div className="tm-header-left">
                            <p className="tm-header-eyebrow">🎮 Today's Progress</p>
                            <h1 className="tm-header-title">Daily Missions</h1>
                            <p className="tm-header-sub">Complete your daily challenges and grow stronger</p>

                            {/* XP progress bar */}
                            <div className="tm-xp-bar-wrap">
                                <div className="tm-xp-bar-track">
                                    <div className="tm-xp-bar-fill" style={{ width: `${percentage}%` }} />
                                </div>
                                <div className="tm-xp-labels">
                                    <span className="tm-xp-label-text">0 XP</span>
                                    <span className="tm-xp-label-text">{totalXP} / {missions.reduce((s,m)=>s+m.xp,0)} XP</span>
                                </div>
                            </div>
                        </div>

                        <div className="tm-header-right">
                            {/* Percentage badge */}
                            <div className="tm-pct-badge">
                                <div className="tm-pct-ring">
                                    <svg width="80" height="80" viewBox="0 0 80 80">
                                        <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6"/>
                                        <circle
                                            cx="40" cy="40" r="32" fill="none"
                                            stroke="url(#pctGrad)" strokeWidth="6"
                                            strokeLinecap="round"
                                            strokeDasharray={`${(percentage/100)*(2*Math.PI*32)} ${2*Math.PI*32}`}
                                            transform="rotate(-90 40 40)"
                                        />
                                        <defs>
                                            <linearGradient id="pctGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#f59e0b"/>
                                                <stop offset="100%" stopColor="#ef4444"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="tm-pct-center">
                                        <span className="tm-pct-num">{percentage}%</span>
                                    </div>
                                </div>
                                <p className="tm-pct-label">{doneCount}/{totalCount} Done</p>
                            </div>
                        </div>
                    </div>

                    {/* Missions grid */}
                    <div className="tm-grid">
                        {missions.map((m, i) => (
                            <div
                                key={m.id}
                                className={`tm-card ${m.completed ? 'tm-card-done' : ''}`}
                                onClick={() => toggleMission(m)}
                            >
                                {/* Colored left stripe */}
                                <div className={`tm-card-stripe ${CARD_ACCENT[i % CARD_ACCENT.length]}`} />

                                <div className="tm-card-inner">
                                    <div className="tm-card-emoji">{m.emoji}</div>
                                    <div className="tm-card-body">
                                        <div className="tm-card-top">
                                            <p className="tm-card-title">{m.title}</p>
                                            {m.custom && (
                                                <button
                                                    className="tm-remove-btn"
                                                    onClick={e => { e.stopPropagation(); removeCustom(m.id); }}
                                                    title="Remove task"
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>
                                        {m.description && <p className="tm-card-desc">{m.description}</p>}
                                        <div className="tm-card-meta">
                                            <span className={`tm-badge ${DIFF_STYLE[m.difficulty]}`}>{m.difficulty}</span>
                                            <span className="tm-xp-chip">+{m.xp} XP</span>
                                        </div>
                                    </div>
                                    {/* Checkbox */}
                                    <div className={`tm-check ${m.completed ? 'tm-check-done' : ''}`}>
                                        {m.completed && <Check size={14} />}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* ── Add Mission Card ── */}
                        {!showAddForm ? (
                            <button className="tm-add-card" onClick={() => { setShowAddForm(true); setTimeout(()=>inputRef.current?.focus(), 50); }}>
                                <Plus size={28} className="tm-add-icon" />
                                <span>Add Routine Task</span>
                            </button>
                        ) : (
                            <div className="tm-add-form">
                                <div className="tm-add-row">
                                    {/* Emoji picker trigger */}
                                    <button className="tm-emoji-trigger" onClick={() => setShowEmojiPicker(p => !p)}>
                                        {newEmoji}
                                    </button>
                                    <input
                                        ref={inputRef}
                                        className="tm-add-input"
                                        placeholder="Task name..."
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleAddMission()}
                                    />
                                    <button className="tm-add-submit" onClick={handleAddMission}><Check size={16}/></button>
                                    <button className="tm-add-cancel" onClick={() => { setShowAddForm(false); setShowEmojiPicker(false); }}><X size={16}/></button>
                                </div>

                                {/* Difficulty picker */}
                                <div className="tm-diff-row">
                                    {(['Easy','Medium','Hard'] as const).map(d => (
                                        <button
                                            key={d}
                                            className={`tm-diff-pick ${newDiff === d ? 'tm-diff-active' : ''}`}
                                            onClick={() => setNewDiff(d)}
                                        >{d}</button>
                                    ))}
                                </div>

                                {/* Emoji grid */}
                                {showEmojiPicker && (
                                    <div className="tm-emoji-grid">
                                        {EMOJI_OPTIONS.map(e => (
                                            <button
                                                key={e}
                                                className={`tm-emoji-opt ${newEmoji === e ? 'tm-emoji-selected' : ''}`}
                                                onClick={() => { setNewEmoji(e); setShowEmojiPicker(false); }}
                                            >{e}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT SIDEBAR ── */}
                <div className="tm-sidebar">

                    {/* Today's XP */}
                    <div className="tm-side-card">
                        <div className="hg-card-glow hg-glow-purple" />
                        <div className="tm-side-header">
                            <Zap size={18} className="tm-icon-yellow" />
                            <span className="tm-side-title">Today's XP</span>
                        </div>
                        <div className="tm-xp-big">{totalXP}</div>
                        <div className="tm-xp-sub">of {missions.reduce((s,m)=>s+m.xp,0)} XP available</div>
                    </div>

                    {/* Weekly heatmap */}
                    <div className="tm-side-card">
                        <div className="hg-card-glow hg-glow-teal" />
                        <div className="tm-side-header">
                            <Flame size={18} className="tm-icon-orange" />
                            <span className="tm-side-title">This Week</span>
                        </div>
                        <div className="tm-heatmap">
                            {HEATMAP_DAYS.map((d, i) => (
                                <div key={i} className="tm-heat-col">
                                    <div className={`tm-heat-sq ${i < 5 ? 'tm-heat-done' : i === 5 ? 'tm-heat-today' : 'tm-heat-off'}`} />
                                    <span className="tm-heat-lbl">{d}</span>
                                </div>
                            ))}
                        </div>
                        <p className="tm-heat-desc">5 day streak 🔥</p>
                    </div>

                    {/* Stats */}
                    <div className="tm-side-card">
                        <div className="hg-card-glow hg-glow-pink" />
                        <div className="tm-side-header">
                            <Trophy size={18} className="tm-icon-pink" />
                            <span className="tm-side-title">Stats</span>
                        </div>
                        <div className="tm-stats-grid">
                            <div className="tm-stat-box">
                                <div className="tm-stat-val">{doneCount}</div>
                                <div className="tm-stat-key">Done</div>
                            </div>
                            <div className="tm-stat-box">
                                <div className="tm-stat-val">{totalCount - doneCount}</div>
                                <div className="tm-stat-key">Left</div>
                            </div>
                            <div className="tm-stat-box">
                                <div className="tm-stat-val">{percentage}%</div>
                                <div className="tm-stat-key">Progress</div>
                            </div>
                            <div className="tm-stat-box">
                                <div className="tm-stat-val">{totalXP}</div>
                                <div className="tm-stat-key">XP</div>
                            </div>
                        </div>
                    </div>

                    {/* Power-ups */}
                    <div className="tm-side-card">
                        <div className="hg-card-glow hg-glow-indigo" />
                        <div className="tm-side-header">
                            <Target size={18} className="tm-icon-indigo" />
                            <span className="tm-side-title">Power-Ups</span>
                        </div>
                        {[
                            { emoji:'🧘', label:'Meditation Bonus', pts:'+20 XP', done: doneCount >= 1 },
                            { emoji:'💬', label:'Community Share', pts:'+30 XP', done: doneCount >= 3 },
                            { emoji:'🏆', label:'All Missions Done', pts:'+50 XP', done: percentage === 100 },
                        ].map((p,i) => (
                            <div key={i} className={`tm-powerup ${p.done ? 'tm-powerup-done' : ''}`}>
                                <span className="tm-powerup-emoji">{p.emoji}</span>
                                <span className="tm-powerup-label">{p.label}</span>
                                <span className="tm-powerup-pts">{p.pts}</span>
                                {p.done && <Check size={12} className="tm-powerup-check"/>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
