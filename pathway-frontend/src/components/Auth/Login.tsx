import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/axios';
import logo from '../../assets/logo_serene_path.svg';

interface LoginProps {
    setIsAuthenticated: (value: boolean) => void;
}

export default function Login({ setIsAuthenticated }: LoginProps) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authAPI.login(formData);
            const { tokens } = response.data;
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);
            setIsAuthenticated(true);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root">
            {/* ── LEFT PANEL ── */}
            <div className="auth-panel-left">
                <div className="auth-orb auth-orb-1"></div>
                <div className="auth-orb auth-orb-2"></div>
                <div className="auth-orb auth-orb-3"></div>

                <div className="auth-left-top">
                    <img src={logo} alt="Pathway" className="auth-left-logo" />
                    <span className="auth-left-brand">Pathway</span>
                </div>

                <div className="auth-left-mid">
                    <h2 className="auth-left-tagline">
                        Welcome back.<br />Your journey continues here.
                    </h2>
                    <p className="auth-left-sub">
                        Sign in to reconnect with your AI companion, track your wellness, and find the support you deserve.
                    </p>
                </div>

                <div className="auth-left-bottom">
                    <div className="auth-feature-pills">
                        <div className="auth-feature-pill">
                            <span className="auth-feature-pill-icon">🤝</span>
                            AI Companion ready to listen
                        </div>
                        <div className="auth-feature-pill">
                            <span className="auth-feature-pill-icon">🛡️</span>
                            100% private & confidential
                        </div>
                        <div className="auth-feature-pill">
                            <span className="auth-feature-pill-icon">🌍</span>
                            Support in your language
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="auth-panel-right">
                <div className="auth-form-header">
                    <h1 className="auth-form-title">Sign in</h1>
                    <p className="auth-form-sub">Enter your credentials to continue your journey</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="login-username">Username</label>
                        <input
                            id="login-username"
                            type="text"
                            className="auth-input"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="login-password">Password</label>
                        <div className="auth-input-wrap">
                            <input
                                id="login-password"
                                type={showPass ? 'text' : 'password'}
                                className="auth-input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="auth-eye-btn"
                                onClick={() => setShowPass(!showPass)}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-btn-submit"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In →'}
                    </button>
                </form>

                <div className="auth-switch">
                    Don't have an account?{' '}
                    <Link to="/signup">Create one free</Link>
                </div>

                <div className="auth-switch" style={{ marginTop: '12px' }}>
                    <Link to="/">← Back to Pathway</Link>
                </div>
            </div>
        </div>
    );
}
