import { useState, useEffect } from 'react';
import { Bot, MessageSquare, Mic, Video, Edit2, X, Check } from 'lucide-react';
import AIChat from './AIChat';
import EmergencyTips from './EmergencyTips';
import { authAPI } from '../../api/axios';

type TabType = 'text' | 'voice' | 'video';

export default function AICompanionTabs() {
    const [activeTab, setActiveTab] = useState<TabType>('text');
    const [companionName, setCompanionName] = useState('AI Companion');
    const [userName, setUserName] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');
    const [loading, setLoading] = useState(true);
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);

    useEffect(() => { fetchUserProfile(); }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await authAPI.getProfile();
            const aiName = response.data.ai_companion_name || 'AI Companion';
            const firstName = response.data.first_name || 'Friend';
            setCompanionName(aiName);
            setTempName(aiName);
            setUserName(firstName);
        } catch { /* silent */ } finally { setLoading(false); }
    };

    const handleSaveName = async () => {
        if (!tempName.trim()) { setTempName(companionName); setIsEditingName(false); return; }
        try {
            await authAPI.updateProfile({ ai_companion_name: tempName.trim() });
            setCompanionName(tempName.trim());
            setIsEditingName(false);
        } catch { setTempName(companionName); setIsEditingName(false); }
    };

    const handleCancelEdit = () => { setTempName(companionName); setIsEditingName(false); };
    const handlePromptSelect = (prompt: string) => { setActiveTab('text'); setPendingMessage(prompt); };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: 'var(--bg-main, transparent)' }}>
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div
            className="page-fullscreen ai-page"
            style={{
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box'
            }}
        >
            {/* Ambient background orbs */}
            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.22), transparent 60%)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(236,72,153,0.18), transparent 60%)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />

            {/* ═══════════════════════════════════
                HEADER BANNER  (flex-shrink: 0)
            ═══════════════════════════════════ */}
            <div
                style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    padding: '18px 24px',
                    borderRadius: '24px',
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    zIndex: 10,
                    marginBottom: '16px'
                }}
            >
                {/* Banner inner glow */}
                <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(124,58,237,0.4), transparent 60%)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }} />

                {/* Left: Avatar + Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                    {/* Glowing avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ position: 'absolute', inset: '-6px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(236,72,153,0.4))', filter: 'blur(10px)', zIndex: 0 }} />
                        <div style={{ position: 'relative', zIndex: 1, width: '64px', height: '64px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(124,58,237,0.7), rgba(236,72,153,0.5))', border: '1px solid rgba(168,85,247,0.5)', boxShadow: '0 0 25px rgba(124,58,237,0.6)' }}>
                            <Bot style={{ width: '32px', height: '32px', color: 'white' }} />
                        </div>
                        <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '14px', height: '14px', background: '#22c55e', borderRadius: '50%', border: '2px solid var(--bg-card)', boxShadow: '0 0 10px rgba(34,197,94,0.8)' }} />
                    </div>

                    {/* Name + Status */}
                    <div>
                        {isEditingName ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="text" value={tempName}
                                    onChange={e => setTempName(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSaveName()}
                                    style={{ padding: '8px 14px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', background: 'var(--bg-card-hover)', border: '1px solid rgba(124,58,237,0.5)', outline: 'none' }}
                                    placeholder="Name..." maxLength={30} autoFocus
                                />
                                <button onClick={handleSaveName} style={{ padding: '8px', background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '10px', color: '#4ade80', cursor: 'pointer' }}><Check style={{ width: '16px', height: '16px' }} /></button>
                                <button onClick={handleCancelEdit} style={{ padding: '8px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '10px', color: '#f87171', cursor: 'pointer' }}><X style={{ width: '16px', height: '16px' }} /></button>
                            </div>
                        ) : (
                            <div className="group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h1 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em', textShadow: '0 0 30px rgba(168,85,247,0.3)' }}>{companionName}</h1>
                                <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ padding: '4px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer' }} title="Rename">
                                    <Edit2 style={{ width: '14px', height: '14px', color: '#a78bfa' }} />
                                </button>
                            </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Your AI Wellness Companion</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, color: '#4ade80' }}>
                                <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px rgba(74,222,128,0.8)' }}></span>
                                Online
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Mode chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    <button
                        onClick={() => setActiveTab('text')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 18px', borderRadius: '14px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                            background: activeTab === 'text' ? 'linear-gradient(135deg, #7c3aed, #db2777)' : 'var(--bg-card-hover)',
                            border: activeTab === 'text' ? '1px solid rgba(168,85,247,0.5)' : '1px solid var(--border-color)',
                            color: activeTab === 'text' ? 'white' : 'var(--text-secondary)',
                            boxShadow: activeTab === 'text' ? '0 4px 20px rgba(124,58,237,0.5)' : 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        <MessageSquare style={{ width: '16px', height: '16px' }} /> Chat
                    </button>
                    <button disabled style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '14px', fontWeight: 700, fontSize: '14px', cursor: 'not-allowed', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', opacity: 0.6 }}>
                        <Mic style={{ width: '16px', height: '16px' }} /> Voice
                        <span style={{ fontSize: '10px', background: 'linear-gradient(to right, #f97316, #f59e0b)', color: 'white', padding: '2px 6px', borderRadius: '20px', fontWeight: 800, marginLeft: '4px' }}>SOON</span>
                    </button>
                    <button disabled style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '14px', fontWeight: 700, fontSize: '14px', cursor: 'not-allowed', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', opacity: 0.6 }}>
                        <Video style={{ width: '16px', height: '16px' }} /> Video
                        <span style={{ fontSize: '10px', background: 'linear-gradient(to right, #f97316, #f59e0b)', color: 'white', padding: '2px 6px', borderRadius: '20px', fontWeight: 800, marginLeft: '4px' }}>SOON</span>
                    </button>
                </div>
            </div>

            {/* ═══════════════════════════════════
                 BODY: Two-Column (fills rest)
            ═══════════════════════════════════ */}
            <div className="ai-body">
                {/* LEFT — Quick Topics */}
                <div
                    className="ai-topics"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                        position: 'relative',
                    }}
                >
                    <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(124,58,237,0.25), transparent 60%)', borderRadius: '50%', filter: 'blur(25px)', pointerEvents: 'none' }} />
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', position: 'relative', zIndex: 1 }} className="custom-scrollbar">
                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(168,85,247,0.9)', margin: '0 0 5px 0' }}>Quick Topics</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>Select a topic to begin chatting</p>
                        </div>
                        <EmergencyTips onPromptSelect={handlePromptSelect} />
                    </div>
                </div>

                {/* RIGHT — Chat */}
                <div
                    className="ai-chat-panel"
                    style={{
                        borderRadius: '24px',
                        overflow: 'hidden',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                        position: 'relative',
                    }}
                >
                    <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(236,72,153,0.1), transparent 60%)', borderRadius: '50%', filter: 'blur(35px)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {activeTab === 'text' && (
                            <AIChat
                                pendingMessage={pendingMessage}
                                onMessageSent={() => setPendingMessage(null)}
                                userName={userName}
                                aiName={companionName}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
