import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_serene_path.svg';
import { useTheme } from '../../contexts/ThemeContext';
import { authAPI } from '../../api/axios';

interface LandingPageProps {
    onGuestLogin?: () => void;
}

const features = [
    {
        icon: '🤝',
        title: 'AI Companion',
        description: 'Your personal AI companion, available 24/7 to guide you through life\'s challenges with empathy and wisdom.',
        gradient: 'from-purple-500 to-pink-500',
        bg: 'bg-purple-50',
    },
    {
        icon: '🌿',
        title: 'Community Support',
        description: 'Connect with a compassionate community of people who understand your journey and offer real support.',
        gradient: 'from-teal-500 to-blue-500',
        bg: 'bg-teal-50',
    },
    {
        icon: '📋',
        title: 'Guided Tasks',
        description: 'Structured daily tasks and mindfulness exercises crafted to help you take meaningful steps forward.',
        gradient: 'from-indigo-500 to-purple-500',
        bg: 'bg-indigo-50',
    },
    {
        icon: '📚',
        title: 'Resources Hub',
        description: 'Access curated articles, guides, and tools on mental health, legal rights, and personal safety.',
        gradient: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50',
    },
    {
        icon: '🛡️',
        title: 'Safety First',
        description: 'Quick-access safety tools, emergency contacts, and crisis resources — always within reach.',
        gradient: 'from-rose-500 to-pink-500',
        bg: 'bg-rose-50',
    },
    {
        icon: '🌍',
        title: 'Multilingual',
        description: 'Available in English, Telugu, Hindi, Tamil, Kannada, and Malayalam — your language, your journey.',
        gradient: 'from-green-500 to-teal-500',
        bg: 'bg-green-50',
    },
];

const stats = [
    { value: '10K+', label: 'Lives Touched' },
    { value: '6', label: 'Languages Supported' },
    { value: '24/7', label: 'AI Support' },
    { value: '100%', label: 'Confidential' },
];

export default function LandingPage({ onGuestLogin }: LandingPageProps) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [guestLoading, setGuestLoading] = useState(false);
    const [guestError, setGuestError] = useState('');
    const { isDarkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();

    // Start a throwaway guest session: the backend creates a temporary account and
    // returns normal tokens, so every screen works without signing up.
    const handleGuestLogin = async () => {
        setGuestError('');
        setGuestLoading(true);
        try {
            const response = await authAPI.guestLogin();
            const { tokens } = response.data;
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);
            onGuestLogin?.();
            navigate('/');
        } catch {
            setGuestError('Could not start a guest session. Please try again.');
        } finally {
            setGuestLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="lp-root">
            {/* ── NAVBAR ── */}
            <nav className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
                <div className="lp-nav-inner">
                    <div className="lp-logo-group">
                        <img src={logo} alt="Pathway" className="lp-logo-img" />
                        <span className="lp-logo-text">Pathway</span>
                    </div>

                    <div className="lp-nav-links">
                        <a href="#features" className="lp-nav-link">Features</a>
                        <a href="#about" className="lp-nav-link">About</a>
                        <a href="#community" className="lp-nav-link">Community</a>
                    </div>

                    <div className="lp-nav-actions">
                        <button
                            className="lp-dark-toggle"
                            onClick={toggleDarkMode}
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            title={isDarkMode ? 'Light mode' : 'Dark mode'}
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                        <Link to="/login" className="lp-btn-ghost">Sign In</Link>
                        <Link to="/signup" className="lp-btn-primary">Get Started</Link>
                    </div>

                    <button className="lp-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                        <span className={`lp-ham-line ${menuOpen ? 'lp-ham-open' : ''}`}></span>
                        <span className={`lp-ham-line ${menuOpen ? 'lp-ham-open' : ''}`}></span>
                        <span className={`lp-ham-line ${menuOpen ? 'lp-ham-open' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`lp-mobile-menu ${menuOpen ? 'lp-mobile-menu--open' : ''}`}>
                    <a href="#features" className="lp-mobile-link" onClick={() => setMenuOpen(false)}>Features</a>
                    <a href="#about" className="lp-mobile-link" onClick={() => setMenuOpen(false)}>About</a>
                    <a href="#community" className="lp-mobile-link" onClick={() => setMenuOpen(false)}>Community</a>
                    <Link to="/login" className="lp-mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
                    <button className="lp-mobile-link lp-mobile-theme" onClick={toggleDarkMode}>
                        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                    <Link to="/signup" className="lp-btn-primary lp-mobile-cta" onClick={() => setMenuOpen(false)}>Get Started</Link>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="lp-hero">
                {/* Floating orbs */}
                <div className="lp-orb lp-orb-1"></div>
                <div className="lp-orb lp-orb-2"></div>
                <div className="lp-orb lp-orb-3"></div>
                <div className="lp-orb lp-orb-4"></div>

                <div className="lp-hero-content">
                    <div className="lp-hero-badge">
                        <span className="lp-badge-dot"></span>
                        Your journey to peace begins here
                    </div>

                    <h1 className="lp-hero-title">
                        Find Your{' '}
                        <span className="lp-gradient-text">Path to Peace</span>
                        <br />
                        & Wellness
                    </h1>

                    <p className="lp-hero-subtitle">
                        Pathway is a compassionate platform designed to support you through life's toughest
                        challenges — from family conflicts and relationship stress to mental health and safety.
                        You are not alone.
                    </p>

                    <div className="lp-hero-actions">
                        <Link to="/signup" className="lp-btn-hero-primary">
                            Start Your Journey
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link to="/login" className="lp-btn-hero-ghost">
                            I have an account
                        </Link>
                        <button
                            type="button"
                            className="lp-btn-hero-guest"
                            onClick={handleGuestLogin}
                            disabled={guestLoading}
                        >
                            {guestLoading ? 'Starting…' : 'Continue as guest'}
                        </button>
                        {guestError && <p className="lp-guest-error">{guestError}</p>}
                    </div>

                    {/* Stats row */}
                    <div className="lp-stats">
                        {stats.map((s) => (
                            <div key={s.label} className="lp-stat">
                                <span className="lp-stat-value">{s.value}</span>
                                <span className="lp-stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hero visual card */}
                <div className="lp-hero-visual">
                    <div className="lp-hero-card lp-hero-card--main">
                        <div className="lp-hc-avatar">
                            <span>🌟</span>
                        </div>
                        <div className="lp-hc-body">
                            <p className="lp-hc-name">AI Companion</p>
                            <p className="lp-hc-msg">"I'm here for you, always. Let's take this step together."</p>
                        </div>
                        <div className="lp-hc-indicator"></div>
                    </div>

                    <div className="lp-hero-card lp-hero-card--streak">
                        <span className="lp-streak-fire">🔥</span>
                        <div>
                            <p className="lp-streak-num">14</p>
                            <p className="lp-streak-lbl">Day Streak</p>
                        </div>
                    </div>

                    <div className="lp-hero-card lp-hero-card--mood">
                        <p className="lp-mood-title">Today's Check-in</p>
                        <div className="lp-mood-row">
                            {['😔', '😐', '🙂', '😊', '😄'].map((e, i) => (
                                <button key={i} className={`lp-mood-emoji ${i === 3 ? 'lp-mood-active' : ''}`}>{e}</button>
                            ))}
                        </div>
                    </div>

                    <div className="lp-hero-card lp-hero-card--task">
                        <div className="lp-task-check">✓</div>
                        <div>
                            <p className="lp-task-title">Morning Meditation</p>
                            <p className="lp-task-sub">Completed · 10 min</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ABOUT ── */}
            <section id="about" className="lp-about">
                <div className="lp-section-inner">
                    <div className="lp-about-text">
                        <p className="lp-section-eyebrow">What is Pathway?</p>
                        <h2 className="lp-section-title">A Safe Space for <span className="lp-gradient-text-2">Every Journey</span></h2>
                        <p className="lp-about-desc">
                            Pathway was built with one belief: <strong>every person deserves support</strong>, no matter what they're going through.
                            Whether you're dealing with family conflicts, career uncertainty, relationship issues, or simply
                            searching for peace — Pathway walks alongside you.
                        </p>
                        <p className="lp-about-desc">
                            Our AI companion listens without judgment, our community rallies around you, and our
                            resources empower you to take the next step — in your language, at your pace.
                        </p>
                        <div className="lp-about-values">
                            {['Confidential & Private', 'Non-judgmental', 'Community-driven', 'Always Available'].map(v => (
                                <span key={v} className="lp-value-chip">{v}</span>
                            ))}
                        </div>
                    </div>
                    <div className="lp-about-visual">
                        <div className="lp-about-ring lp-ring-outer"></div>
                        <div className="lp-about-ring lp-ring-middle"></div>
                        <div className="lp-about-ring lp-ring-inner"></div>
                        <div className="lp-about-center">
                            <img src={logo} alt="Pathway" className="lp-about-logo" />
                            <p>Pathway</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" className="lp-features">
                <div className="lp-section-inner lp-section-inner--col">
                    <div className="lp-section-header">
                        <p className="lp-section-eyebrow">Everything you need</p>
                        <h2 className="lp-section-title">Built for <span className="lp-gradient-text-3">Real Life</span></h2>
                        <p className="lp-section-subtitle">Every feature is thoughtfully designed to support you through life's challenges.</p>
                    </div>
                    <div className="lp-features-grid">
                        {features.map((f) => (
                            <div key={f.title} className={`lp-feature-card ${f.bg}`}>
                                <div className={`lp-feature-icon bg-gradient-to-br ${f.gradient}`}>
                                    <span>{f.icon}</span>
                                </div>
                                <h3 className="lp-feature-title">{f.title}</h3>
                                <p className="lp-feature-desc">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── COMMUNITY ── */}
            <section id="community" className="lp-community">
                <div className="lp-community-inner">
                    <div className="lp-community-orb lp-community-orb-1"></div>
                    <div className="lp-community-orb lp-community-orb-2"></div>
                    <p className="lp-section-eyebrow lp-eyebrow-light">Community</p>
                    <h2 className="lp-community-title">You Are Not Alone</h2>
                    <p className="lp-community-subtitle">
                        Thousands of people are walking this path alongside you — sharing stories,
                        offering support, and celebrating each other's courage.
                    </p>
                    <div className="lp-community-avatars">
                        {['A', 'S', 'M', 'P', 'R', 'L', 'K', 'V'].map((l, i) => (
                            <div key={i} className={`lp-avatar lp-avatar-${i % 4}`}>{l}</div>
                        ))}
                        <div className="lp-avatar lp-avatar-more">+</div>
                    </div>
                    <Link to="/signup" className="lp-btn-community">Join the Community</Link>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="lp-cta">
                <div className="lp-cta-inner">
                    <h2 className="lp-cta-title">Ready to Begin?</h2>
                    <p className="lp-cta-subtitle">Take the first step toward peace and wellness today. It's free, confidential, and always available.</p>
                    <div className="lp-cta-actions">
                        <Link to="/signup" className="lp-btn-hero-primary">Create Free Account</Link>
                        <Link to="/login" className="lp-btn-cta-ghost">Sign In</Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="lp-footer">
                <div className="lp-footer-inner">
                    <div className="lp-footer-brand">
                        <img src={logo} alt="Pathway" className="lp-footer-logo" />
                        <span className="lp-footer-name">Pathway</span>
                    </div>
                    <p className="lp-footer-tagline">Your journey to peace & wellness</p>
                    <p className="lp-footer-copy">© 2025 Pathway. All rights reserved. Made with ❤️ for every journey.</p>
                </div>
            </footer>
        </div>
    );
}
