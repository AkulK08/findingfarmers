'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Locale = 'en' | 'hi' | 'bho';

const LanguageContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({
  locale: 'en',
  setLocale: () => undefined,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('hi');

  useEffect(() => {
    const stored = window.localStorage.getItem('bk-locale-v2');
    if (stored === 'en' || stored === 'hi' || stored === 'bho') {
      setLocaleState(stored);
      document.documentElement.lang = stored === 'en' ? 'en' : 'hi';
    } else {
      document.documentElement.lang = 'hi';
    }
  }, []);

  const value = useMemo(() => ({
    locale,
    setLocale: (next: Locale) => {
      setLocaleState(next);
      window.localStorage.setItem('bk-locale-v2', next);
      document.documentElement.lang = next === 'en' ? 'en' : 'hi';
    },
  }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
