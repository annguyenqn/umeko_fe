'use client'

import { createContext, useContext, useState, ReactNode } from 'react';
import { Language, defaultLanguage, translations } from '@/config/i18n';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(defaultLanguage);

    const t = (path: string): string => {
        const keys = path.split('.');
        let current: Record<string, unknown> = translations[language];

        for (const key of keys) {
            if (typeof current !== 'object' || current === null || !(key in current)) {
                console.warn(`Translation missing for key: ${path}`);
                return path;
            }
            current = current[key] as Record<string, unknown>;
        }

        if (typeof current !== 'string') {
            console.warn(`Translation value is not a string for key: ${path}`);
            return path;
        }

        return current;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
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