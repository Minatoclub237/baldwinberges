import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TranslationSet, translations } from '../translations';

interface LanguageContextType {
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  t: TranslationSet;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<'fr' | 'en'>(() => {
    // Check localStorage if any previous preference exists, default to 'fr' (French)
    const stored = localStorage.getItem('baldwin_berges_lang');
    return (stored === 'fr' || stored === 'en') ? stored : 'fr';
  });

  const setLanguage = (lang: 'fr' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('baldwin_berges_lang', lang);
  };

  // Sync document title and lang attribute on language change
  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'fr') {
      document.title = "Baldwin Berges — Le capital au service de l'impact durable";
    } else {
      document.title = "Baldwin Berges — Capital Aligned With Sustainable Impact";
    }
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
