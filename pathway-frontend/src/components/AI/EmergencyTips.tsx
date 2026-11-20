import { MessageCircle, ChevronDown, ChevronUp, Zap, Wind, Sparkles, Sprout, Heart } from 'lucide-react';
import { useState } from 'react';

interface EmergencyTipsProps {
    onPromptSelect?: (prompt: string) => void;
}

export default function EmergencyTips({ onPromptSelect }: EmergencyTipsProps) {
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const preMadePrompts = [
        {
            category: 'Mindfulness & Calm',
            icon: Wind,
            color: 'teal',
            situations: [
                {
                    title: 'Start a breathing exercise',
                    prompt: "Guide me through a 5-minute breathing exercise to help me calm down and feel centered.",
                    context: 'Quick stress relief'
                },
                {
                    title: 'Grounding technique',
                    prompt: "I feel anxious right now. Can you guide me through the 5-4-3-2-1 grounding technique?",
                    context: 'For anxiety moments'
                },
                {
                    title: 'Evening wind-down routine',
                    prompt: "Help me create a calming bedtime routine to improve my sleep quality.",
                    context: 'Better sleep'
                }
            ]
        },
        {
            category: 'Gratitude & Positivity',
            icon: Sparkles,
            color: 'amber',
            situations: [
                {
                    title: 'Start a gratitude practice',
                    prompt: "Help me start a daily gratitude practice. What should I write in my gratitude journal today?",
                    context: 'Build positivity habits'
                },
                {
                    title: 'Reframe negative thoughts',
                    prompt: "I keep thinking negatively about myself. Can you help me reframe these thoughts in a more positive, realistic way?",
                    context: 'Cognitive reframing'
                },
                {
                    title: 'Celebrate a small win',
                    prompt: "I want to acknowledge something I did well today but I feel it's too small to matter. Help me celebrate it properly.",
                    context: 'Self-appreciation'
                }
            ]
        },
        {
            category: 'Personal Growth',
            icon: Sprout,
            color: 'green',
            situations: [
                {
                    title: 'Set meaningful goals',
                    prompt: "Help me set realistic, meaningful goals for the next month that align with my well-being.",
                    context: 'Goal setting'
                },
                {
                    title: 'Build a self-care routine',
                    prompt: "I want to build a daily self-care routine that fits my busy schedule. Can you help me design one?",
                    context: 'Daily wellness'
                },
                {
                    title: 'Overcome self-doubt',
                    prompt: "I often doubt my abilities and feel like I'm not good enough. How can I build more self-confidence?",
                    context: 'Building confidence'
                }
            ]
        },
        {
            category: 'Relationships & Connection',
            icon: Heart,
            color: 'pink',
            situations: [
                {
                    title: 'Improve communication',
                    prompt: "How can I communicate my feelings and needs more clearly to the people I care about?",
                    context: 'Better conversations'
                },
                {
                    title: 'Set healthy boundaries',
                    prompt: "I struggle to say no to people. How can I set healthy boundaries while still being kind?",
                    context: 'Boundary setting'
                },
                {
                    title: 'Reconnect with loved ones',
                    prompt: "I feel disconnected from family and friends lately. What are some ways to rebuild and strengthen these relationships?",
                    context: 'Deepening bonds'
                }
            ]
        }
    ];

    const handlePromptClick = (prompt: string) => {
        setSelectedPrompt(prompt);
        navigator.clipboard.writeText(prompt).catch(() => {});
        if (onPromptSelect) {
            onPromptSelect(prompt);
        }
    };

    const toggleCategory = (catName: string) => {
        setExpandedCategory(prev => prev === catName ? null : catName);
    };

    const getTheme = (color: string) => {
        const themes = {
            teal: { 
                border: 'border-teal-500/50', 
                shadow: '0 0 20px rgba(20,184,166,0.2)', 
                text: 'text-teal-600 dark:text-teal-400', 
                line: 'border-teal-500/30', 
                gradient: 'from-teal-500/20 to-transparent', 
                bgActive: 'bg-teal-500/5', 
                iconBg: 'bg-teal-500/10',
                iconGlow: '0 0 15px rgba(20,184,166,0.4)',
                sendBtn: 'bg-teal-500' 
            },
            amber: { 
                border: 'border-amber-500/50', 
                shadow: '0 0 20px rgba(245,158,11,0.2)', 
                text: 'text-amber-600 dark:text-amber-400', 
                line: 'border-amber-500/30', 
                gradient: 'from-amber-500/20 to-transparent', 
                bgActive: 'bg-amber-500/5', 
                iconBg: 'bg-amber-500/10',
                iconGlow: '0 0 15px rgba(245,158,11,0.4)',
                sendBtn: 'bg-amber-500' 
            },
            green: { 
                border: 'border-green-500/50', 
                shadow: '0 0 20px rgba(34,197,94,0.2)', 
                text: 'text-green-600 dark:text-green-400', 
                line: 'border-green-500/30', 
                gradient: 'from-green-500/20 to-transparent', 
                bgActive: 'bg-green-500/5', 
                iconBg: 'bg-green-500/10',
                iconGlow: '0 0 15px rgba(34,197,94,0.4)',
                sendBtn: 'bg-green-500' 
            },
            pink: { 
                border: 'border-pink-500/50', 
                shadow: '0 0 20px rgba(236,72,153,0.2)', 
                text: 'text-pink-600 dark:text-pink-400', 
                line: 'border-pink-500/30', 
                gradient: 'from-pink-500/20 to-transparent', 
                bgActive: 'bg-pink-500/5', 
                iconBg: 'bg-pink-500/10',
                iconGlow: '0 0 15px rgba(236,72,153,0.4)',
                sendBtn: 'bg-pink-500' 
            },
        };
        return themes[color as keyof typeof themes] || themes.teal;
    };

    return (
        <div className="space-y-4 w-full relative pb-4 px-1" style={{ color: 'var(--text-primary)' }}>
            <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>Wellness Starters</h3>
            </div>

            {/* Tree Container */}
            <div className="space-y-3">
                {preMadePrompts.map((category, catIdx) => {
                    const theme = getTheme(category.color);
                    const isExpanded = expandedCategory === category.category;
                    const Icon = category.icon;

                    return (
                        <div key={catIdx} className="relative">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category.category)}
                                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-500 relative z-10 group
                                    ${isExpanded
                                        ? `${theme.bgActive} ${theme.border}`
                                        : `border-transparent hover:border-white/5`
                                    }
                                `}
                                style={{
                                    background: isExpanded ? undefined : 'var(--bg-card)',
                                    boxShadow: isExpanded ? theme.shadow : '0 4px 12px rgba(0, 0, 0, 0.03)'
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    {/* PREMIUM ICON CONTAINER */}
                                    <div 
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-500 
                                            ${isExpanded ? 'scale-110' : 'scale-100'}
                                        `}
                                        style={{ 
                                            background: isExpanded ? 'rgba(255,255,255,0.05)' : 'var(--bg-card-hover)',
                                            borderColor: isExpanded ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                                            boxShadow: isExpanded ? theme.iconGlow : 'none',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                    >
                                        <Icon className={`w-5 h-5 transition-all duration-500 ${isExpanded ? theme.text : 'opacity-70 group-hover:opacity-100'}`} style={{ color: isExpanded ? undefined : 'var(--text-secondary)' }} />
                                    </div>

                                    <div className="flex flex-col items-start">
                                        <span className={`text-[13px] font-bold tracking-tight transition-colors ${isExpanded ? theme.text : ''}`}
                                            style={isExpanded ? {} : { color: 'var(--text-primary)' }}>
                                            {category.category}
                                        </span>
                                        <span className="text-[10px] font-medium opacity-50 uppercase tracking-widest">{category.situations.length} guides</span>
                                    </div>
                                </div>
                                <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                                    <ChevronDown className={`w-4 h-4 ${isExpanded ? theme.text : 'opacity-40'}`} style={{ color: isExpanded ? undefined : 'var(--text-secondary)' }} />
                                </div>
                            </button>

                            {/* Sub-items */}
                            {isExpanded && (
                                <div className="relative ml-5 pl-7 mt-3 mb-5 space-y-3 animate-in slide-in-from-top-2 duration-500">
                                    <div className={`absolute left-0 top-0 bottom-4 w-px border-l border-dashed ${theme.line}`}></div>

                                    {category.situations.map((situation, sitIdx) => {
                                        const isActive = selectedPrompt === situation.prompt;
                                        const isLast = sitIdx === category.situations.length - 1;

                                        return (
                                            <div key={sitIdx} className="relative w-full group/item">
                                                {/* Connection lines */}
                                                <div className={`absolute left-[-28px] top-[18px] w-[28px] border-t border-dashed ${theme.line}`}></div>

                                                <button
                                                    onClick={() => handlePromptClick(situation.prompt)}
                                                    className={`w-full text-left p-3 pr-10 rounded-xl transition-all duration-300 flex items-center gap-3 relative overflow-hidden group
                                                        ${isActive
                                                            ? `${theme.bgActive} border border-transparent ring-1 ring-inset ring-white/10`
                                                            : `border border-transparent hover:bg-white/5`
                                                        }
                                                    `}
                                                    style={{
                                                        background: isActive ? undefined : 'transparent'
                                                    }}
                                                >
                                                    {isActive && (
                                                        <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-20 pointer-events-none`}></div>
                                                    )}

                                                    <div className="flex-1 z-10 py-0.5">
                                                        <div className={`text-[12px] leading-snug font-semibold transition-colors ${isActive ? theme.text : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-200'}`}
                                                            style={isActive ? {} : { color: 'var(--text-secondary)' }}>
                                                            {situation.title}
                                                        </div>
                                                    </div>

                                                    <div className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                                                        <div className={`p-1.5 rounded-full ${theme.sendBtn} text-white shadow-lg`}>
                                                            <Zap className="w-3 h-3 fill-current" />
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
