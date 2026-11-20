import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Users, PlusCircle, MessageCircle, BookOpen, Shield, User } from 'lucide-react';
import { authAPI } from '../../api/axios';
import { useLanguage } from '../../contexts/LanguageContext';
import logo from '../../assets/logo_serene_path.svg';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);
    const { t } = useLanguage();

    // Nav items built dynamically so labels update when language changes
    const navItems = [
        { path: '/',          label: t('nav.home'),      icon: <Home className="w-6 h-6" /> },
        { path: '/tasks',     label: t('nav.tasks'),     icon: <CheckSquare className="w-6 h-6" /> },
        { path: '/community', label: t('nav.community'), icon: <Users className="w-6 h-6" /> },
        { path: '/create',    label: t('nav.create'),    icon: <PlusCircle className="w-6 h-6" /> },
        { path: '/ai',        label: t('nav.ai'),        icon: <MessageCircle className="w-6 h-6" /> },
        { path: '/resources', label: t('nav.resources'), icon: <BookOpen className="w-6 h-6" /> },
        { path: '/safety',    label: t('nav.safety'),    icon: <Shield className="w-6 h-6" /> },
    ];

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await authAPI.getProfile();
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="sidebar">
            {/* Header */}
            <div className="sidebar-header" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <img src={logo} alt="Pathway Logo" className="w-10 h-10" />
                <h2>Pathway</h2>
            </div>

            {/* Navigation */}
            <div className="sidebar-nav">
                {navItems.map((item) => (
                    <div
                        key={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <div className="nav-icon">{item.icon}</div>
                        <span className="nav-text">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Footer — User Info */}
            <div className="sidebar-footer">
                <div className="user-info" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                    <div className="user-avatar">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>
                            {user ? `${user.first_name} ${user.last_name}` : 'User'}
                        </div>
                        <div style={{ fontSize: '0.85em', opacity: 0.8 }}>{t('nav.profile')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
