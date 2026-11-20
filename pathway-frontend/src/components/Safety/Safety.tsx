import { useState, useEffect } from 'react';
import {
    Phone, Shield, AlertTriangle, FileText,
    Check, Download, MapPin, Monitor, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { safetyAPI } from '../../api/axios';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Helpline {
    id: number;
    name: string;
    number: string;
    icon: string;
    description: string;
}

interface LegalInfo {
    id: number;
    title: string;
    section_code: string;
    description: string;
    category: string;
}

interface SafetyTip {
    id: number;
    title: string;
    content: string;
    category: string;
}

// ─── Static fallback data ─────────────────────────────────────────────────────

const FALLBACK_HELPLINES: Helpline[] = [
    { id: 1, name: 'Women Helpline', number: '181', icon: '🚨', description: '24/7 Women support' },
    { id: 2, name: 'Childline (Under 18)', number: '1098', icon: '👶', description: 'For minors in distress' },
    { id: 3, name: 'Police Emergency', number: '100', icon: '🚔', description: 'Immediate police help' },
    { id: 4, name: 'Cyber Crime Helpline', number: '1930', icon: '💻', description: 'Report online crimes' },
];

const FALLBACK_LEGAL: LegalInfo[] = [
    { id: 1, section_code: 'Section 354 IPC', title: 'Sexual Harassment', description: 'Criminal force to outrage modesty, sexual advances, demands for sexual favors, or showing pornography.', category: 'harassment' },
    { id: 2, section_code: 'Section 354A IPC', title: 'Workplace Sexual Harassment', description: 'Physical contact, demand for sexual favors, sexual remarks or unwelcome sexual behavior at workplace/school.', category: 'harassment' },
    { id: 3, section_code: 'Section 67 IT Act', title: 'Cyber Blackmail & Revenge Porn', description: 'Publishing or transmitting obscene material electronically, sharing intimate photos/videos without consent.', category: 'cyber_crime' },
    { id: 4, section_code: 'POCSO Act 2012', title: 'Protection of Children from Sexual Offences', description: 'ANY sexual act with a person under 18 years — assault, harassment, pornography, or showing sexual content to minors.', category: 'child_protection' },
];

const RED_FLAGS = [
    { key: 'teacher', icon: '👨‍🏫', title: 'Teacher / Boss', subtitle: 'Meeting alone unnecessarily', accent: 'tm-accent-rose', advice: { heading: 'Teacher/Boss Asking to Meet Alone', tips: ['Tell a trusted friend, parent, or counselor immediately', 'NEVER meet alone — always take a friend or colleague', 'Suggest meeting in a public, visible area (lobby, cafeteria)', 'Record conversations secretly if safe to do so', 'Document each request with date, time, and what was said', 'If they insist on privacy, refuse politely — that\'s a major red flag'] } },
    { key: 'photos', icon: '📸', title: 'Personal Photos', subtitle: 'Asking for images / videos', accent: 'tm-accent-amber', advice: { heading: 'Someone Asking for Personal Photos', tips: ['NEVER send personal photos or videos, no matter what reason they give', 'Screenshot their request immediately as evidence', 'Block the person on all platforms immediately', 'Tell your parents, a trusted teacher, or counselor', 'Report to cybercrime.gov.in if they persist or threaten you'] } },
    { key: 'secret', icon: '🤫', title: 'Keep It Secret', subtitle: '"Don\'t tell anyone"', accent: 'tm-accent-purple', advice: { heading: '"This is Our Secret, Don\'t Tell Anyone"', tips: ['This is a MAJOR WARNING SIGN — predators always say this', 'DO THE OPPOSITE — tell someone you trust immediately', 'Record this conversation if safe to do so', 'The fact they want secrecy proves they know it\'s wrong', 'You have EVERY RIGHT to tell others — it\'s for your safety'] } },
    { key: 'touching', icon: '🚫', title: 'Uncomfortable Touch', subtitle: 'Sexual comments or contact', accent: 'tm-accent-teal', advice: { heading: 'Uncomfortable Touching or Sexual Comments', tips: ['Say "NO" firmly and loudly — make your discomfort clear', 'Document every incident with date, time, witnesses', 'Tell HR / principal / trusted authority immediately', 'This is sexual harassment — it\'s a CRIME under Section 354 IPC', 'You have the legal right to file a police complaint'] } },
    { key: 'gifts', icon: '🎁', title: 'Gifts With Strings', subtitle: 'Favors expected in return', accent: 'tm-accent-indigo', advice: { heading: 'Gifts With Strings Attached / Favors Expected', tips: ['REFUSE all gifts from this person politely but firmly', 'If already accepted, return the gift immediately', 'They\'re creating "obligation" to manipulate you later', 'Document the gift-giving pattern with dates', 'This is grooming behavior — a classic predator tactic'] } },
    { key: 'threats', icon: '⚡', title: 'Threats', subtitle: 'If you don\'t comply', accent: 'tm-accent-rose', advice: { heading: 'Threats of Consequences if You Don\'t Comply', tips: ['This is BLACKMAIL — a serious criminal offense', 'DO NOT comply with their demands under any circumstances', 'Screenshot / record EVERY threat immediately', 'File a police complaint IMMEDIATELY with all evidence', 'Contact emergency helpline 181 (Women) or 1098 (Under 18)'] } },
];

const DO_LIST = [
    'DO NOT give money, photos, or meet the person',
    'SCREENSHOT all messages, emails, and threats',
    'BLOCK the person on all platforms immediately',
    'TELL someone you trust right now',
    'REPORT to cybercrime.gov.in',
    'FILE FIR at nearest police station',
];

const DONT_LIST = [
    'DON\'T send money or more photos/videos',
    'DON\'T delete any evidence or messages',
    'DON\'T meet the person in private',
    'DON\'T keep it secret from everyone',
    'DON\'T believe "I\'ll delete it if you…"',
    'DON\'T feel ashamed — YOU are the victim',
];

const FIR_STEPS = [
    { num: '1', icon: '📂', title: 'Collect Evidence', desc: 'Screenshots, messages, call logs, emails' },
    { num: '2', icon: '🏛️', title: 'Go to Police', desc: 'Any police station or file online' },
    { num: '3', icon: '✍️', title: 'Written Complaint', desc: 'Use our template or write your own' },
    { num: '4', icon: '📋', title: 'Get FIR Copy', desc: 'Police MUST give you a copy' },
    { num: '5', icon: '🔍', title: 'Follow Up', desc: 'Note case number and officer name' },
];

const PUNISHMENT_MAP: Record<string, string> = {
    'Section 354 IPC': 'Up to 2 years jail + fine',
    'Section 354A IPC': 'Up to 3 years jail + fine',
    'Section 67 IT Act': 'Up to 3 years jail + ₹5 lakh fine',
    'POCSO Act 2012': 'Up to LIFE IMPRISONMENT',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Safety() {
    const [activeFlag, setActiveFlag] = useState<string | null>(null);
    const [helplines, setHelplines] = useState<Helpline[]>(FALLBACK_HELPLINES);
    const [legalInfo, setLegalInfo] = useState<LegalInfo[]>(FALLBACK_LEGAL);
    const [_tips, setTips] = useState<SafetyTip[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedLaw, setExpandedLaw] = useState<number | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [contactsRes, legalRes, tipsRes] = await Promise.allSettled([
                    safetyAPI.getContacts(),
                    safetyAPI.getLegalInfo(),
                    safetyAPI.getTips(),
                ]);
                if (contactsRes.status === 'fulfilled' && contactsRes.value.data?.length) {
                    setHelplines(contactsRes.value.data);
                }
                if (legalRes.status === 'fulfilled' && legalRes.value.data?.length) {
                    setLegalInfo(legalRes.value.data);
                }
                if (tipsRes.status === 'fulfilled' && tipsRes.value.data?.length) {
                    setTips(tipsRes.value.data);
                }
            } catch (_) {
                // fallback data already set
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const callHelpline = (number: string, name: string) => {
        if (window.confirm(`Call ${name} at ${number}?\n\nThis helpline is available 24/7.`)) {
            window.location.href = `tel:${number}`;
        }
    };

    const handleFlagClick = (key: string) => {
        setActiveFlag(prev => (prev === key ? null : key));
        setTimeout(() => {
            document.getElementById(`advice-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    };

    const activeFlagData = RED_FLAGS.find(f => f.key === activeFlag);

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="hg-root">
            {/* Background orbs */}
            <div className="hg-orb hg-orb-1" />
            <div className="hg-orb hg-orb-2" />
            <div className="hg-orb hg-orb-3" />

            <div className="tm-layout">
                {/* ══════════ MAIN COLUMN ══════════ */}
                <div className="tm-main">

                    {/* Header */}
                    <div className="tm-header-card" style={{ marginBottom: '2rem' }}>
                        <div className="tm-header-left">
                            <p className="tm-header-eyebrow">🛡️ Guided Protection</p>
                            <h1 className="tm-header-title">Your Safety Journey</h1>
                            <p className="tm-header-sub">
                                Follow this 5-step path to recognize danger and take action immediately.
                            </p>
                        </div>
                        <div className="tm-header-right">
                            <div className="tm-pct-badge" style={{ padding: '1.5rem' }}>
                                <Shield size={48} className="tm-icon-purple"
                                    style={{ filter: 'drop-shadow(0 0 12px rgba(124,58,237,0.6))' }} />
                            </div>
                        </div>
                    </div>

                    {/* ── STEP 1: Recognize Danger ── */}
                    <div className="sf-step-card">
                        <div className="sf-step-badge sf-badge-rose">Step 1</div>
                        <div className="sf-step-heading">
                            <span className="sf-step-icon">🚩</span>
                            <h2>Recognize the Danger</h2>
                        </div>
                        <p className="sf-step-desc">
                            Click on any warning sign you're experiencing to see what you should do:
                        </p>

                        {/* Red flag grid */}
                        <div className="sf-flags-grid">
                            {RED_FLAGS.map(flag => (
                                <button
                                    key={flag.key}
                                    id={`flag-${flag.key}`}
                                    className={`sf-flag-card ${activeFlag === flag.key ? 'sf-flag-active' : ''}`}
                                    onClick={() => handleFlagClick(flag.key)}
                                >
                                    <div className={`tm-card-stripe ${flag.accent}`} />
                                    <div className="sf-flag-emoji">{flag.icon}</div>
                                    <div className="sf-flag-title">{flag.title}</div>
                                    <div className="sf-flag-sub">{flag.subtitle}</div>
                                </button>
                            ))}
                        </div>

                        {/* Advice panel */}
                        {activeFlag && activeFlagData && (
                            <div id={`advice-${activeFlag}`} className="sf-advice-panel">
                                <div className="sf-advice-header">
                                    <span style={{ fontSize: '1.6rem' }}>{activeFlagData.icon}</span>
                                    <span className="sf-advice-title">{activeFlagData.advice.heading}</span>
                                </div>
                                <ul className="sf-advice-list">
                                    {activeFlagData.advice.tips.map((tip, i) => (
                                        <li key={i}>
                                            <Check size={14} className="tm-icon-teal" style={{ flexShrink: 0, marginTop: 2 }} />
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="sf-btn-row">
                            <button className="sf-btn-primary" onClick={() => window.open('https://cybercrime.gov.in', '_blank')}>
                                <ExternalLink size={16} /> Report Cybercrime
                            </button>
                        </div>
                    </div>

                    {/* ── STEP 2: Immediate Action ── */}
                    <div className="sf-step-card">
                        <div className="sf-step-badge sf-badge-amber">Step 2</div>
                        <div className="sf-step-heading">
                            <span className="sf-step-icon">🚨</span>
                            <h2>Immediate Action (If Threatened)</h2>
                        </div>
                        <p className="sf-step-desc">If someone is threatening or blackmailing you RIGHT NOW:</p>

                        <div className="sf-do-dont-grid">
                            <div className="sf-do-card">
                                <div className="sf-do-header">
                                    <Check size={16} />
                                    <span>DO THIS</span>
                                </div>
                                <ul className="sf-action-list">
                                    {DO_LIST.map((item, i) => (
                                        <li key={i}>
                                            <Check size={13} className="tm-icon-teal" style={{ flexShrink: 0, marginTop: 2 }} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="sf-dont-card">
                                <div className="sf-dont-header">
                                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>✗</span>
                                    <span>DON'T DO THIS</span>
                                </div>
                                <ul className="sf-action-list">
                                    {DONT_LIST.map((item, i) => (
                                        <li key={i}>
                                            <span style={{ color: '#f87171', fontWeight: 800, flexShrink: 0 }}>✗</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="sf-btn-row">
                            <button className="sf-btn-primary"
                                onClick={() => alert('FIR Template PDF downloading…\n\nIn the full app this would download a pre-filled template.')}>
                                <Download size={16} /> Download FIR Template
                            </button>
                        </div>
                    </div>

                    {/* ── STEP 3: Get Emergency Help (mobile-visible helplines) ── */}
                    <div className="sf-step-card sf-helpline-mobile">
                        <div className="sf-step-badge sf-badge-pink">Step 3</div>
                        <div className="sf-step-heading">
                            <span className="sf-step-icon">📞</span>
                            <h2>Get Emergency Help</h2>
                        </div>
                        <p className="sf-step-desc">These helplines are available 24/7. One tap to call:</p>

                        <div className="sf-helpline-grid">
                            {loading
                                ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="sf-helpline-skeleton" />)
                                : helplines.map(h => (
                                    <button key={h.id} className="sf-helpline-card"
                                        onClick={() => callHelpline(h.number, h.name)}>
                                        <div className="sf-helpline-icon">{h.icon || '📞'}</div>
                                        <div className="sf-helpline-name">{h.name}</div>
                                        <div className="sf-helpline-number">{h.number}</div>
                                        <div className="sf-call-btn">
                                            <Phone size={14} /> CALL NOW
                                        </div>
                                    </button>
                                ))
                            }
                        </div>
                    </div>

                    {/* ── STEP 4: Know Your Rights ── */}
                    <div className="sf-step-card">
                        <div className="sf-step-badge sf-badge-indigo">Step 4</div>
                        <div className="sf-step-heading">
                            <span className="sf-step-icon">📜</span>
                            <h2>Know Your Legal Rights</h2>
                        </div>
                        <p className="sf-step-desc">Indian laws that protect you — THEY can go to jail for this:</p>

                        <div className="sf-legal-grid">
                            {legalInfo.map(law => (
                                <div key={law.id}
                                    className={`sf-law-card ${expandedLaw === law.id ? 'sf-law-active' : ''}`}
                                    onClick={() => setExpandedLaw(prev => prev === law.id ? null : law.id)}>
                                    <div className="sf-law-header">
                                        <div>
                                            <div className="sf-law-code">{law.section_code}</div>
                                            <div className="sf-law-title">{law.title}</div>
                                        </div>
                                        {expandedLaw === law.id
                                            ? <ChevronUp size={16} style={{ color: '#a78bfa', flexShrink: 0 }} />
                                            : <ChevronDown size={16} style={{ color: '#64748b', flexShrink: 0 }} />
                                        }
                                    </div>
                                    {expandedLaw === law.id && (
                                        <div className="sf-law-body">
                                            <p className="sf-law-desc">{law.description}</p>
                                            <div className="sf-law-punishment">
                                                ⚖️ {PUNISHMENT_MAP[law.section_code] ?? 'Significant imprisonment + fine'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="sf-btn-row">
                            <button className="sf-btn-secondary"
                                onClick={() => alert('Legal aid resources coming soon.')}>
                                <Shield size={16} /> Find Free Legal Help
                            </button>
                        </div>
                    </div>

                    {/* ── STEP 5: File FIR ── */}
                    <div className="sf-step-card">
                        <div className="sf-step-badge sf-badge-teal">Step 5</div>
                        <div className="sf-step-heading">
                            <span className="sf-step-icon">📋</span>
                            <h2>How to File FIR (Police Complaint)</h2>
                        </div>
                        <p className="sf-step-desc">Follow these 5 simple steps to file your complaint:</p>

                        <div className="sf-fir-steps">
                            {FIR_STEPS.map((step, i) => (
                                <div key={i} className="sf-fir-step">
                                    <div className="sf-fir-num">{step.icon}</div>
                                    <div className="sf-fir-title">{step.title}</div>
                                    <div className="sf-fir-desc">{step.desc}</div>
                                </div>
                            ))}
                        </div>

                        <div className="sf-btn-row">
                            <button className="sf-btn-primary"
                                onClick={() => alert('Downloading FIR template…')}>
                                <Download size={16} /> Download FIR Template
                            </button>
                            <button className="sf-btn-secondary"
                                onClick={() => alert('Finding nearest police stations…')}>
                                <MapPin size={16} /> Find Police Station
                            </button>
                        </div>
                    </div>

                </div>{/* end tm-main */}

                {/* ══════════ SIDEBAR ══════════ */}
                <div className="tm-sidebar">

                    {/* Emergency Helplines */}
                    <div className="tm-side-card">
                        <div className="hg-card-glow hg-glow-pink" />
                        <div className="tm-side-header">
                            <Phone size={18} className="tm-icon-pink" />
                            <span className="tm-side-title">Emergency Helplines</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                            {loading
                                ? Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} style={{ height: 52, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }} />
                                ))
                                : helplines.map(h => (
                                    <div key={h.id}
                                        onClick={() => callHelpline(h.number, h.name)}
                                        className="sf-helpline-row">
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <span style={{ fontSize: '1.2rem' }}>{h.icon || '📞'}</span>
                                            <div>
                                                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary, #e2e8f0)' }}>{h.name}</div>
                                                <div style={{ fontSize: '0.78rem', color: '#f472b6', fontWeight: 700 }}>{h.number}</div>
                                            </div>
                                        </div>
                                        <Phone size={14} className="tm-icon-pink" />
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* Quick Resources */}
                    <div className="tm-side-card">
                        <div className="hg-card-glow hg-glow-teal" />
                        <div className="tm-side-header">
                            <FileText size={18} className="tm-icon-teal" />
                            <span className="tm-side-title">Quick Resources</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: '1rem' }}>
                            <button onClick={() => alert('Downloading FIR Template…')} className="tm-powerup" style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', appearance: 'none' }}>
                                <Download size={16} className="tm-icon-indigo" style={{ marginRight: 8 }} />
                                <span className="tm-powerup-label">Download FIR Template</span>
                            </button>
                            <button onClick={() => window.open('https://cybercrime.gov.in', '_blank')} className="tm-powerup" style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', appearance: 'none' }}>
                                <Monitor size={16} className="tm-icon-cyan" style={{ marginRight: 8 }} />
                                <span className="tm-powerup-label">Report Cybercrime</span>
                            </button>
                            <button onClick={() => alert('Finding nearest police stations…')} className="tm-powerup" style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', appearance: 'none' }}>
                                <MapPin size={16} className="tm-icon-teal" style={{ marginRight: 8 }} />
                                <span className="tm-powerup-label">Find Police Station</span>
                            </button>
                        </div>
                    </div>

                    {/* Know Your Rights */}
                    <div className="tm-side-card">
                        <div className="hg-card-glow hg-glow-purple" />
                        <div className="tm-side-header">
                            <Shield size={18} className="tm-icon-purple" />
                            <span className="tm-side-title">Know Your Rights</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                            {legalInfo.map(r => (
                                <div key={r.id} style={{ padding: '0.7rem', borderLeft: '3px solid #7c3aed', background: 'rgba(124,58,237,0.07)', borderRadius: '0 10px 10px 0' }}>
                                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#c084fc', marginBottom: 2 }}>{r.section_code}</div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary, #e2e8f0)', marginBottom: 2 }}>{r.title}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 600 }}>
                                        ⚖️ {PUNISHMENT_MAP[r.section_code] ?? 'Imprisonment + fine'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Am I Safe? */}
                    <div className="tm-side-card" style={{ textAlign: 'center' }}>
                        <div className="hg-card-glow hg-glow-pink" />
                        <AlertTriangle size={28} className="tm-icon-rose" style={{ margin: '0 auto 0.5rem' }} />
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary, #e2e8f0)', marginBottom: '0.4rem' }}>
                            Am I the Only One?
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                            Connect anonymously with others who've faced similar situations.
                        </div>
                        <button className="sf-btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                            onClick={() => alert('Anonymous community connection coming soon.')}>
                            🤝 Connect Anonymously
                        </button>
                    </div>

                </div>{/* end tm-sidebar */}
            </div>{/* end tm-layout */}
        </div>
    );
}
