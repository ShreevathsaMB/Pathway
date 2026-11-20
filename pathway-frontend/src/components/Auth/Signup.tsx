import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/axios';
import logo from '../../assets/logo_serene_path.svg';

interface SignupProps {
    setIsAuthenticated: (value: boolean) => void;
}

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'te', name: 'Telugu - తెలుగు' },
    { code: 'hi', name: 'Hindi - हिंदी' },
    { code: 'ta', name: 'Tamil - தமிழ்' },
    { code: 'kn', name: 'Kannada - ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam - മലയാളം' },
];

const ISSUES = [
    { key: 'family_conflict', label: 'Family Conflicts' },
    { key: 'intercaste_marriage', label: 'Intercaste Marriage' },
    { key: 'career', label: 'Career & Life Purpose' },
    { key: 'relationship', label: 'Relationship Issues' },
    { key: 'property_dispute', label: 'Property Disputes' },
    { key: 'depression', label: 'Depression & Loneliness' },
    { key: 'safety', label: 'Safety & Protection' },
    { key: 'other', label: 'Other' },
];

export default function Signup({ setIsAuthenticated }: SignupProps) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
        age: '',
        language_preference: 'en',
        ai_companion_name: 'Alex',
        issues: [] as string[],
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfPass, setShowConfPass] = useState(false);
    const navigate = useNavigate();

    const handleIssueToggle = (issueKey: string) => {
        setFormData((prev) => ({
            ...prev,
            issues: prev.issues.includes(issueKey)
                ? prev.issues.filter((i) => i !== issueKey)
                : [...prev.issues, issueKey],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.password_confirm) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const response = await authAPI.register(formData);
            const { tokens } = response.data;
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);
            setIsAuthenticated(true);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root">
            {/* ── LEFT PANEL (teal/indigo theme) ── */}
            <div className="auth-panel-left auth-panel-left--teal">
                <div className="auth-orb auth-orb-1"></div>
                <div className="auth-orb auth-orb-2"></div>
                <div className="auth-orb auth-orb-3"></div>

                <div className="auth-left-top">
                    <img src={logo} alt="Pathway" className="auth-left-logo" />
                    <span className="auth-left-brand">Pathway</span>
                </div>

                <div className="auth-left-mid">
                    <h2 className="auth-left-tagline">
                        Begin your path to peace & wellness.
                    </h2>
                    <p className="auth-left-sub">
                        Join thousands of people who found support, clarity, and strength through Pathway.
                        Your journey is unique — and we're here for every step.
                    </p>
                </div>

                <div className="auth-left-bottom">
                    <div className="auth-feature-pills">
                        <div className="auth-feature-pill">
                            <span className="auth-feature-pill-icon">🌿</span>
                            Personalized AI companion from day one
                        </div>
                        <div className="auth-feature-pill">
                            <span className="auth-feature-pill-icon">🌍</span>
                            6 languages supported
                        </div>
                        <div className="auth-feature-pill">
                            <span className="auth-feature-pill-icon">💜</span>
                            Non-judgmental, always available
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="auth-panel-right">
                <div className="auth-form-header">
                    <h1 className="auth-form-title">Create account</h1>
                    <p className="auth-form-sub">Free forever • Takes less than 2 minutes</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Name row */}
                    <div className="auth-grid-2">
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="su-first">First Name</label>
                            <input
                                id="su-first"
                                type="text"
                                className="auth-input"
                                placeholder="First"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="su-last">Last Name</label>
                            <input
                                id="su-last"
                                type="text"
                                className="auth-input"
                                placeholder="Last"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Username */}
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="su-username">Username</label>
                        <input
                            id="su-username"
                            type="text"
                            className="auth-input"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="su-email">Email</label>
                        <input
                            id="su-email"
                            type="email"
                            className="auth-input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    {/* Password row */}
                    <div className="auth-grid-2">
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="su-pass">Password</label>
                            <div className="auth-input-wrap">
                                <input
                                    id="su-pass"
                                    type={showPass ? 'text' : 'password'}
                                    className="auth-input"
                                    placeholder="Min. 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={8}
                                />
                                <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="su-conf">Confirm Password</label>
                            <div className="auth-input-wrap">
                                <input
                                    id="su-conf"
                                    type={showConfPass ? 'text' : 'password'}
                                    className="auth-input"
                                    placeholder="Repeat password"
                                    value={formData.password_confirm}
                                    onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                                    required
                                />
                                <button type="button" className="auth-eye-btn" onClick={() => setShowConfPass(!showConfPass)}>
                                    {showConfPass ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Age & Language */}
                    <div className="auth-grid-2">
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="su-age">Age</label>
                            <input
                                id="su-age"
                                type="number"
                                className="auth-input"
                                placeholder="18+"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                min="18"
                                max="100"
                            />
                        </div>
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="su-lang">Language</label>
                            <select
                                id="su-lang"
                                className="auth-input"
                                value={formData.language_preference}
                                onChange={(e) => setFormData({ ...formData, language_preference: e.target.value })}
                            >
                                {LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* AI companion name */}
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="su-companion">AI Companion Name</label>
                        <input
                            id="su-companion"
                            type="text"
                            className="auth-input"
                            placeholder="e.g., Alex, Lakshmi, Arjun"
                            value={formData.ai_companion_name}
                            onChange={(e) => setFormData({ ...formData, ai_companion_name: e.target.value })}
                        />
                    </div>

                    {/* Issues */}
                    <div className="auth-field">
                        <label className="auth-label">What brings you here? (optional)</label>
                        <div className="auth-issues-grid">
                            {ISSUES.map((issue) => (
                                <label
                                    key={issue.key}
                                    className={`auth-issue-label ${formData.issues.includes(issue.key) ? 'auth-issue-checked' : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        className="auth-issue-cb"
                                        checked={formData.issues.includes(issue.key)}
                                        onChange={() => handleIssueToggle(issue.key)}
                                    />
                                    {issue.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-btn-submit auth-btn-submit--teal"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create My Account →'}
                    </button>
                </form>

                <div className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login">Sign in</Link>
                </div>
                <div className="auth-switch" style={{ marginTop: '12px' }}>
                    <Link to="/">← Back to Pathway</Link>
                </div>
            </div>
        </div>
    );
}
