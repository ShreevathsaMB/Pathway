import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { User, Mail, Settings, Globe, Bot, Calendar, Award, LogOut } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const langMap: Record<string, string> = {
    en: 'English',
    te: 'తెలుగు (Telugu)',
    hi: 'हिन्दी (Hindi)',
    ta: 'தமிழ் (Tamil)',
    kn: 'ಕನ್ನಡ (Kannada)',
    ml: 'മലയാളം (Malayalam)',
};

export default function Profile() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/users/profile/');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="pf-root" style={{ paddingTop: '60px', alignItems: 'center' }}>
                <div style={{
                    width: '48px', height: '48px',
                    border: '3px solid rgba(124,58,237,0.3)',
                    borderTop: '3px solid #7c3aed',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('common.loading_pathway')}</p>
            </div>
        );
    }

    return (
        <div className="pf-root">

            {/* ── HERO / HEADER ── */}
            <div className="pf-hero">
                <div className="pf-hero-banner" />
                <div style={{ position: 'relative' }}>
                    <div className="pf-avatar-wrap" style={{ margin: '0 auto' }}>
                        {user?.profile_picture ? (
                            <img src={user.profile_picture} alt="Profile" className="pf-avatar-img" />
                        ) : (
                            <User className="pf-avatar-icon w-10 h-10" />
                        )}
                    </div>
                    <h2 className="pf-name">{user?.first_name} {user?.last_name}</h2>
                    <p className="pf-username">@{user?.username}</p>
                    <div className="pf-badge">
                        <Award className="w-3 h-3" />
                        {t('profile.wellness_champion')}
                    </div>
                </div>
            </div>

            {/* ── STATS ── */}
            <div className="pf-stats">
                <div className="pf-stat-card pf-stat-card--orange">
                    <p className="pf-stat-val">{user?.current_streak ?? 0}</p>
                    <p className="pf-stat-label">{t('profile.current_streak')}</p>
                </div>
                <div className="pf-stat-card pf-stat-card--purple">
                    <p className="pf-stat-val">{user?.longest_streak ?? 0}</p>
                    <p className="pf-stat-label">{t('profile.peak_streak')}</p>
                </div>
            </div>

            {/* ── INFO CARD ── */}
            <div className="pf-info-card">
                <h3 className="pf-section-title">
                    <Settings className="pf-section-icon w-4 h-4" />
                    {t('profile.general_info')}
                </h3>

                <div className="pf-info-grid">
                    {/* Email */}
                    <div className="pf-info-row">
                        <div className="pf-info-icon-wrap pf-info-icon-wrap--blue">
                            <Mail className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="pf-info-label">{t('profile.email')}</p>
                            <p className="pf-info-value">{user?.email}</p>
                        </div>
                    </div>

                    {/* Language */}
                    <div className="pf-info-row">
                        <div className="pf-info-icon-wrap pf-info-icon-wrap--purple">
                            <Globe className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="pf-info-label">{t('profile.preferred_language')}</p>
                            <p className="pf-info-value">{langMap[user?.language_preference] ?? 'English'}</p>
                        </div>
                    </div>

                    {/* AI Companion */}
                    <div className="pf-info-row">
                        <div className="pf-info-icon-wrap pf-info-icon-wrap--pink">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="pf-info-label">{t('profile.ai_companion')}</p>
                            <p className="pf-info-value">{user?.ai_companion_name}</p>
                        </div>
                    </div>

                    {/* Member Since */}
                    <div className="pf-info-row">
                        <div className="pf-info-icon-wrap pf-info-icon-wrap--orange">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="pf-info-label">{t('profile.member_since')}</p>
                            <p className="pf-info-value">
                                {user?.date_joined
                                    ? new Date(user.date_joined).toLocaleDateString()
                                    : '—'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Focus Areas */}
                {user?.issues && user.issues.length > 0 && (
                    <div>
                        <p className="pf-focus-label">{t('profile.focus_areas')}</p>
                        <div className="pf-tags">
                            {user.issues.map((issue: string) => (
                                <span key={issue} className="pf-tag">
                                    {issue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── PRIVACY NOTICE ── */}
            <div className="pf-privacy">
                <h4 className="pf-privacy-title">{t('profile.privacy_title')}</h4>
                <p className="pf-privacy-desc">{t('profile.privacy_desc')}</p>
            </div>

            {/* ── ACTION BUTTONS ── */}
            <button className="pf-btn-edit">
                {t('profile.edit_profile')}
            </button>

            <button className="pf-btn-logout" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                {t('profile.logout')}
            </button>

        </div>
    );
}
