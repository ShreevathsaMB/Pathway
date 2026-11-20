import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { translations, languageLabels } from '../i18n';
import type { Language, Translations } from '../i18n';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    getLanguageLabel: () => string;
    /** Translation function — t('nav.home') returns the translated string */
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** Resolve a dot-notated key like 'nav.home' into the value from translations */
function resolve(obj: Translations, key: string): string {
    const parts = key.split('.');
    let current: unknown = obj;
    for (const part of parts) {
        if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
            current = (current as Record<string, unknown>)[part];
        } else {
            return key; // fallback: return the key itself
        }
    }
    return typeof current === 'string' ? current : key;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('pathway-language') as Language;
        const validLangs: Language[] = ['en', 'kn', 'hi', 'te', 'ta', 'ml'];
        return validLangs.includes(saved) ? saved : 'en';
    });

    useEffect(() => {
        localStorage.setItem('pathway-language', language);
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const getLanguageLabel = () => {
        return languageLabels[language];
    };

    const t = (key: string): string => {
        return resolve(translations[language], key);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, getLanguageLabel, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export { languageLabels };
export type { Language };
