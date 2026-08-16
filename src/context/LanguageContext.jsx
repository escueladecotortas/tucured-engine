import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

import { translations } from '../data/translations';

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('es'); // Default to Spanish

    const t = (path, params = {}) => {
        const keys = path.split('.');
        let current = translations[language];

        for (const key of keys) {
            if (current === undefined || current[key] === undefined) return path;
            current = current[key];
        }

        // Safety: If result is an object (not a string), return path to prevent React crash
        if (typeof current === 'object' && current !== null) {
            console.warn(`Translation key '${path}' returned an object.`);
            return path;
        }

        // Interpolation
        if (typeof current === 'string' && Object.keys(params).length > 0) {
            return current.replace(/\{(\w+)\}/g, (_, key) => params[key] !== undefined ? params[key] : `{${key}}`);
        }

        return current;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'es' ? 'en' : 'es');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
