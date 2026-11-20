import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage, languageLabels } from '../../contexts/LanguageContext';
import type { Language } from '../../contexts/LanguageContext';

export default function TopBar() {
    const { toggleDarkMode } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    return (
        <div className="top-bar">
            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder={t('topbar.search_placeholder')}
                />
            </div>

            {/* Actions */}
            <div className="top-bar-actions">
                {/* Profile (only shown on small screens, where the sidebar footer is hidden) */}
                <Link to="/profile" className="tb-profile-link" title="Profile" aria-label="Profile">
                    <User className="w-5 h-5" />
                </Link>

                {/* Dark Mode Toggle */}
                <div className="dark-mode-toggle" onClick={toggleDarkMode} title="Toggle dark mode">
                    <div className="toggle-slider"></div>
                </div>

                {/* Language Selector — all 6 languages */}
                <select
                    className="language-selector"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    title="Select language"
                >
                    {(Object.entries(languageLabels) as [Language, string][]).map(([key, label]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
